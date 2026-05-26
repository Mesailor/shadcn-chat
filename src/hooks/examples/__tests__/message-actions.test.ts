// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useState } from "react";
import { useMessageActions } from "../message-actions";
import { Event } from "@/data/messages";

const makeEvent = (id: number, text = "Hello"): Event => ({
  id,
  status: "sent",
  sender: { id: "user-1", name: "User", avatarUrl: "", username: "@user" },
  timestamp: 0,
  content: { type: "message", text },
});

const setup = (initialMessages: Event[] = []) => {
  const onDelete = vi.fn();
  const onUpdate = vi.fn();

  const { result } = renderHook(() => {
    const [messages, setMessages] = useState(initialMessages);
    const actions = useMessageActions({ setMessages, onDelete, onUpdate });
    return { messages, ...actions };
  });

  return { result, onDelete, onUpdate };
};

describe("useMessageActions", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("delete flow", () => {
    describe("handleOpenDeleteDialog", () => {
      it("sets messageToDelete and opens the dialog", () => {
        const { result } = setup();
        const event = makeEvent(1);

        act(() => {
          result.current.handleOpenDeleteDialog(event);
        });

        expect(result.current.messageToDelete).toEqual(event);
        expect(result.current.openDeleteDialog).toBe(true);
      });
    });

    describe("handleDelete", () => {
      it("does nothing when messageToDelete is null", async () => {
        const { result, onDelete } = setup([makeEvent(1)]);

        await act(async () => {
          await result.current.handleDelete();
        });

        expect(onDelete).not.toHaveBeenCalled();
        expect(result.current.messages).toHaveLength(1);
      });

      it("removes the deleted message and clears state on success", async () => {
        const message = makeEvent(1);
        const { result, onDelete } = setup([message, makeEvent(2)]);
        onDelete.mockResolvedValue(1);

        act(() => {
          result.current.handleOpenDeleteDialog(message);
        });
        await act(async () => {
          await result.current.handleDelete();
        });

        expect(onDelete).toHaveBeenCalledWith(message.id);
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].id).toBe(2);
        expect(result.current.messageToDelete).toBeNull();
        expect(result.current.openDeleteDialog).toBe(false);
      });

      it("does not mutate messages when onDelete rejects", async () => {
        const message = makeEvent(1);
        const { result, onDelete } = setup([message]);
        onDelete.mockRejectedValue(new Error("Network error"));

        act(() => {
          result.current.handleOpenDeleteDialog(message);
        });
        await act(async () => {
          await result.current.handleDelete();
        });

        expect(result.current.messages).toHaveLength(1);
      });
    });
  });

  describe("edit flow", () => {
    describe("handleStartEdit", () => {
      it("sets messageToEdit", () => {
        const { result } = setup();
        const event = makeEvent(1);

        act(() => {
          result.current.handleStartEdit(event);
        });

        expect(result.current.messageToEdit).toEqual(event);
      });
    });

    describe("handleCancelEdit", () => {
      it("clears messageToEdit", () => {
        const { result } = setup();
        const event = makeEvent(1);

        act(() => {
          result.current.handleStartEdit(event);
        });
        act(() => {
          result.current.handleCancelEdit();
        });

        expect(result.current.messageToEdit).toBeNull();
      });
    });

    describe("handleSubmitEdit", () => {
      beforeEach(() => {
        vi.spyOn(URL, "createObjectURL").mockImplementation(
          () => "blob:mock-url",
        );
      });

      it("does nothing when messageToEdit is null", async () => {
        const { result, onUpdate } = setup([makeEvent(1)]);

        await act(async () => {
          await result.current.handleSubmitEdit({
            text: "edited",
            uploadFiles: [],
            editedFiles: [],
          });
        });

        expect(onUpdate).not.toHaveBeenCalled();
        expect(result.current.messages).toHaveLength(1);
      });

      it("applies optimistic update before onUpdate resolves", async () => {
        const message = makeEvent(1, "original");
        const { result, onUpdate } = setup([message]);

        let resolveUpdate: (event: Event) => void;
        onUpdate.mockReturnValue(
          new Promise<Event>((resolve) => {
            resolveUpdate = resolve;
          }),
        );

        act(() => {
          result.current.handleStartEdit(message);
        });

        // Do not await — optimistic setMessages runs synchronously before the first await in handleSubmitEdit
        act(() => {
          void result.current.handleSubmitEdit({
            text: "edited",
            uploadFiles: [],
            editedFiles: [],
          });
        });

        expect(result.current.messages[0].content.text).toBe("edited");
        expect(result.current.messages[0].isEdited).toBe(true);

        await act(async () => {
          resolveUpdate(makeEvent(1, "from server"));
        });
      });

      it("replaces optimistic update with server response on success", async () => {
        const message = makeEvent(1, "original");
        const serverResponse = makeEvent(1, "from server");
        const { result, onUpdate } = setup([message]);
        onUpdate.mockResolvedValue(serverResponse);

        act(() => {
          result.current.handleStartEdit(message);
        });
        await act(async () => {
          await result.current.handleSubmitEdit({
            text: "edited",
            uploadFiles: [],
            editedFiles: [],
          });
        });

        expect(result.current.messages[0]).toEqual(serverResponse);
      });

      it("rolls back to the original message when onUpdate rejects", async () => {
        const message = makeEvent(1, "original");
        const { result, onUpdate } = setup([message]);
        onUpdate.mockRejectedValue(new Error("Network error"));

        act(() => {
          result.current.handleStartEdit(message);
        });
        await act(async () => {
          await result.current.handleSubmitEdit({
            text: "edited",
            uploadFiles: [],
            editedFiles: [],
          });
        });

        expect(result.current.messages[0].content.text).toBe("original");
        expect(result.current.messages[0].isEdited).toBeUndefined();
      });

      it("omits text and files from optimistic content when both are empty", async () => {
        const message = makeEvent(1, "original");
        const { result, onUpdate } = setup([message]);

        let resolveUpdate: (event: Event) => void;
        onUpdate.mockReturnValue(
          new Promise<Event>((resolve) => {
            resolveUpdate = resolve;
          }),
        );

        act(() => {
          result.current.handleStartEdit(message);
        });
        act(() => {
          void result.current.handleSubmitEdit({
            text: "",
            uploadFiles: [],
            editedFiles: [],
          });
        });

        expect(result.current.messages[0].content).toEqual({ type: "message" });

        await act(async () => {
          resolveUpdate(makeEvent(1));
        });
      });
    });
  });
});
