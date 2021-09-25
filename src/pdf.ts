import Pdf2json from "pdf2json";
type Shift = {
	name: string;
	start: Date;
	end: Date;
};
type Day = {
	supervisorShifts: Shift[];
	cashierShifts: Shift[];
	courtesyClerkShifts: Shift[];
};
type Daily = {
	week: Date;
	days: Day[];
};

export class PDF {
	private _pdf = new Pdf2json();
	getDaily(fileLocation: string) {
		return new Promise((resolve, reject) => {});
	}
	getPDF(fileLocation: string) {
		return new Promise((resolve, reject) => {
			this._pdf.on("pdfParser_dataError", (err) => reject(err.parserError));
			this._pdf.on("pdfParser_dataReady", (output) => resolve(output));
			this._pdf.loadPDF(fileLocation);
		});
	}
	getShifts(json: Pdf2json.PDFOutput) {
		let Shifts: Shift[] = [];
		return Shifts;
	}
}
