import { catchClause } from "@babel/types";
import Imap from "imap";
import mailParser from "mailparser";
import { resolve } from "path/posix";
import { Email } from "../src/email";

const email = new Email({
	host: "host",
	port: 55,
	user: "user",
	password: "pass",
});
afterAll(() => {
	jest.restoreAllMocks();
});

const emailClass = email as any;

describe("The Email Class", () => {
	describe("When Connecting", () => {
		it("Should call imap.connect", async () => {
			const spy = jest
				.spyOn(emailClass._imap, "connect")
				.mockImplementation(() => {
					emailClass._imap.emit("ready");
				});
			await email.connect();
			expect(spy).toHaveBeenCalled();
		});
		it("Errors should cause a reject", async () => {
			jest.spyOn(emailClass._imap, "connect").mockImplementation(() => {
				emailClass._imap.emit("error", new Error("Connection Error"));
			});
			await expect(email.connect()).rejects.toThrow("Connection Error");
		});
		it("Should resolve when imap is ready", () => {
			jest.spyOn(emailClass._imap, "connect").mockImplementation(() => {
				emailClass._imap.emit("ready", "Connection Completed");
			});
			return expect(email.connect()).resolves.toBeDefined();
		});
		it("SNI should be sent", () => {
			expect(emailClass._imap._config.tlsOptions.servername).toEqual("host");
		});
		it("Connection options should be properly set", () => {
			expect(emailClass._imap._config.host).toEqual("host");
			expect(emailClass._imap._config.port).toEqual(55);
			expect(emailClass._imap._config.user).toEqual("user");
			expect(emailClass._imap._config.password).toEqual("pass");
		});
		it("Should reject if connection already active", async () => {
			jest.spyOn(emailClass._imap, "connect").mockImplementation(() => {
				emailClass._imap.state = "connected";
				emailClass._imap.emit("ready", "Connection Completed");
			});
			await email.connect();
			await expect(email.connect()).rejects.toThrow("Already Connected");
			emailClass._imap.state = "disconnected";
		});
	});
	describe("When Disconnecting", () => {
		it("Should call imap.end", async () => {
			emailClass._imap.state = "connected"; //bypass already disconnected resolve
			const spy = jest.spyOn(emailClass._imap, "end").mockImplementation(() => {
				emailClass._imap.emit("close");
			});
			await email.disconnect();
			expect(spy).toHaveBeenCalled();
			emailClass._imap.state = "disconnected";
		});
		it("Should resolve if no connection exists", async () => {
			await expect(email.disconnect()).resolves.toBeDefined();
		});
	});
	describe("getEmails", () => {
		it("Should use inbox if none is specified", async () => {
			jest
				.spyOn(emailClass._imap, "openBox")
				.mockImplementation((box, cb: any) => {
					emailClass._imap._box = box;
					cb();
				});
			jest.spyOn(emailClass, "_fetchEmails").mockImplementation(() => {
				return Promise.resolve([""]);
			});

			await email.getEmails();
			expect(emailClass._imap._box).toEqual("INBOX");
		});
		it("Should reject on openBox errors", async () => {
			jest
				.spyOn(emailClass._imap, "openBox")
				.mockImplementation((_box, cb: any) => {
					cb(new Error("Openbox Error"));
				});
			await expect(email.getEmails()).rejects.toThrow("Openbox Error");
		});
		it("Should call fetchEmails", async () => {
			jest
				.spyOn(emailClass._imap, "openBox")
				.mockImplementation((_box, cb: any) => {
					cb();
				});
			const spy = jest
				.spyOn(emailClass, "_fetchEmails")
				.mockImplementation(() => {
					return Promise.resolve([""]);
				});
			await email.getEmails();
			expect(spy).toHaveBeenCalled();
		});
		it("Should resolve to an array", async () => {
			jest
				.spyOn(emailClass._imap, "openBox")
				.mockImplementation((_box, cb: any) => {
					cb();
				});
			jest.spyOn(emailClass, "_fetchEmails").mockImplementation(() => {
				return Promise.resolve([""]);
			});
			expect(await email.getEmails()).toBeInstanceOf(Array);
		});
		it("Should reject on _fetch errors", async () => {
			jest
				.spyOn(emailClass._imap, "openBox")
				.mockImplementation((_box, cb: any) => {
					cb();
				});
			jest.spyOn(emailClass, "_fetchEmails").mockImplementation(() => {
				return Promise.reject(new Error("Fetch Error"));
			});
			await expect(email.getEmails()).rejects.toThrow("Fetch Error");
		});
	});
	describe("fetchEmails", () => {
		it("should reject on error", () => {});
		it("should resolve on end", () => {});
		it("Should resolve to array", () => {});
		it("Should join data chunks", () => {});
		it("Should resolve on stream end", () => {});
		it("Should reject on stream error", () => {});
	});
});
