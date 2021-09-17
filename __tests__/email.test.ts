import Imap from "imap";
import mailParser from "mailparser";
import { resolve } from "path/posix";
import { Email } from "../src/email";

describe("The Email Class", () => {
	describe("When Connecting", () => {
		it("Should call imap.connect", () => {
			const email = new Email({ user: "", password: "" });
			const spy = jest
				.spyOn((email as any)._imap, "connect")
				.mockImplementation(() => {});
			email.connect();
			expect(spy).toHaveBeenCalled();
		});
		it("Errors Should call reject Promise", () => {
			const email = new Email({ user: "", password: "" });
			jest.spyOn((email as any)._imap, "connect").mockImplementation(() => {
				(email as any)._imap.emit("error", "Connection Error");
			});
			return expect(email.connect()).rejects.toBeDefined();
		});
		it("Should resolve when imap is ready", () => {
			const email = new Email({ user: "", password: "" });
			jest.spyOn((email as any)._imap, "connect").mockImplementation(() => {
				(email as any)._imap.emit("ready", "Connection Completed");
			});
			return expect(email.connect()).resolves.toBeDefined();
		});
		it("SNI should be sent", () => {
			const email = new Email({ host: "host", user: "", password: "" });
			expect((email as any)._imap._config.tlsOptions.servername).toEqual(
				"host"
			);
		});
		it("Connection options should be properly set", () => {
			const email = new Email({
				host: "host",
				port: 55,
				user: "user",
				password: "pass",
			});
			expect((email as any)._imap._config.host).toEqual("host");
			expect((email as any)._imap._config.port).toEqual(55);
			expect((email as any)._imap._config.user).toEqual("user");
			expect((email as any)._imap._config.password).toEqual("pass");
		});
		it("Should reject if connection is already active", async () => {
			const email = new Email({ user: "", password: "" });
			jest.spyOn((email as any)._imap, "connect").mockImplementation(() => {
				(email as any)._imap.state = "connected";
				(email as any)._imap.emit("ready", "Connection Completed");
			});
			await email.connect();
			return expect(email.connect()).rejects.toBeDefined();
		});
	});
	describe("When Disconnecting", () => {
		it("Should call imap.end", () => {
			const email = new Email({ user: "", password: "" });
			(email as any)._imap.state = "connected"; //bypass already disconnected resolve
			const spy = jest
				.spyOn((email as any)._imap, "end")
				.mockImplementation(() => {});
			email.disconnect();
			expect(spy).toHaveBeenCalled();
		});
		it("Should resolve if no connection exists", () => {
			const email = new Email({ user: "", password: "" });
			return expect(email.disconnect()).resolves.toBeDefined();
		});
	});
	describe("getEmails", () => {
		it("Should use inbox if none is specified", async () => {
			const email = new Email({ user: "", password: "" });
			jest
				.spyOn((email as any)._imap, "openBox")
				.mockImplementation((box, cb: any) => {
					(email as any)._imap._box = box;
					cb();
				});
			await email.getEmails();
			expect((email as any)._imap._box).toEqual("INBOX");
		});
		it("Should reject if errors opening mailbox", () => {
			const email = new Email({ user: "", password: "" });
			jest
				.spyOn((email as any)._imap, "openBox")
				.mockImplementation((_box, cb: any) => {
					cb(true);
				});
			return expect(email.getEmails()).rejects.toBeDefined();
		});
		it("Should call fetchEmails", async () => {
			const email = new Email({ user: "", password: "" });
			jest
				.spyOn((email as any)._imap, "openBox")
				.mockImplementation((_box, cb: any) => {
					cb();
				});
			const spy = jest
				.spyOn(email as any, "_fetchEmails")
				.mockImplementation(() => {
					return Promise.resolve([""]);
				});
			await email.getEmails();
			expect(spy).toHaveBeenCalled();
		});
		it("Should resolve to an array", async () => {
			const email = new Email({ user: "", password: "" });
			jest
				.spyOn((email as any)._imap, "openBox")
				.mockImplementation((_box, cb: any) => {
					cb();
				});
			jest.spyOn(email as any, "_fetchEmails").mockImplementation(() => {
				return Promise.resolve([""]);
			});
			expect(await email.getEmails()).toBeInstanceOf(Array);
		});
		it("Should reject on fetch error", () => {});
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
