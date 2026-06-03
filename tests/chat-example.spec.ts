import { ChatPage, expect, test } from "./chat-fixtures";

test.describe.configure({ mode: "serial" });

// ─── Loading state ────────────────────────────────────────────────────────────

test.describe("Loading state", () => {
  test.beforeEach(async ({ chatPage }) => {
    // Navigate but do NOT wait for messages so we can observe loading state
    await chatPage.goto();
  });

  test("shows aria-busy=true on the message log before messages are fetched", async ({
    chatPage,
  }) => {
    await expect(chatPage.messageLog).toHaveAttribute("aria-busy", "true");
  });

  test("shows skeleton placeholders during loading", async ({ chatPage }) => {
    // Skeletons render as articles; real messages are absent (no id^="message-")
    await expect(chatPage.messageLog.getByRole("article").first()).toBeVisible({
      timeout: 2000,
    });
    await expect(
      chatPage.messageLog.locator('[id^="message-"]').first(),
    ).not.toBeAttached();
  });
});

// ─── Messages loaded ──────────────────────────────────────────────────────────

test.describe("Messages loaded", () => {
  test.beforeEach(async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.waitForMessages();
  });

  test("clears aria-busy after messages are fetched", async ({ chatPage }) => {
    await expect(chatPage.messageLog).not.toHaveAttribute("aria-busy", "true");
  });

  test("renders Ann Smith message #17 with correct text", async ({
    chatPage,
  }) => {
    const msg = chatPage.getMessageById(17);
    await expect(msg).toBeAttached();
    await expect(
      msg.locator('[data-slot="chat-event-content"]'),
    ).toContainText("dashboard design looks fantastic");
  });

  test("renders John Doe messages in the list", async ({ chatPage }) => {
    await expect(
      chatPage.messageLog.locator('[data-slot="chat-event-content"]', {
        hasText: "tested the new checkout flow",
      }),
    ).toBeVisible();
  });
});

// ─── Send message ─────────────────────────────────────────────────────────────

test.describe("Send message", () => {
  test.beforeEach(async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.waitForMessages();
  });

  test("Send button is disabled when input is empty", async ({ chatPage }) => {
    await expect(
      chatPage.demo.getByRole("button", { name: "Send message" }),
    ).toBeDisabled();
  });

  test("sends a message via button click and shows it in the chat", async ({
    chatPage,
  }) => {
    const text = `btn-send-${Date.now()}`;
    await chatPage.typeMessage(text);
    await chatPage.sendByButton();
    await chatPage.waitForMessageVisible(text);

    const msgContent = chatPage.messageLog
      .locator('[data-slot="chat-event-content"]', { hasText: text })
      .first();
    await expect(msgContent).toBeVisible();
  });

  test("sends a message via Enter key and shows it in the chat", async ({
    chatPage,
  }) => {
    const text = `enter-send-${Date.now()}`;
    await chatPage.typeMessage(text);
    await chatPage.sendByEnter();
    await chatPage.waitForMessageVisible(text);

    const msgContent = chatPage.messageLog
      .locator('[data-slot="chat-event-content"]', { hasText: text })
      .first();
    await expect(msgContent).toBeVisible();
    await expect(chatPage.input).toHaveValue("");
  });
});

// ─── Edit own message ─────────────────────────────────────────────────────────

test.describe("Edit own message", () => {
  let originalText: string;
  let msgLocator: ReturnType<ChatPage["getMessageByText"]>;

  test.beforeEach(async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.waitForMessages();
    originalText = `edit-base-${Date.now()}`;
    await chatPage.typeMessage(originalText);
    await chatPage.sendByButton();
    await chatPage.waitForMessageVisible(originalText);
    msgLocator = chatPage.getMessageByText(originalText);
  });

  test("entering edit mode populates the toolbar with the message text", async ({
    chatPage,
  }) => {
    await chatPage.startEdit(msgLocator);
    await expect(chatPage.input).toHaveValue(originalText);
    await expect(
      chatPage.demo.getByRole("button", { name: "Save edit" }),
    ).toBeVisible();
    await expect(
      chatPage.demo.getByRole("button", { name: "Cancel edit" }),
    ).toBeVisible();
  });

  test("saving an edit updates content and shows (edited) label", async ({
    chatPage,
  }) => {
    const editedText = `edited-${Date.now()}`;
    await chatPage.startEdit(msgLocator);
    await chatPage.input.fill(editedText);
    await chatPage.saveEdit();

    await expect(
      chatPage.messageLog
        .locator('[data-slot="chat-event-content"]', { hasText: editedText })
        .first(),
    ).toBeVisible({ timeout: 2000 });

    const updatedMsg = chatPage.getMessageByText(editedText);
    await expect(updatedMsg.getByText("(edited)")).toBeVisible({
      timeout: 2000,
    });
  });

  test("cancelling an edit preserves original text and hides (edited)", async ({
    chatPage,
  }) => {
    await chatPage.startEdit(msgLocator);
    await chatPage.input.fill("garbage text that should not be saved");
    await chatPage.cancelEdit();

    await expect(
      chatPage.messageLog
        .locator('[data-slot="chat-event-content"]', { hasText: originalText })
        .first(),
    ).toBeVisible();
    await expect(msgLocator.getByText("(edited)")).not.toBeVisible();
  });
});

// ─── Delete own message ───────────────────────────────────────────────────────

test.describe("Delete own message", () => {
  let msgText: string;
  let msgLocator: ReturnType<ChatPage["getMessageByText"]>;

  test.beforeEach(async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.waitForMessages();
    msgText = `delete-base-${Date.now()}`;
    await chatPage.typeMessage(msgText);
    await chatPage.sendByButton();
    await chatPage.waitForMessageVisible(msgText);
    msgLocator = chatPage.getMessageByText(msgText);
  });

  test("opening delete shows DeleteDialog with 'Delete message' title", async ({
    chatPage,
  }) => {
    await chatPage.startDelete(msgLocator);
    const dialog = chatPage.page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "Delete message" }),
    ).toBeVisible();
    await expect(dialog.getByText(msgText)).toBeVisible();
  });

  test("confirming deletion removes the message from the chat", async ({
    chatPage,
  }) => {
    await chatPage.startDelete(msgLocator);
    await chatPage.confirmDeleteDialog();
    await expect(msgLocator).not.toBeVisible({ timeout: 2000 });
  });

  test("cancelling deletion keeps the message in the chat", async ({
    chatPage,
  }) => {
    await chatPage.startDelete(msgLocator);
    await chatPage.cancelDeleteDialog();
    await expect(chatPage.page.getByRole("dialog")).not.toBeVisible();
    await expect(msgLocator).toBeVisible();
  });
});

// ─── Reactions ────────────────────────────────────────────────────────────────

test.describe("Reactions", () => {
  test.beforeEach(async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.waitForMessages();
  });

  test("hovering a message reveals the Add reaction button", async ({
    chatPage,
  }) => {
    const msg = chatPage.getMessageById(17);
    await chatPage.hoverMessage(msg);
    await expect(
      msg.locator('[data-slot="chat-event-hover-actions"]').getByRole("button", {
        name: "Add reaction",
      }),
    ).toBeVisible();
  });

  test("clicking Add reaction opens the reactions popover with default emojis", async ({
    chatPage,
  }) => {
    const msg = chatPage.getMessageById(17);
    await chatPage.clickAddReaction(msg);
    for (const emoji of ["👍", "❤️", "😂", "😮", "😢", "🙏", "🎉"]) {
      await expect(
        chatPage.page.getByRole("button", { name: emoji, exact: true }).first(),
      ).toBeVisible({ timeout: 1500 });
    }
  });

  test("clicking 👍 shows a reaction badge on the message", async ({
    chatPage,
  }) => {
    const msg = chatPage.getMessageById(17);
    await chatPage.addReaction(msg, "👍");
    await expect(chatPage.getReactionButton(msg, "👍")).toBeVisible({
      timeout: 1500,
    });
  });

  test("clicking the 👍 reaction badge again removes it", async ({
    chatPage,
  }) => {
    const msg = chatPage.getMessageById(17);
    // Add the reaction first so this test is fully self-contained
    await chatPage.addReaction(msg, "👍");
    const reactionBtn = chatPage.getReactionButton(msg, "👍");
    await expect(reactionBtn).toBeVisible({ timeout: 1500 });
    await reactionBtn.click();
    await expect(reactionBtn).not.toBeVisible({ timeout: 1500 });
  });
});

// ─── Search ───────────────────────────────────────────────────────────────────

test.describe("Search", () => {
  test.beforeEach(async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.waitForMessages();
  });

  test("typing 'dashboard' and pressing Enter opens the search sidebar", async ({
    chatPage,
  }) => {
    await chatPage.searchMessages("dashboard");
    await chatPage.waitForSearchSidebar();
    await expect(
      chatPage.page.locator('[data-slot="sidebar"]').getByText("Search"),
    ).toBeVisible();
  });

  test("search results include the Ann Smith message with 'dashboard'", async ({
    chatPage,
  }) => {
    await chatPage.searchMessages("dashboard");
    await chatPage.waitForSearchSidebar();
    await expect(
      chatPage.getSearchResults().first(),
    ).toContainText("dashboard", { timeout: 2000 });
  });

  test("clicking a search result applies the highlight animation to the message", async ({
    chatPage,
  }) => {
    await chatPage.searchMessages("dashboard");
    await chatPage.waitForSearchSidebar();

    await chatPage.clickSearchResult(0);

    await expect(chatPage.getMessageById(17)).toHaveClass(
      /animate-message-highlight/,
      { timeout: 3000 },
    );
  });

  test("highlight class is removed after 3 seconds", async ({ chatPage }) => {
    await chatPage.searchMessages("dashboard");
    await chatPage.waitForSearchSidebar();
    await chatPage.clickSearchResult(0);
    // Wait past the 3s auto-clear
    await chatPage.page.waitForTimeout(3500);
    await expect(chatPage.getMessageById(17)).not.toHaveClass(
      /animate-message-highlight/,
    );
  });
});

// ─── Profile sidebar ──────────────────────────────────────────────────────────

test.describe("Profile sidebar", () => {
  test.beforeEach(async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.waitForMessages();
  });

  test("More options > Show profile opens the sidebar with Profile title", async ({
    chatPage,
  }) => {
    await chatPage.openHeaderMenu();
    await chatPage.clickHeaderMenuItem("Show profile");
    await expect(
      chatPage.page.locator('[data-slot="sidebar"]').getByText("Profile"),
    ).toBeVisible({ timeout: 2000 });
  });

  test("Close button dismisses the profile sidebar", async ({ chatPage }) => {
    await chatPage.openHeaderMenu();
    await chatPage.clickHeaderMenuItem("Show profile");
    await expect(
      chatPage.page.locator('[data-slot="sidebar"]').getByText("Profile"),
    ).toBeVisible({ timeout: 2000 });

    await chatPage.page
      .locator('[data-slot="sidebar"]')
      .getByRole("button", { name: "Close" })
      .click();

    await expect(
      chatPage.page.locator('[data-slot="sidebar"]').getByText("Profile"),
    ).not.toBeVisible({ timeout: 1500 });
  });
});

// ─── Block / Unblock ──────────────────────────────────────────────────────────

test.describe("Block / Unblock", () => {
  test.beforeEach(async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.waitForMessages();
  });

  test("More options > Block opens BlockDialog with 'Block user' title", async ({
    chatPage,
  }) => {
    await chatPage.openHeaderMenu();
    await chatPage.clickHeaderMenuItem("Block");
    const dialog = chatPage.page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "Block user" }),
    ).toBeVisible();
  });

  test("confirming block shows 'Blocked' badge in the header", async ({
    chatPage,
  }) => {
    await chatPage.openHeaderMenu();
    await chatPage.clickHeaderMenuItem("Block");
    await chatPage.confirmBlockDialog();
    await expect(chatPage.page.getByRole("dialog")).not.toBeVisible({
      timeout: 1000,
    });
    expect(await chatPage.isBlockedBadgeVisible()).toBe(true);
  });

  test("header More options shows Unblock after user is blocked", async ({
    chatPage,
  }) => {
    await chatPage.openHeaderMenu();
    await chatPage.clickHeaderMenuItem("Block");
    await chatPage.confirmBlockDialog();
    // Wait for the Blocked badge — this confirms isBlocked=true is in the React tree
    await expect(
      chatPage.demo.locator('[data-slot="chat-header-main"]').getByText("Blocked"),
    ).toBeVisible({ timeout: 1500 });

    await chatPage.openHeaderMenu();
    await expect(
      chatPage.page.getByRole("menuitem", { name: "Unblock" }),
    ).toBeVisible({ timeout: 2000 });
    // Use not.toBeAttached to avoid matching the Radix exit-animation copy of the old dropdown
    await expect(
      chatPage.demo.getByRole("menuitem", { name: "Block" }),
    ).not.toBeAttached({ timeout: 500 });
    await chatPage.page.keyboard.press("Escape");
  });

  test("clicking Unblock removes the Blocked badge from the header", async ({
    chatPage,
  }) => {
    await chatPage.openHeaderMenu();
    await chatPage.clickHeaderMenuItem("Block");
    await chatPage.confirmBlockDialog();
    await chatPage.page.getByRole("dialog").waitFor({ state: "hidden" });

    await chatPage.openHeaderMenu();
    await chatPage.clickHeaderMenuItem("Unblock");
    await expect(
      chatPage.page.locator('[data-slot="chat-header-main"]').getByText("Blocked"),
    ).not.toBeVisible({ timeout: 1500 });
  });
});
