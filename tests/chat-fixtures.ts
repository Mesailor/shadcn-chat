import { test as base, type Locator, type Page } from "@playwright/test";

export class ChatPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
    await this.demo.scrollIntoViewIfNeeded();
  }

  get demo(): Locator {
    return this.page.locator("#demo");
  }

  get messageLog(): Locator {
    return this.demo.getByRole("log", { name: "Chat messages" });
  }

  async waitForMessages() {
    // Wait for aria-busy to clear AND for at least one message element to be in the DOM
    await this.page.waitForFunction(() => {
      const el = document.querySelector('[data-slot="chat-messages"]');
      return (
        el &&
        el.getAttribute("aria-busy") !== "true" &&
        !!document.querySelector('[id^="message-"]')
      );
    }, undefined, { timeout: 10000 });
  }

  getMessageById(id: number): Locator {
    return this.page.locator(`#message-${id}`);
  }

  getMessageByText(text: string): Locator {
    return this.messageLog
      .locator('[data-slot="chat-event"]')
      .filter({ has: this.page.locator('[data-slot="chat-event-content"]', { hasText: text }) })
      .first();
  }

  // ---- Input / Send ----

  get input(): Locator {
    return this.demo.locator("#toolbar-input");
  }

  async typeMessage(text: string) {
    await this.input.click();
    await this.input.fill(text);
  }

  async sendByButton() {
    await this.demo.getByRole("button", { name: "Send message" }).click();
  }

  async sendByEnter() {
    await this.input.press("Enter");
  }

  async waitForMessageVisible(text: string) {
    await this.messageLog
      .locator('[data-slot="chat-event-content"]', { hasText: text })
      .first()
      .waitFor({ state: "visible", timeout: 4000 });
  }

  // ---- Hover actions ----

  async hoverMessage(messageLocator: Locator) {
    await messageLocator.hover();
  }

  private hoverActions(messageLocator: Locator): Locator {
    return messageLocator.locator('[data-slot="chat-event-hover-actions"]');
  }

  async clickMoreOptions(messageLocator: Locator) {
    await this.hoverMessage(messageLocator);
    await this.hoverActions(messageLocator)
      .getByRole("button", { name: "More options" })
      .click();
  }

  async clickAddReaction(messageLocator: Locator) {
    await this.hoverMessage(messageLocator);
    await this.hoverActions(messageLocator)
      .getByRole("button", { name: "Add reaction" })
      .click();
  }

  // ---- Edit flow ----

  async startEdit(messageLocator: Locator) {
    await this.clickMoreOptions(messageLocator);
    await this.page.getByRole("menuitem", { name: "Edit" }).click();
  }

  async saveEdit() {
    await this.demo.getByRole("button", { name: "Save edit" }).click();
  }

  async cancelEdit() {
    await this.demo.getByRole("button", { name: "Cancel edit" }).click();
  }

  // ---- Delete flow ----

  async startDelete(messageLocator: Locator) {
    await this.clickMoreOptions(messageLocator);
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
  }

  async confirmDeleteDialog() {
    const dialog = this.page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Delete" }).click();
  }

  async cancelDeleteDialog() {
    const dialog = this.page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Cancel" }).click();
  }

  // ---- Reactions ----

  async addReaction(messageLocator: Locator, emoji: string) {
    await this.clickAddReaction(messageLocator);
    await this.page.getByRole("button", { name: emoji, exact: true }).first().click();
  }

  getReactionButton(messageLocator: Locator, emoji: string): Locator {
    return messageLocator.getByRole("button", {
      name: `Toggle ${emoji} reaction`,
    });
  }

  // ---- Search ----

  async searchMessages(query: string) {
    await this.demo
      .getByRole("textbox", { name: "Search messages" })
      .fill(query);
    await this.demo
      .getByRole("textbox", { name: "Search messages" })
      .press("Enter");
  }

  async waitForSearchSidebar() {
    // Wait for the sidebar panel itself, then for at least one result to render
    await this.page
      .locator('[data-slot="sidebar"]')
      .waitFor({ state: "visible", timeout: 3000 });
    await this.page
      .locator('[data-slot="sidebar"] [data-slot="chat-event"]')
      .first()
      .waitFor({ state: "attached", timeout: 3000 });
  }

  getSearchResults(): Locator {
    return this.page
      .locator('[data-slot="sidebar"] [data-slot="chat-event"]');
  }

  async clickSearchResult(index: number) {
    // force:true bypasses headless-mode actionability quirks inside the overflow-y-auto sidebar
    await this.getSearchResults().nth(index).click({ force: true });
  }

  // ---- Header menu ----

  async openHeaderMenu() {
    await this.demo
      .locator('[data-slot="chat-header"]')
      .getByRole("button", { name: "More options" })
      .click();
  }

  async clickHeaderMenuItem(label: string) {
    await this.page.getByRole("menuitem", { name: label }).click();
  }

  // ---- Sidebar / Profile / Block ----

  async waitForSidebarTitle(title: string) {
    await this.page
      .locator(`text=${title}`)
      .filter({ has: this.page.locator('[data-slot="sidebar"], [role="dialog"]') })
      .or(
        this.page
          .locator('[data-slot="sidebar"]')
          .getByText(title)
      )
      .first()
      .waitFor({ state: "visible", timeout: 3000 });
  }

  async isBlockedBadgeVisible(): Promise<boolean> {
    return this.demo
      .locator('[data-slot="chat-header-main"]')
      .getByText("Blocked")
      .isVisible();
  }

  async confirmBlockDialog() {
    await this.page.getByRole("dialog").getByRole("button", { name: "Block" }).click();
  }

  async cancelBlockDialog() {
    await this.page.getByRole("dialog").getByRole("button", { name: "Cancel" }).click();
  }
}

export const test = base.extend<{ chatPage: ChatPage }>({
  chatPage: async ({ page }, use) => {
    await use(new ChatPage(page));
  },
});

export { expect } from "@playwright/test";
