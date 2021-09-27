import Pdf2json from 'pdf2json';

//Class for dealing with Daily-DateTime
class Time {
	static getDate(text: string) {
		const dateStrings = text.split(' ')[5].split('_');
		return new Date(+dateStrings[3], +dateStrings[1] - 1, +dateStrings[2]);
	}
	//Takes a time in string format (eg: 600 A; 700 P)
	//outputs date object of that said time
	static getTime(timeString: string, day: Date) {
		let timeMod = 0;
		if (timeString[timeString.length - 1] == 'P') timeMod = 1200;
		let time = +timeString.substr(0, timeString.length - 1).trim();
		if (time == 1200) time -= 1200;
		time += timeMod;
		time = time / 100;
		day.setHours(time, (time % 1) * 100);
		return day;
	}
}

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

class Daily {
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

//used for storing information about json from pdf for processing
type PdfText = {
	text: string;
	department: string;
	pos: {
		x: number;
		y: number;
	};
	date: Date;
};

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
export class PDF {
	private _pdf = new Pdf2json();
	private _departments;

	constructor(departmentList?: String[]) {
		this._departments = departmentList || DEFAULT_DEPARTMENTS;
	}

	getDaily(fileLocation: string): Promise<Daily> {
		let daily = new Daily();
		return new Promise(async (resolve, reject) => {
			try {
				let chartJson = await this.getPDF(fileLocation);
				for (const page of chartJson.formImage.Pages) {
					let tempDayIndex: number = 0;
					let tempDepartment: string = ''; //useful for quickly showing invalid daily object to user
					let textList: PdfText[] = [];
					for (const text of page.Texts) {
						const decodedText = decodeURI(text.R[0].T);
						//Get Charts Date and set controls / unset dates
						if (text.y <= 1 && text.x <= 54) {
							const date = Time.getDate(decodedText);
							tempDayIndex = date.getDay();
							if (!daily.hasWeek()) daily.setWeek(date);
							if (daily.Days[tempDayIndex]?.Date === undefined)
								daily.Days[tempDayIndex] = new Day(date);
							//Get text that is in area where shift information is stored on pdf
							//That is also not the Forecasted Headcount Label
						} else if (text.x <= 17 && text.y >= 3 && decodedText !== 'Forecasted Headcount') {
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
					//Add shifts to day object
					const shifts = this.getShifts(textList);
					shifts.forEach((shift, department) => {
						let dailyShifts = daily.Days[tempDayIndex].Shifts;
						dailyShifts.set(department, [...(dailyShifts.get(department) || []), ...shift]);
					});
				}
				resolve(daily);
			} catch (error) {
				reject(error);
			}
		});
	}

	//wrap pdf2json in promise
	getPDF(fileLocation: string): Promise<Pdf2json.PDFOutput> {
		return new Promise((resolve, reject) => {
			this._pdf.on('pdfParser_dataError', (err) => reject(err.parserError));
			this._pdf.on('pdfParser_dataReady', (output) => resolve(output));
			this._pdf.loadPDF(fileLocation);
		});
	}
	getShifts(shifts: PdfText[]): Map<string, Shift[]> {
		let shiftMap: Map<string, Shift[]> = new Map();
		for (const shift of shifts) {
			//Determine override property name and its value
			let override = [];
			if (shift.pos.x < 9) {
				override[0] = 'Name';
				override[1] = shift.text;
			} else if (shift.pos.x < 11) {
				override[0] = 'Start';
				override[1] = Time.getTime(shift.text, shift.date);
			} else {
				override[0] = 'End';
				override[1] = Time.getTime(shift.text, shift.date);
			}

			let tempShifts = shiftMap.get(shift.department) || [];
			let tempShiftIndex = undefined;
			for (let i = 0; i < tempShifts.length; i++) {
				const found = tempShifts[i];
				if (found.Line == shift.pos.y) {
					tempShiftIndex = i;
					break;
				}
			}
			//override the shift property
			if (tempShiftIndex != undefined) {
				(tempShifts[tempShiftIndex] as any)[override[0]] = override[1];
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
