import { Time } from '../src/lib/time';
describe('The Time Class', () => {
	describe('getDateFromString', () => {
		it('Should return correct date object from date string', () => {
			let exampleDate = new Date(2021, 0, 1);
			let dateString = 'Store Number Department Front End Day_01_01_2021';
			expect(Time.getDateFromString(dateString)).toEqual(exampleDate);
		});
		it('Should Error if incorrect string is passed', () => {
			expect(() => {
				Time.getDateFromString('Invalid String');
			}).toThrow('Invalid String');
		});
		it('Should Error if incorrect date format is passed', () => {
			expect(() => {
				Time.getDateFromString('Store Number Department Front End Day_01_billy_2021');
			}).toThrow('Invalid Date');
		});
	});
	describe('getFromString', () => {
		let date = new Date(2021, 0, 1);
		it('Should return correct time from time string', () => {
			let expectedTime = new Date(2021, 0, 1, 6, 0, 0);
			expect(Time.getFromString('600 A', date)).toEqual(expectedTime);
		});
		it('Should return correct time from time string', () => {
			expect(() => {
				Time.getFromString('CheeserBurger A', date);
			}).toThrow('Invalid Time');
			expect(() => {
				Time.getFromString('9900 P', date);
			}).toThrow('Invalid Time');
		});
	});
});
