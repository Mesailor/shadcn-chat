import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { deleteEvent, getEvents, postEvent, searchEvents } from "./mock-api";
import { EVENTS } from "../messages";
import { CURRENT_USER } from "../users";

const INITIAL_EVENTS = structuredClone(EVENTS);

describe("searchEvents", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset the EVENTS
    EVENTS.length = 0;
    EVENTS.push(...structuredClone(INITIAL_EVENTS));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves with empty array if empty query passed", async () => {
    const result = await searchEvents("");
    expect(result).toEqual([]);
  });

  it("resolves with events that contain passed query in event.content.text", async () => {
    const query = "Hey";

    const promise = searchEvents(query);
    vi.runAllTimers();
    const result = await promise;

    expect(result).not.toHaveLength(0);
    result.forEach((event) => {
      expect(event.content.text?.toLowerCase()).toContain(query.toLowerCase());
    });
  });

  it("resolves with an empty array if nothing found with this query", async () => {
    const query = "nothing-exist-with-this-query";

    const promise = searchEvents(query);
    vi.runAllTimers();
    const result = await promise;

    expect(result).toHaveLength(0);
  });

  it("is case insensitive", async () => {
    EVENTS.length = 0;
    EVENTS.push({
      id: 17,
      status: "sent",
      sender: {
        id: "annsmith-user-id",
        name: "Ann Smith",
        avatarUrl:
          "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
        username: "@annsmith",
      },
      timestamp: 1234979120123,
      content: {
        type: "message",
        text: "Hello",
      },
    });

    const promise = searchEvents("hello"); // lowercase
    vi.runAllTimers();
    const result = await promise;

    expect(result).not.toHaveLength(0);
  });
});

describe("getEvents", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset the EVENTS
    EVENTS.length = 0;
    EVENTS.push(...structuredClone(INITIAL_EVENTS));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves with all events", async () => {
    const promise = getEvents();
    vi.runAllTimers();
    const result = await promise;

    expect(result).toEqual(EVENTS);
  });
});

describe("postEvent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    URL.createObjectURL = vi.fn(() => "blob:mock-url");
    // Reset the EVENTS
    EVENTS.length = 0;
    EVENTS.push(...structuredClone(INITIAL_EVENTS));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("rejects with error if no valid text or files were passed", async () => {
    await expect(postEvent({})).rejects.toThrow(
      "Either text or files must be provided",
    );
    await expect(postEvent({ files: [] })).rejects.toThrow(
      "Either text or files must be provided",
    );
  });

  it("resolves with event that has passed text and files", async () => {
    const text = "Hello World!";
    const files = [new File(["content"], "photo.png", { type: "image/png" })];

    const promise = postEvent({ text, files });
    vi.runAllTimers();
    const result = await promise;

    expect(result).toMatchObject({
      status: "sent",
      sender: CURRENT_USER,
      content: {
        text,
        files: [
          {
            url: "blob:mock-url",
            fileName: "photo.png",
            mimeType: "image/png",
          },
        ],
      },
    });
  });

  it("adds newly created event to the beginning of EVENTS", async () => {
    const text = "Hello World!";

    const promise = postEvent({ text });
    vi.runAllTimers();
    const result = await promise;

    expect(result).toEqual(EVENTS[0]);
  });
});

describe("deleteEvent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset the EVENTS
    EVENTS.length = 0;
    EVENTS.push(...structuredClone(INITIAL_EVENTS));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("rejects if no event with passed ID found", async () => {
    const promise = deleteEvent(999);
    vi.runAllTimers();

    await expect(promise).rejects.toThrow("Event not found");
  });

  it("removes event with passed ID from EVENTS and resolves with ID", async () => {
    const idToDelete = 1;
    EVENTS.length = 0;
    EVENTS.push(
      {
        id: 1,
        status: "sent",
        sender: {
          id: "annsmith-user-id",
          name: "Ann Smith",
          avatarUrl:
            "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
          username: "@annsmith",
        },
        timestamp: 1234979120123,
        content: {
          type: "message",
          text: "Hello",
        },
      },
      {
        id: 2,
        status: "sent",
        sender: {
          id: "annsmith-user-id",
          name: "Ann Smith",
          avatarUrl:
            "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
          username: "@annsmith",
        },
        timestamp: 1234979120123,
        content: {
          type: "message",
          text: "Hello",
        },
      },
    );

    const promise = deleteEvent(idToDelete);
    vi.runAllTimers();
    const result = await promise;

    expect(result).toBe(idToDelete);
    expect(EVENTS).toHaveLength(1);
    expect(EVENTS).not.toContainEqual(
      expect.objectContaining({ id: idToDelete }),
    );
  });
});
