import { Stream } from "node:stream";

declare class parser {
	/**Sets the password used to read/parse the PDF File/Buffer */
	setPassword(password: string): void;
	/**Begins to read/parse the PDF at filePath*/
	loadPDF(filePath: string): void;
	/**Begins to read/parse the PDF in buffer*/
	parseBuffer(buffer: Buffer): void;
	/**Gets the text from pdf | ONLY WORKS INSIDE pdfParser_dataReady EVENT*/
	getRawTextContent(): string;
	/**Gets the text from pdf as a stream | ONLY WORKS INSIDE pdfParser_dataReady EVENT*/
	getRawTextContentStream(): ReadableStream;
	/**Gets the fields as an array from pdf | ONLY WORKS INSIDE pdfParser_dataReady EVENT*/
	getAllFieldsTypes(): Array<any>; //each type of field seems to have its own object structure
	/**Gets the fields as an array from pdf as a stream | ONLY WORKS INSIDE pdfParser_dataReady EVENT*/
	getAllFieldsTypesStream(): ReadableStream;
	/**Registers callback to be called when an error happens during parsing*/
	on(
		event: "pdfParser_dataError",
		callback: (errorData: PDFParserError) => void
	): void;
	/**Registers callback to be called when pdf is parsed and ready*/
	on(
		event: "pdfParser_dataReady",
		callback: (pdfData: PDFOutput) => void
	): void;
}

//Type definitions
declare type PDFPage = {
	Height: number;
	HLines: Array<{
		x: number;
		y: number;
		w: number;
		l: number;
	}>;
	VLines: Array<{
		x: number;
		y: number;
		w: number;
		l: number;
	}>;
	Fills: Array<{
		oc?: string; //custom color, not always present
		x: number;
		y: number;
		w: number;
		h: number;
		clr: number; //index to color array, -1 if oc specified
	}>;
	Texts: Array<{
		x: number;
		y: number;
		clr: number; //index to color array
		A: "left" | "right" | "center"; //alignment
		R: Array<{
			T: string; //the text
			S: number; //style array index
			TS: [number, number, number, number]; //[fontFaceId, fontSize, bold(0/1), italic(0/1)]
		}>;
	}>;
};

declare type PDFOutput = {
	formImage: {
		Agency: string;
		Transcoder: string; //pdf2json version
		Id: any; //xml meta data
		Pages: Array<PDFPage>;
		Width: number;
	};
};

declare type PDFParserError = {
	parserError: Error;
};

/**
 * The `psd2json` module enables parsing pdf documents to json
 *
 * Example Usage:
 *
 * ```js
 * import pdf2json from 'pdf2json';
 * ```
 * For api documentation
 * @see [npm](https://www.npmjs.com/package/pdf2json)
 */
declare module "pdf2json" {
	export = parser;
}
