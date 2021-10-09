import { Daily } from "../../src/lib/daily";
import { PdfText, PDF } from "../../src/lib/pdf";

class Shift {
	Name: String;
	Start: Date;
	End: Date;
	Line: Number;
	constructor(
		name: string = "",
		start: Date = new Date(),
		end: Date = new Date(),
		Line: number = 0
	) {
		this.Name = name;
		this.Start = start;
		this.End = end;
		this.Line = Line;
	}
}

enum pos {
	name = 0,
	start = 10,
	end = 12,
}

export class Mocks {
	examplePdfText: PdfText[] = [
		{
			text: "Shift 1",
			department: "Dep 1",
			pos: {
				x: pos.name,
				y: 0,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "600 A",
			department: "Dep 1",
			pos: {
				x: pos.start,
				y: 0,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "900 A",
			department: "Dep 1",
			pos: {
				x: pos.end,
				y: 0,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "Shift 2",
			department: "Dep 1",
			pos: {
				x: pos.name,
				y: 1,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "1100 A",
			department: "Dep 1",
			pos: {
				x: pos.start,
				y: 1,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "600 P",
			department: "Dep 1",
			pos: {
				x: pos.end,
				y: 1,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "Shift 1",
			department: "Dep 2",
			pos: {
				x: pos.name,
				y: 2,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "600 A",
			department: "Dep 2",
			pos: {
				x: pos.start,
				y: 2,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "900 A",
			department: "Dep 2",
			pos: {
				x: pos.end,
				y: 2,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "Shift 2",
			department: "Dep 2",
			pos: {
				x: pos.name,
				y: 3,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "1100 A",
			department: "Dep 2",
			pos: {
				x: pos.start,
				y: 3,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "600 P",
			department: "Dep 2",
			pos: {
				x: pos.end,
				y: 3,
			},
			date: new Date(2021, 0, 1),
		},
	];
	mergePdfText: PdfText[] = [
		{
			text: "Shift 1",
			department: "Dep 3",
			pos: {
				x: pos.name,
				y: 0,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "600 A",
			department: "Dep 3",
			pos: {
				x: pos.start,
				y: 0,
			},
			date: new Date(2021, 0, 1),
		},
		{
			text: "900 A",
			department: "Dep 3",
			pos: {
				x: pos.end,
				y: 0,
			},
			date: new Date(2021, 0, 1),
		},
	];
	examplePDFData: any = {
		formImage: {
			Agency: undefined,
			Transcoder: undefined,
			Id: {},
			Pages: [
				{
					Texts: [
						{
							x: 21,
							y: 0.8,
							w: 164,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "Store%20001%20Department%20Front%20End%20Sunday_01_03_2021",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 8,
							y: 3,
							w: 62,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "Department%20One",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 3,
							y: 3.9,
							w: 50,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "Person%20One",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 9,
							y: 3.9,
							w: 19,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "1000%20A",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 11,
							y: 3.9,
							w: 15,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "600%20P",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 3,
							y: 4,
							w: 43,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "Person%20Two",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 9,
							y: 4,
							w: 15,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "100%20P",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 11,
							y: 4,
							w: 15,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "200%20P",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 8.506,
							y: 7.813000000000001,
							w: 60.696,
							sw: 0.32553125,
							clr: 0,
							A: "left",
							R: [
								{
									T: "Forecasted%20Headcount",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 9,
							y: 8,
							w: 24,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "Department%20Two",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 3,
							y: 9,
							w: 47,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "Person%20Three",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 9,
							y: 9,
							w: 19,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "1200%20A",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 11,
							y: 9,
							w: 19,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "600%20A",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 3,
							y: 10,
							w: 46,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "Person%20Four",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 9,
							y: 10,
							w: 15,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "630%20A",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
						{
							x: 11,
							y: 10,
							w: 19,
							sw: 0.3,
							clr: 0,
							A: "left",
							R: [
								{
									T: "1230%20P",
									S: 51,
									TS: [0, 9, 0, 0],
								},
							],
						},
					],
				},
			],
			Width: 0,
		},
	};
	expectedParseOutput = {
		Days: [
			{
				Date: new Date("2021-1-3"),
				Shifts: new Map([
					[
						"Department One",
						[
							{
								Name: "Person One",
								Start: new Date(2021, 0, 3, 10, 0),
								End: new Date(2021, 0, 3, 18, 0),
								Line: 3.9,
							},
							{
								Name: "Person Two",
								Start: new Date(2021, 0, 3, 13, 0),
								End: new Date(2021, 0, 3, 14, 0),
								Line: 4,
							},
						],
					],
					[
						"Department Two",
						[
							{
								Name: "Person Three",
								Start: new Date(2021, 0, 3, 0, 0),
								End: new Date(2021, 0, 3, 6, 0),
								Line: 9,
							},
							{
								Name: "Person Four",
								Start: new Date(2021, 0, 3, 6, 30),
								End: new Date(2021, 0, 3, 12, 30),
								Line: 10,
							},
						],
					],
				]),
			},
		],
		Week: new Date("2021-1-3"),
	};
	expectedShiftMap: Map<string, Shift[]> = new Map();
	MergeShiftMap: Map<string, Shift[]> = new Map();
	constructor() {
		this.expectedShiftMap.set("Dep 1", [
			new Shift("Shift 1", new Date(2021, 0, 1, 6), new Date(2021, 0, 1, 9), 0),
			new Shift(
				"Shift 2",
				new Date(2021, 0, 1, 11),
				new Date(2021, 0, 1, 18),
				1
			),
		]);
		this.expectedShiftMap.set("Dep 2", [
			new Shift("Shift 1", new Date(2021, 0, 1, 6), new Date(2021, 0, 1, 9), 2),
			new Shift(
				"Shift 2",
				new Date(2021, 0, 1, 11),
				new Date(2021, 0, 1, 18),
				3
			),
		]);
		this.MergeShiftMap = new Map(this.expectedShiftMap);
		this.MergeShiftMap.set("Dep 3", [
			new Shift("Shift 1", new Date(2021, 0, 1, 6), new Date(2021, 0, 1, 9), 0),
		]);
	}
}
