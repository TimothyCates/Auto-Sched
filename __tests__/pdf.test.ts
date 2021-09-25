import { PDF } from "../src/pdf";
const pdf = new PDF();
const pdfClass = pdf as any;
const examplePDF = {
	formImage: {
		Agency: "",
		Id: undefined,
		Pages: [
			{
				Texts: [
					{
						x: 3.197,
						y: 0,
						R: {
							T: "Shift 1",
						},
					},
					{
						x: 9.001,
						y: 0,
						R: {
							T: "600A",
						},
					},
					{
						x: 11.001,
						y: 0,
						R: {
							T: "800P",
						},
					},
					{
						x: 3.197,
						y: 15,
						R: {
							T: "Shift 2",
						},
					},
					{
						x: 9.001,
						y: 0,
						R: {
							T: "700A",
						},
					},
					{
						x: 11.001,
						y: 0,
						R: {
							T: "1100P",
						},
					},
				],
			},
		],
		Width: 0,
	},
};
describe("The PDF Class", () => {
	describe("getPDF", () => {
		afterAll(() => {
			jest.restoreAllMocks();
		});
		it("Should resolve on pdfParser_dataReady", async () => {
			jest.spyOn(pdfClass._pdf, "loadPDF").mockImplementation(() => {
				pdfClass._pdf.emit("pdfParser_dataReady");
			});
			await expect(pdf.getPDF("")).resolves.toBeDefined();
		});
		it("Should reject on pdfParser_dataError", async () => {
			jest.spyOn(pdfClass._pdf, "loadPDF").mockImplementation(() => {
				pdfClass._pdf.emit("pdfParser_dataError");
			});
			await expect(pdf.getPDF("")).rejects.toThrow();
		});
	});
	describe("getShifts", () => {
		it("Produces array of shift objects from pdf json page object", () => {
			let shifts = pdf.getShifts(examplePDF);
			expect(shifts).toEqual([
				{ name: "Shift 1", start: "600A", end: "800p" },
				{ name: "Shift 1", start: "600A", end: "800p" },
			]);
		});
	});
	describe("getDaily", () => {
		it("rejects if getPDF fails", async () => {
			jest.spyOn(pdfClass, "getPDF").mockImplementation(() => {
				return Promise.reject(new Error("getPDF Error"));
			});
			await expect(pdf.getDaily("")).rejects.toThrow("getPDF Error");
		});
	});
});
