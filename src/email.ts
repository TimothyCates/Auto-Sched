//wrapper class for imap
//Makes it easier to work with imap by abstracting some event calls
import Imap from "imap";
import "dotenv/config";
import mailParser from "mailparser";
//let Imap = require('imap')

export class Email {
	private imap: Imap = new Imap({ user: "", password: "" });

	constructor(connectionDetails: Imap.Config) {
		this.imap = new Imap(connectionDetails);
	}

	public getImap() {
		return this.imap;
	}

	public connect = (): Promise<unknown> => {
		//if this fails theres not way to catch it as far as I can tell
		//[TODO] look into alternatives for catching error
		return new Promise((resolve) => {
			this.imap.connect();
			this.imap.once("ready", () => {
				resolve(true);
			});
		});
	};

	public disconnect = () => {
		return new Promise((resolve) => {
			this.imap.end();
			this.imap.once("close", () => {
				resolve(true);
			});
		});
	};

	public getEmails = (mailBox?: string): Promise<mailParser.ParsedMail[]> => {
		return new Promise((resolve, reject) => {
			this.imap.openBox(mailBox || "INBOX", true, (error) => {
				this.getBoxContents(error)
					.then(async (buffer) => {
						let emails: mailParser.ParsedMail[] = [];
						for (let i = 0; i < buffer.length; i++) {
							const message = buffer[i];
							let parsed = await mailParser.simpleParser(message);
							emails.push(parsed);
						}
						resolve(emails);
					})
					.catch((err) => {
						reject(err);
					});
			});
		});
	};

	private getBoxContents = (error: unknown): Promise<string[]> => {
		return new Promise((resolve, reject) => {
			if (error) reject(error);
			let fetch = this.imap.seq.fetch("1:*", {
				bodies: "",
			});
			let buffer: string[] = [];
			fetch.on("message", (message) => {
				message.on("body", (stream) => {
					let msgBuf = "";
					stream.on("data", (chunk) => {
						msgBuf += chunk.toString();
					});
					stream.on("end", () => {
						buffer.push(msgBuf);
					});
				});
			});
			fetch.once("error", (err: unknown) => {
				reject(error);
			});
			fetch.once("end", () => {
				resolve(buffer);
			});
		});
	};
}
