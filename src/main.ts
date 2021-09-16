import { Email } from "./email";
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

const email = new Email(EmailOptions);

async function test() {
	await email.connect();
	let emails: mailParser.ParsedMail[] = await email.getEmails().catch((err) => {
		throw err;
	});
	if (Array.isArray(emails)) {
		for (let i = 0; i < emails.length; i++) {
			const msg = emails[i];
			console.log(`Email:\n${msg.subject}
		\nAttachments: [${msg.attachments.length}]
		`);
		}
	}
	email.disconnect();
}

test();
