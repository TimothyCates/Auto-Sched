import Imap from "imap";
import mailParser, { MailParser } from "mailparser";

export class Email {
	private _imap: Imap;

	constructor(connectionOptions: Imap.Config) {
		this._imap = new Imap({
			...connectionOptions,
			tls: true,
			tlsOptions: {
				...connectionOptions.tlsOptions,
				servername: connectionOptions.host, //adds SNI to connection options
			},
		});
	}

	public connect() {
		return new Promise((resolve, reject) => {
			if (this._imap.state != "disconnected") {
				reject(new Error("Already Connected"));
			} else {
				const connError = (err: Error) => reject(err);
				this._imap.on("error", connError);
				this._imap.on("ready", () => {
					this._imap.removeListener("error", connError);
					resolve(true);
				});
				this._imap.connect();
			}
		});
	}

	public disconnect() {
		return new Promise(async (resolve) => {
			if (this._imap.state == "disconnected") resolve(true);
			else {
				await this._imap.end();
				resolve(true);
			}
		});
	}

	public getEmails(mailbox?: string) {
		return new Promise((resolve, reject) => {
			this._imap.openBox(mailbox || "INBOX", true, async (error: Error) => {
				if (error) reject(error);
				try {
					const emails = await this._fetchEmails();
					let parsedMail: mailParser.ParsedMail[] = [];
					emails.forEach(async (email, index) => {
						let parsedEmail = await mailParser.simpleParser(email);
						parsedMail.push(parsedEmail);
					});
					resolve(parsedMail);
				} catch (e) {
					reject(e);
				}
			});
		});
	}

	private _fetchEmails(): Promise<string[]> {
		let x: mailParser.ParsedMail;
		return new Promise((resolve, reject) => {
			let buffer: string[] = [];
			let fetchOptions = { bodies: "" };
			let emailStream = this._imap.fetch("1:*", fetchOptions);
			emailStream.on("message", (message) => {
				message.on("body", (stream) => {
					let msgBuf = "";
					stream.on("data", (chunk) => {
						msgBuf += chunk.toString();
					});
					stream.on("end", () => buffer.push(msgBuf));
					stream.on("error", (err) => reject(err));
				});
			});
			emailStream.on("error", (err) => reject(err));
			emailStream.on("end", () => resolve(buffer));
		});
	}
}
