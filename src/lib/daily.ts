import { PDFOutput } from 'pdf2json';
import { PDF, PdfText } from './pdf';
import { Time } from './time';

class Shift {
	Name: String;
	Start: Date;
	End: Date;
	Line: Number;
	constructor() {
		this.Name = '';
		this.Start = this.End = new Date();
		this.Line = 0;
	}
	setStart(date: Date) {
		this.Start = new Date(date);
	}
	setEnd(date: Date) {
		this.End = new Date(date);
	}
}

class Day {
	Date: Date | undefined;
	Shifts: Map<String, Shift[]>;
	constructor(day?: Date, shifts?: Map<String, Shift[]>) {
		if (day != undefined) this.setDate(day);
		if (shifts != undefined) this.Shifts = shifts;
		else this.Shifts = new Map();
	}
	setDate(date: Date) {
		this.Date = new Date(date);
	}
}

class Week {
	Week: Date | undefined;
	Days: Day[];
	constructor() {
		this.Days = [];
	}
	setWeek(date: Date) {
		this.Week = new Date(date);
	}
	hasWeek() {
		return this.Week != undefined;
	}
}

const DEFAULT_DEPARTMENTS = [
	"Front End Supervisor'P'",
	"Cashier'-'",
	"Backup - Cashier'-'",
	"Self Checkout'U'",
	"Courtesy Clerk'B'",
	"Service Desk'D'",
	"Utility Clerk'C'",
	"Fuel'Z'",
	"Bookkeeper'V'",
	"Human Resources'K'",
];

export class Daily {
	private _departments;
	private _pdf = new PDF();

	constructor(departmentList?: String[]) {
		this._departments = departmentList || DEFAULT_DEPARTMENTS;
	}

	async parseDaily(fileLocation: string) {
		let pdf = await this._pdf.getPDF(fileLocation);
		return this._getWeek(pdf);
	}

	private _isTitle(text: any) {
		const titleThreshold = { x: 54, y: 1 };
		if (text.x <= titleThreshold.x && text.y <= titleThreshold.y) return true;
		return false;
	}

	private _isShiftDetail(text: any) {
		const detailThreshold = { x: 17, y: 3 };
		const ignoredText = ['Forecasted Headcount'];
		if (text.x <= detailThreshold.x && text.y >= detailThreshold.y) {
			const decoded = decodeURI(text.R[0].T);
			if (!ignoredText.includes(decoded)) return true;
		}
		return false;
	}

	private _mergeShifts(newShifts: PdfText[], oldShifts: Map<String, Shift[]>) {
		const shifts = this._getShifts(newShifts);
		const newMap = new Map(oldShifts);
		shifts.forEach((shift, department) => {
			newMap.set(department, [...(newMap.get(department) || []), ...shift]);
		});
		return newMap;
	}

	private _getWeek(chartJson: PDFOutput): Promise<Week> {
		let daily = new Week();
		return new Promise(async (resolve, reject) => {
			try {
				for (const page of chartJson.formImage.Pages) {
					let tempDayIndex: number = 0;
					let tempDepartment: string = '';
					let textList: PdfText[] = [];

					for (const text of page.Texts) {
						const decodedText = decodeURI(text.R[0].T);
						if (this._isTitle(text)) {
							const date = Time.getDateFromString(decodedText);
							tempDayIndex = date.getDay();
							if (!daily.hasWeek()) daily.setWeek(date);
							if (daily.Days[tempDayIndex]?.Date === undefined)
								daily.Days[tempDayIndex] = new Day(date);
						}
						if (this._isShiftDetail(text)) {
							if (this._departments.includes(decodedText)) tempDepartment = decodedText;
							else
								textList.push({
									text: decodedText,
									department: tempDepartment,
									pos: {
										x: text.x,
										y: text.y,
									},
									date: new Date(daily.Days[tempDayIndex].Date || new Date()),
								});
						}
					}
					daily.Days[tempDayIndex].Shifts = this._mergeShifts(
						textList,
						daily.Days[tempDayIndex].Shifts
					);
				}
				resolve(daily);
			} catch (error) {
				reject(error);
			}
		});
	}

	private _getOverrideArray(shift: PdfText): [string, any] {
		const startTimeThreshold = 9;
		const endTimeThreshold = 11;
		let override: [string, any] = ['', undefined];
		if (shift.pos.x < startTimeThreshold) {
			override[0] = 'Name';
			override[1] = shift.text;
		} else if (shift.pos.x < endTimeThreshold) {
			override[0] = 'Start';
			override[1] = Time.getFromString(shift.text, shift.date);
		} else {
			override[0] = 'End';
			override[1] = Time.getFromString(shift.text, shift.date);
		}
		return override;
	}

	private _findIndexOf(shift: PdfText, shiftMap: Map<string, Shift[]>): number {
		let Shifts = shiftMap.get(shift.department) || [];
		let index = -1;
		for (let i = 0; i < Shifts.length; i++) {
			const found = Shifts[i];
			if (found.Line == shift.pos.y) {
				index = i;
				break;
			}
		}
		return index;
	}

	private _getShifts(shifts: PdfText[]): Map<string, Shift[]> {
		let shiftMap: Map<string, Shift[]> = new Map();
		for (const shift of shifts) {
			let override = this._getOverrideArray(shift);
			let tempShifts = shiftMap.get(shift.department) || [];
			let foundIndex = this._findIndexOf(shift, shiftMap);

			if (foundIndex > -1) {
				(tempShifts[foundIndex] as any)[override[0]] = override[1];
			} else {
				let count = tempShifts.push(new Shift());
				(tempShifts[count - 1] as any)[override[0]] = override[1];
				tempShifts[count - 1].Line = shift.pos.y;
			}

			shiftMap.set(shift.department, tempShifts);
		}
		return shiftMap;
	}
}
