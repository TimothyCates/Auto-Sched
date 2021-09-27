import Pdf2json from 'pdf2json';

type PdfText = {
	text: string;
	department: string;
	pos: {
		x: number;
		y: number;
	};
	date: Date;
};
export class PDF {
	private _pdf = new Pdf2json();
	getPDF(fileLocation: string): Promise<Pdf2json.PDFOutput> {
		return new Promise((resolve, reject) => {
			this._pdf.on('pdfParser_dataError', (err) => reject(err.parserError));
			this._pdf.on('pdfParser_dataReady', (output) => resolve(output));
			this._pdf.loadPDF(fileLocation);
		});
	}
}
