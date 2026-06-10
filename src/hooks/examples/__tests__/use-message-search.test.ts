// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMessageSearch } from "../use-message-search";
import { Event } from "@/data/messages";

const makeEvent = (id: number): Event => ({
  id,
  status: "sent",
  sender: { id: "user-1", name: "User", avatarUrl: "", username: "@user" },
  timestamp: 0,
  content: { type: "message", text: "Hello" },
});

const setup = () => {
  const setSidebarOpen = vi.fn();
  const setSidebarView = vi.fn();
  const onSearch = vi.fn();

  const { result } = renderHook(() =>
    useMessageSearch({ setSidebarOpen, setSidebarView, onSearch }),
  );

  return { result, setSidebarOpen, setSidebarView, onSearch };
};

describe("useMessageSearch", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("handleSearch", () => {
    it("does nothing when query is empty string", async () => {
      const { result, onSearch, setSidebarOpen, setSidebarView } = setup();

      await act(async () => {
        await result.current.handleSearch("");
      });

      expect(onSearch).not.toHaveBeenCalled();
      expect(setSidebarOpen).not.toHaveBeenCalled();
      expect(setSidebarView).not.toHaveBeenCalled();
    });

    it("does nothing when query is whitespace only", async () => {
      const { result, onSearch, setSidebarOpen, setSidebarView } = setup();

      await act(async () => {
        await result.current.handleSearch("   ");
      });

      expect(onSearch).not.toHaveBeenCalled();
      expect(setSidebarOpen).not.toHaveBeenCalled();
      expect(setSidebarView).not.toHaveBeenCalled();
    });

    it("calls onSearch with the trimmed query", async () => {
      const { result, onSearch } = setup();
      onSearch.mockResolvedValue([]);

      await act(async () => {
        await result.current.handleSearch("  hello  ");
      });

      expect(onSearch).toHaveBeenCalledWith("hello");
    });

    it("sets activeSearchQuery to the trimmed query", async () => {
      const { result, onSearch } = setup();
      onSearch.mockResolvedValue([]);

      await act(async () => {
        await result.current.handleSearch("  hello  ");
      });

      expect(result.current.activeSearchQuery).toBe("hello");
    });

    it("calls setSidebarView('search') and setSidebarOpen(true)", async () => {
      const { result, onSearch, setSidebarOpen, setSidebarView } = setup();
      onSearch.mockResolvedValue([]);

      await act(async () => {
        await result.current.handleSearch("hello");
      });

      expect(setSidebarView).toHaveBeenCalledWith("search");
      expect(setSidebarOpen).toHaveBeenCalledWith(true);
    });

    it("updates searchResults with the resolved value on success", async () => {
      const { result, onSearch } = setup();
      const events = [makeEvent(1), makeEvent(2)];
      onSearch.mockResolvedValue(events);

      await act(async () => {
        await result.current.handleSearch("hello");
      });

      expect(result.current.searchResults).toEqual(events);
    });

    it("clears searchResults and logs error when onSearch rejects", async () => {
      const { result, onSearch } = setup();
      onSearch.mockRejectedValue(new Error("Network error"));

      await act(async () => {
        await result.current.handleSearch("hello");
      });

      expect(result.current.searchResults).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        "Search failed:",
        expect.any(Error),
      );
    });

    it("drops stale result when a newer search resolves first (success path)", async () => {
      const { result, onSearch } = setup();

      const events1 = [makeEvent(1)];
      const events2 = [makeEvent(2)];

      let resolveFirst!: (v: Event[]) => void;
      let resolveSecond!: (v: Event[]) => void;

      onSearch
        .mockReturnValueOnce(
          new Promise<Event[]>((r) => {
            resolveFirst = r;
          }),
        )
        .mockReturnValueOnce(
          new Promise<Event[]>((r) => {
            resolveSecond = r;
          }),
        );

      act(() => {
        void result.current.handleSearch("first");
      });
      act(() => {
        void result.current.handleSearch("second");
      });

      await act(async () => {
        resolveSecond(events2);
      });

      expect(result.current.searchResults).toEqual(events2);

      await act(async () => {
        resolveFirst(events1);
      });

      expect(result.current.searchResults).toEqual(events2);
    });

    it("does not clear results from a newer search when a stale search rejects (error path)", async () => {
      const { result, onSearch } = setup();

      const events2 = [makeEvent(2)];

      let rejectFirst!: (e: Error) => void;
      let resolveSecond!: (v: Event[]) => void;

      onSearch
        .mockReturnValueOnce(
          new Promise<Event[]>((_, r) => {
            rejectFirst = r;
          }),
        )
        .mockReturnValueOnce(
          new Promise<Event[]>((r) => {
            resolveSecond = r;
          }),
        );

      act(() => {
        void result.current.handleSearch("first");
      });
      act(() => {
        void result.current.handleSearch("second");
      });

      await act(async () => {
        resolveSecond(events2);
      });

      expect(result.current.searchResults).toEqual(events2);

      await act(async () => {
        rejectFirst(new Error("stale error"));
      });

      expect(result.current.searchResults).toEqual(events2);
    });
  });

  describe("handleClearSearch", () => {
    it("resets searchQuery, activeSearchQuery, and searchResults to initial values", async () => {
      const { result, onSearch } = setup();
      onSearch.mockResolvedValue([makeEvent(1)]);

      await act(async () => {
        await result.current.handleSearch("hello");
      });
      act(() => {
        result.current.setSearchQuery("hello");
      });
      act(() => {
        result.current.handleClearSearch();
      });

      expect(result.current.searchQuery).toBe("");
      expect(result.current.activeSearchQuery).toBe("");
      expect(result.current.searchResults).toEqual([]);
    });
  });

  describe("openSearch", () => {
    it("calls setSidebarView('search') and setSidebarOpen(true)", () => {
      const { result, setSidebarOpen, setSidebarView } = setup();

      act(() => {
        result.current.openSearch();
      });

      expect(setSidebarView).toHaveBeenCalledWith("search");
      expect(setSidebarOpen).toHaveBeenCalledWith(true);
    });
  });
});
