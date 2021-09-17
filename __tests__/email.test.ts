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
			const email = new Email({
				host: "host",
				port: 55,
				user: "user",
				password: "pass",
			});
			jest.spyOn((email as any)._imap, "connect").mockImplementation(() => {
				(email as any)._imap.state = "connected";
				(email as any)._imap.emit("ready", "Connection Completed");
			});
			await email.connect();
			return expect(email.connect()).rejects.toBeDefined();
		});
	});
	describe("When Disconnecting", () => {
		it("Should call imap.end", () => {});
		it("Should resolve if no connection exists", () => {});
	});
	describe("getEmails", () => {
		it("Should call fetchEmails", () => {});
		it("Should call parseEmails", () => {});
		it("Should resolve to an array", () => {});
		it("Should reject on error", () => {});
	});
	describe("readEmail", () => {
		it("Should join data chunks", () => {});
		it("Should resolve on stream end", () => {});
		it("Should reject on stream error", () => {});
	});
	describe("parseEmail", () => {
		it("Should resolve on empty input", () => {});
		it("Should resolve to array", () => {});
		it("Should call mailParser.simpleParser", () => {});
		it("Should reject on parse error", () => {});
	});
});
