import Pdf2json from 'pdf2json';

enum DAY {
	Sunday,
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
}
type Shift = {
	name: string;
	start: Date;
	end: Date;
};
type Day = {
	date: Date | undefined;
	shifts: Map<String, Shift[]>;
};
type Daily = {
	week: Date | undefined;
	days: [Day];
};

export class PDF {
	private _defaultDepartmentHeads = [
		"Front End Supervisor'P'",
		"Cashier'-'",
		"Backup - Cashier'-'",
		"Self Checkout'U'",
		"Courtesy Clerk'B'",
		"Service Desk'D'",
		"Utility Clerk'C'",
		"Fuel'Z'",
		"Bookkeeper'V'",
	];

	private _defaultBreakHeads = [
		"Front End Supervisor'P'",
		"Cashier'-'",
		"Backup - Cashier'-'",
		"Self Checkout'U'",
		"Courtesy Clerk'B'",
		"Service Desk'D'",
		"Bookkeeper'V'",
	];
	private _pdf = new Pdf2json();
	private _getDateFromDaily(text: string): Date {
		const dateStrings = text.split(' ')[5].split('_');
		return new Date(+dateStrings[3], +dateStrings[1] - 1, +dateStrings[2]);
	}
	getDaily(
		fileLocation: string,
		options?: { departmentHeaders: string[]; breakHeaders: string[] }
	) {
		let daily: Daily;
		return new Promise(async (resolve, reject) => {
			try {
				let chart = await this.getPDF(fileLocation);
				for (let i = 0; i < chart.formImage.Pages.length; i++) {
					let currDate: Date;
					let currDepartment;
					const page = chart.formImage.Pages[i].Texts;
					let shiftText = [];
					for (const text of page) {
						const decoded = decodeURI(text.R[0].T);
						//Get the chart's date and assign it to control variable
						//Also set the week of variable
						if (text.y <= 1 && text.x <= 54) {
							const date = this._getDateFromDaily(decoded);
							currDate = date.getDay();
							if (daily.week === undefined) daily.week = date;
							if (daily.days[currDate].date === undefined) daily.days[currDate].date = date;
						} else if (text.x <= 17 && text.y >= 3 && decoded !== 'Forecasted Headcount') {
							if (decoded in (options?.departmentHeaders || this._defaultDepartmentHeads)) {
								currDepartment = decoded;
							} else {
								shiftText.push({
									text: decoded,
									department: currDepartment,
									x: text.x,
									y: text.y,
								});
							}
						}
					}
				}
				resolve(daily);
			} catch (error) {
				reject(error);
			}
		});
	}
	getPDF(fileLocation: string): Promise<Pdf2json.PDFOutput> {
		return new Promise((resolve, reject) => {
			this._pdf.on('pdfParser_dataError', (err) => reject(err.parserError));
			this._pdf.on('pdfParser_dataReady', (output) => resolve(output));
			this._pdf.loadPDF(fileLocation);
		});
	}
	getShifts(json: Pdf2json.PDFOutput) {
		let Shifts: Shift[] = [];
		return Shifts;
	}
}
