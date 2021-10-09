import { Daily } from "../src/lib/daily";
import { Mocks } from "./mocks/daily.mock";

const Mock = new Mocks();
const daily = new Daily();
const dailyClass = daily as any;

const toObject = function (theClass: any) {
	const original = theClass;
	const keys = Object.keys(theClass);
	return keys.reduce((classAsObj: any, key: any) => {
		if (
			typeof original[key] === "object" &&
			original[key].hasOwnProperty("toObject")
		)
			classAsObj[key] = original[key].toObject();
		else if (
			typeof original[key] === "object" &&
			original[key].hasOwnProperty("length")
		) {
			classAsObj[key] = [];
			for (var i = 0; i < original[key].length; i++) {
				if (
					typeof original[key][i] === "object" &&
					original[key][i].hasOwnProperty("toObject")
				) {
					classAsObj[key].push(original[key][i].toObject());
				} else {
					classAsObj[key].push(original[key][i]);
				}
			}
		} else if (typeof original[key] === "function") {
		} //do nothing
		else classAsObj[key] = original[key];
		return classAsObj;
	}, {});
};
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
			output = toObject(output);
			expect(output).toEqual(Mock.expectedParseOutput);
		});
	});
});
