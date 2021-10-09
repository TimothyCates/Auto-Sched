import { Daily } from "../src/lib/daily";
import { Mocks } from "./mocks/daily.mock";

const Mock = new Mocks();
const daily = new Daily();
const dailyClass = daily as any;

describe("The Daily Class", () => {
	describe("_getShifts", () => {
		it("Should take PdfText Array and output ShiftMap", () => {
			let shifts = dailyClass._getShifts(Mock.examplePdfText);
			expect(shifts).toEqual(Mock.expectedShiftMap);
		});
		it("Should return empty map if no shifts are passed", () => {
			let shifts = dailyClass._getShifts([]);
			expect(shifts).toEqual(new Map());
		});
	});
	describe("_mergeShifts", () => {
		it("Should take PdfText Array and shiftMap, merging both", () => {
			let shifts = dailyClass._mergeShifts(
				Mock.mergePdfText,
				Mock.expectedShiftMap
			);
			expect(shifts).toEqual(Mock.MergeShiftMap);
		});
		it("Should take return old map if empty array passed", () => {
			let shifts = dailyClass._mergeShifts([], Mock.expectedShiftMap);
			expect(shifts).toEqual(Mock.expectedShiftMap);
		});
	});
	describe("parseDaily", () => {
		it("should produce expected output", async () => {
			const mockDaily = new Daily(["Department One", "Department Two"]);
			const mockClass = mockDaily as any;
			jest.spyOn(mockClass._pdf, "getPDF").mockImplementation(() => {
				return Mock.examplePDFData;
			});
			let output: any = await mockDaily.parseDaily("");
			expect(output).toEqual(Mock.expectedParseOutput);
		});
	});
});
