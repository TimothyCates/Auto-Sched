export class Time {
	//String Format: Saturday_06_27_2021
	static getDateFromString(text: string) {
		if (text.split(" ").length < 6) throw new Error("Invalid String");
		const dateStrings = text.split(" ")[5].split("_");
		let date = new Date(+dateStrings[3], +dateStrings[1] - 1, +dateStrings[2]);
		if (date.toString() != "Invalid Date") return date;
		else throw new Error("Invalid Date");
	}
	//String Format: 600 P
	static getFromString(timeString: string, day?: Date) {
		day = day || new Date();
		let timeMod = 0;

		if (timeString[timeString.length - 1] == "P") timeMod = 1200;
		let time = +timeString.substr(0, timeString.length - 1).trim();

		if (time >= 1200) time -= 1200;
		time += timeMod;
		time = time / 100;
		day.setHours(time, Math.round((time % 1) * 100));
		if (day.toString() != "Invalid Date") return day;
		else throw new Error("Invalid Time");
	}
}
