import Imap from "imap";
import mailParser from "mailparser";

export class Email {
	private _imap: Imap;

	constructor(connectionOptions: Imap.Config) {
		this._imap = new Imap({
			...connectionOptions,
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
}
