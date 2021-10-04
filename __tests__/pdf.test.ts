import { PDF } from '../src/lib/pdf';
const pdf = new PDF();
const pdfClass = pdf as any;
describe('The PDF Class', () => {
	describe('getPDF', () => {
		afterAll(() => {
			jest.restoreAllMocks();
		});
		it('Should resolve on pdfParser_dataReady', async () => {
			jest.spyOn(pdfClass._pdf, 'loadPDF').mockImplementation(() => {
				pdfClass._pdf.emit('pdfParser_dataReady', '');
			});
			await expect(pdf.getPDF('')).resolves.toBeDefined();
		});
		it('Should reject on pdfParser_dataError', async () => {
			jest.spyOn(pdfClass._pdf, 'loadPDF').mockImplementation(() => {
				pdfClass._pdf.emit('pdfParser_dataError');
			});
			await expect(pdf.getPDF('')).rejects.toThrow();
		});
	});
});
