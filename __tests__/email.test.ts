import * as Email from "../src/email";
import Imap from "imap";
import mailParser from "mailparser";

declare var process: {
	env: {
		EMAIL_HOST: string;
		EMAIL_PORT: number;
		EMAIL_USER: string;
		EMAIL_PASS: string;
	};
};

const EmailOptions: Imap.Config = {
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	user: process.env.EMAIL_USER,
	password: process.env.EMAIL_PASS,
	tls: true,
	tlsOptions: {
		servername: process.env.EMAIL_HOST, //sni for the servers that require it (gmail)
	},
};

const InvalidEmailOptions: Imap.Config = {
	host: "null",
	port: 993,
	user: "user",
	password: "pass",
	tls: true,
};

describe("Email", () => {
	it("Should create Imap with passed in values", () => {
		const email = new Email.Email(InvalidEmailOptions);
		const imap: any = email.getImap();
		expect(imap._config.host).toEqual(InvalidEmailOptions.host);
		expect(imap._config.port).toEqual(InvalidEmailOptions.port);
		expect(imap._config.user).toEqual(InvalidEmailOptions.user);
		expect(imap._config.password).toEqual(InvalidEmailOptions.password);
		expect(imap._config.tls).toEqual(InvalidEmailOptions.tls);
	});
	it("Should authenticate with Imap Server", async () => {
		const email = new Email.Email(EmailOptions);
		await email.connect();
		expect(email.getImap().state).toEqual("authenticated");
		await email.disconnect();
	});
	it("Should properly disconnect from server when disconnect it called", async () => {
		const email = new Email.Email(EmailOptions);
		await email.connect();
		await email.disconnect();
		expect(email.getImap().state).toEqual("disconnected");
	});
	it("Should return a list of emails", async () => {
		const email = new Email.Email(EmailOptions);
		await email.connect();
		let emails: mailParser.ParsedMail[] = await email.getEmails();
		expect(Array.isArray(emails)).toBeTruthy();
		await email.disconnect();
	});
	it("Should return an error when accessing nonexistent mailbox", async () => {
		const email = new Email.Email(EmailOptions);
		await email.connect();
		let emails: mailParser.ParsedMail[] = await email
			.getEmails("sdfasdf")
			.catch((err) => {
				expect(err).toBeTruthy();
				return [];
			});
		await email.disconnect();
	});
});
