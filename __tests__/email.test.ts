import Imap from "imap";
import mailParser from "mailparser";

describe("The Email Class", () => {
	describe("When Connecting", () => {
		it("Should call imap.connect");
		it("Errors Should call reject Promise");
		it("SNI should be sent");
		it("Connection options should be properly set");
		it("Should reject if connection is already active");
	});
	describe("When Disconnecting", () => {
		it("Should call imap.end");
		it("Should resolve if no connection exists");
	});
	describe("getEmails", () => {
		it("should call fetchEmails");
		it("should call parseEmails");
		it("should resolve to an array");
		it("should reject on error");
	});
	describe("readEmail", () => {
		it("should join data chunks");
		it("should resolve on stream end");
		it("should reject on stream error");
	});
	describe("parseEmail", () => {
		it("should resolve on empty input");
		it("should resolve to array");
		it("should call mailParser.simpleParser");
		it("should reject on parse error");
	});
});
