// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { DEFAULT_REACTIONS, ReactionsPopover } from "../reactions-popover";

afterEach(cleanup);

vi.mock("emoji-picker-react", () => ({
  default: ({
    onEmojiClick,
  }: {
    onEmojiClick: (data: { emoji: string }) => void;
  }) => (
    <button onClick={() => onEmojiClick({ emoji: "🎊" })}>pick emoji</button>
  ),
  Theme: { AUTO: "auto" },
}));

const setup = (onReaction?: (emoji: string) => void) => {
  const user = userEvent.setup();
  render(
    <ReactionsPopover onReaction={onReaction}>
      <button>open reactions</button>
    </ReactionsPopover>,
  );
  return { user };
};

describe("ReactionsPopover", () => {
  describe("rendering", () => {
    it("renders children as the trigger", () => {
      setup();
      expect(
        screen.getByRole("button", { name: "open reactions" }),
      ).toBeInTheDocument();
    });

    it("does not show reactions before the trigger is clicked", () => {
      setup();
      expect(screen.queryByText("👍")).not.toBeInTheDocument();
    });
  });

  describe("default reactions", () => {
    it("shows all default reactions when the popover opens", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "open reactions" }));
      for (const emoji of DEFAULT_REACTIONS) {
        expect(screen.getByText(emoji)).toBeInTheDocument();
      }
    });

    it("calls onReaction with the clicked emoji", async () => {
      const onReaction = vi.fn();
      const { user } = setup(onReaction);
      await user.click(screen.getByRole("button", { name: "open reactions" }));
      await user.click(screen.getByText("👍"));
      expect(onReaction).toHaveBeenCalledWith("👍");
    });

    it("closes the popover after a default reaction is clicked", async () => {
      const { user } = setup(vi.fn());
      await user.click(screen.getByRole("button", { name: "open reactions" }));
      await user.click(screen.getByText("👍"));
      expect(screen.queryByText("👍")).not.toBeInTheDocument();
    });
  });

  describe("more reactions button", () => {
    it("has an accessible label", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "open reactions" }));
      expect(
        screen.getByRole("button", { name: "More emoji reactions" }),
      ).toBeInTheDocument();
    });

    it("opens the full emoji picker when clicked", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "open reactions" }));
      await user.click(
        screen.getByRole("button", { name: "More emoji reactions" }),
      );
      expect(
        screen.getByRole("button", { name: "pick emoji" }),
      ).toBeInTheDocument();
    });
  });

  describe("full emoji picker", () => {
    const openPicker = async (user: UserEvent) => {
      await user.click(screen.getByRole("button", { name: "open reactions" }));
      await user.click(
        screen.getByRole("button", { name: "More emoji reactions" }),
      );
    };

    it("calls onReaction with the selected emoji", async () => {
      const onReaction = vi.fn();
      const { user } = setup(onReaction);
      await openPicker(user);
      await user.click(screen.getByRole("button", { name: "pick emoji" }));
      expect(onReaction).toHaveBeenCalledWith("🎊");
    });

    it("closes the outer popover after an emoji is selected", async () => {
      const { user } = setup(vi.fn());
      await openPicker(user);
      await user.click(screen.getByRole("button", { name: "pick emoji" }));
      expect(screen.queryByText("👍")).not.toBeInTheDocument();
    });

    it("closes the full picker after an emoji is selected", async () => {
      const { user } = setup(vi.fn());
      await openPicker(user);
      await user.click(screen.getByRole("button", { name: "pick emoji" }));
      expect(
        screen.queryByRole("button", { name: "pick emoji" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("close behavior", () => {
    it("collapses the full picker when the outer popover is closed", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "open reactions" }));
      await user.click(
        screen.getByRole("button", { name: "More emoji reactions" }),
      );
      await user.keyboard("{Escape}");
      expect(
        screen.queryByRole("button", { name: "pick emoji" }),
      ).not.toBeInTheDocument();
    });
  });
});
