import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getEvents, searchEvents } from "./mock-api";
import { EVENTS } from "../messages";

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
