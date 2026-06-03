// @vitest-environment jsdom
import { ComponentProps } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteDialog } from "../delete-dialog";
import { Event } from "@/data/messages";

// RTL auto-cleanup requires globals:true in vitest config; call it explicitly instead
afterEach(cleanup);

const message: Event = {
  id: 1,
  status: "sent",
  sender: {
    id: "user-1",
    name: "Ann Smith",
    avatarUrl: "",
    username: "@annsmith",
  },
  timestamp: 0,
  content: { type: "message", text: "Hello world" },
};

const setup = (props: Partial<ComponentProps<typeof DeleteDialog>> = {}) => {
  const onOpenChange = vi.fn();
  const onConfirm = vi.fn();
  const user = userEvent.setup();

  render(
    <DeleteDialog
      open={true}
      onOpenChange={onOpenChange}
      message={message}
      onConfirm={onConfirm}
      {...props}
    />,
  );

  return { user, onOpenChange, onConfirm };
};

describe("DeleteDialog", () => {
  describe("visibility", () => {
    it("shows the dialog when open and message are provided", () => {
      setup();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("does not show the dialog when open is false", () => {
      setup({ open: false });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not show the dialog when message is null", () => {
      setup({ message: null });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("content", () => {
    it("renders the title and confirmation description", () => {
      setup();
      expect(screen.getByText("Delete message")).toBeInTheDocument();
      expect(
        screen.getByText("Are you sure you want to delete this message?"),
      ).toBeInTheDocument();
    });

    it("renders the sender name from MessagePreview", () => {
      setup();
      expect(screen.getByText("Ann Smith")).toBeInTheDocument();
    });

    it("renders the message text from MessagePreview", () => {
      setup();
      expect(screen.getByText("Hello world")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onConfirm when the Delete button is clicked", async () => {
      const { user, onConfirm } = setup();
      await user.click(screen.getByRole("button", { name: /delete/i }));
      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it("does not call onOpenChange when the Delete button is clicked", async () => {
      const { user, onOpenChange } = setup();
      await user.click(screen.getByRole("button", { name: /delete/i }));
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("calls onOpenChange(false) when the Cancel button is clicked", async () => {
      const { user, onOpenChange } = setup();
      await user.click(screen.getByRole("button", { name: /cancel/i }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
