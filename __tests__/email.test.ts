import { Email } from "../src/email";
import Events from "events";
import { PassThrough } from "stream";

const email = new Email({
	host: "host",
	port: 55,
	user: "user",
	password: "pass",
});

const emailClass = email as any;

describe("The Email Class", () => {
	describe("When Connecting", () => {
		afterAll(() => {
			jest.restoreAllMocks();
		});
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
		afterAll(() => {
			jest.restoreAllMocks();
		});
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
		afterAll(() => {
			jest.restoreAllMocks();
		});
		it("Should use inbox if none is specified", async () => {
			jest
				.spyOn(emailClass._imap, "openBox")
				.mockImplementation((box, _readonly, cb: any) => {
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
				.mockImplementation((_box, _readonly, cb: any) => {
					cb(new Error("Openbox Error"));
				});
			await expect(email.getEmails()).rejects.toThrow("Openbox Error");
		});
		it("Should call fetchEmails", async () => {
			jest
				.spyOn(emailClass._imap, "openBox")
				.mockImplementation((_box, _readonly, cb: any) => {
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
				.mockImplementation((_box, _readonly, cb: any) => {
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
				.mockImplementation((_box, _readonly, cb: any) => {
					cb();
				});

			jest.spyOn(emailClass, "_fetchEmails").mockImplementation(() => {
				return Promise.reject(new Error("Fetch Error"));
			});

			await expect(email.getEmails()).rejects.toThrow("Fetch Error");
		});
	});
	describe("fetchEmails", () => {
		afterAll(() => {
			jest.restoreAllMocks();
		});
		it("should reject on error", async () => {
			jest.spyOn(emailClass._imap, "fetch").mockImplementation(() => {
				const fetchEvent = new Events.EventEmitter();
				setTimeout(() => {
					fetchEvent.emit("error", new Error("Fetch Error"));
				}, 100);
				return fetchEvent;
			});
			await expect(emailClass._fetchEmails()).rejects.toThrow("Fetch Error");
		});
		it("should resolve on end", async () => {
			jest.spyOn(emailClass._imap, "fetch").mockImplementation(() => {
				const fetchEvent = new Events.EventEmitter();
				setTimeout(() => {
					fetchEvent.emit("end");
				}, 100);
				return fetchEvent;
			});
			await expect(emailClass._fetchEmails()).resolves.toBeDefined();
		});
		it("Should resolve to array", async () => {
			jest.spyOn(emailClass._imap, "fetch").mockImplementation(() => {
				const fetchEvent = new Events.EventEmitter();
				setTimeout(() => {
					fetchEvent.emit("end");
				}, 100);
				return fetchEvent;
			});
			const results = await emailClass._fetchEmails();
			expect(results).toBeInstanceOf(Array);
		});
		it("Should join data chunks", async () => {
			jest.spyOn(emailClass._imap, "fetch").mockImplementation(() => {
				const fetchEvent = new Events.EventEmitter();
				const messageEvent = new Events.EventEmitter();
				const stream = new PassThrough();
				const data = ["First Half ", "Second Half"];
				setTimeout(() => {
					fetchEvent.emit("message", messageEvent);
					messageEvent.emit("body", stream);
					stream.emit("data", data[0]);
					stream.emit("data", data[1]);
					stream.end();
					stream.destroy();
					fetchEvent.emit("end");
				}, 100);
				return fetchEvent;
			});
			const results = await emailClass._fetchEmails();
			expect(results[0]).toEqual("First Half Second Half");
		});
		it("Should reject on stream error", async () => {
			jest.spyOn(emailClass._imap, "fetch").mockImplementation(() => {
				const fetchEvent = new Events.EventEmitter();
				const messageEvent = new Events.EventEmitter();
				const stream = new PassThrough();
				setTimeout(() => {
					fetchEvent.emit("message", messageEvent);
					messageEvent.emit("body", stream);
					stream.emit("error", new Error("Stream Error"));
					stream.destroy();
				}, 100);
				return fetchEvent;
			});
			await expect(emailClass._fetchEmails()).rejects.toThrow("Stream Error");
		});
	});
});
