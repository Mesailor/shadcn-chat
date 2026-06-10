import { User } from "@/registry/new-york/blocks/chat-basic/data/users";

export type EventType = "message" | "system";

export interface EventFile {
  url: string;
  fileName: string;
  mimeType?: string;
}

export interface EventContent {
  type: EventType;
  text?: string;
  files?: EventFile[];
}

export interface Event {
  id: number;
  tempId?: number; // Temporary ID for optimistic UI updates
  status: "sending" | "sent" | "failed";
  sender: User;
  timestamp: number;
  content: EventContent;
  reactions?: string[];
  isEdited?: boolean;
}

export const EVENTS: Event[] = [
  {
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
      text: "Hey John, just wanted to say - the new dashboard design looks fantastic! The way you organized the metrics is super intuitive. I can already tell our users are going to love it. Great work on this! 🙌",
    },
  },
  {
    id: 16,
    status: "sent",
    sender: {
      id: "johndoe-user-id",
      name: "John Doe",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
      username: "@johndoe",
    },
    timestamp: 1234878110123,
    content: {
      type: "message",
      text: "Oh, and could you also share those user feedback notes? I want to make sure we're really nailing what they need before we ship this.",
    },
  },
  {
    id: 15,
    status: "sent",
    sender: {
      id: "johndoe-user-id",
      name: "John Doe",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
      username: "@johndoe",
    },
    timestamp: 1234878100123,
    content: {
      type: "message",
      text: "Just tested the new checkout flow - it's so smooth! The loading states you added make such a difference. Customers are gonna love this! 🚀",
    },
  },
  {
    id: 14,
    status: "sent",
    sender: {
      id: "johndoe-user-id",
      name: "John Doe",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
      username: "@johndoe",
    },
    timestamp: 1234678090123,
    content: {
      type: "message",
      text: "Sweet! I'll check it out on mobile too and let you know. Thanks for keeping accessibility in mind - that's real value right there!",
    },
  },
  {
    id: 13,
    status: "sent",
    sender: {
      id: "annsmith-user-id",
      name: "Ann Smith",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@annsmith",
    },
    timestamp: 1234678080123,
    content: {
      type: "message",
      text: "But first, could you give the responsive design a quick look? I want to make sure it feels great on all devices before we show it to users.",
    },
  },
  {
    id: 12,
    status: "sent",
    sender: {
      id: "annsmith-user-id",
      name: "Ann Smith",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@annsmith",
    },
    timestamp: 1234678070123,
    content: {
      type: "message",
      text: "Hey! Just wrapped up the dashboard redesign. Focused on making the key metrics super easy to find - think our users will really appreciate it!",
    },
  },
  {
    id: 11,
    status: "sent",
    sender: {
      id: "johndoe-user-id",
      name: "John Doe",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
      username: "@johndoe",
    },
    timestamp: 1234677970123,
    content: {
      type: "message",
      text: "Also, how's the performance optimization going? Any wins on those load times we discussed?",
    },
  },
  {
    id: 10,
    status: "sent",
    sender: {
      id: "johndoe-user-id",
      name: "John Doe",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
      username: "@johndoe",
    },
    timestamp: 1234677910123,
    content: {
      type: "message",
      text: "Hey! How's it going? Did you get a chance to look at those user journey mockups? Want to make sure we're solving the right problems for them.",
    },
  },
  {
    id: 9,
    status: "sent",
    sender: {
      id: "annsmith-user-id",
      name: "Ann Smith",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@annsmith",
    },
    timestamp: 1234567919123,
    content: {
      type: "message",
      text: "I'll ping you here once it's ready for a demo!",
    },
  },
  {
    id: 8,
    status: "sent",
    sender: {
      id: "annsmith-user-id",
      name: "Ann Smith",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@annsmith",
    },
    timestamp: 1234567917123,
    content: {
      type: "message",
      text: "Perfect! Time to build something awesome ✨",
    },
  },
  {
    id: 7,
    status: "sent",
    sender: {
      id: "annsmith-user-id",
      name: "Ann Smith",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_20.png",
      username: "@annsmith",
    },
    timestamp: 1234567913123,
    content: {
      type: "message",
      text: "Awesome, thanks! That totally makes sense now. I love how we're thinking about the end user experience here. Can't wait to see their reaction when this goes live!",
    },
  },
  {
    id: 6,
    status: "sent",
    sender: {
      id: "johndoe-user-id",
      name: "John Doe",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
      username: "@johndoe",
    },
    timestamp: 1234567910123,
    content: {
      type: "message",
      text: "So basically - keep the interactions snappy, add subtle animations for feedback, and make sure error states are super clear. When users feel confident using the interface, they stick around. That's the value we're delivering! 😊",
    },
  },
  {
    id: 5,
    status: "sent",
    sender: {
      id: "johndoe-user-id",
      name: "John Doe",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
      username: "@johndoe",
    },
    timestamp: 1234567910123,
    content: { type: "message", text: "Here's what I'm thinking:" },
  },
  {
    id: 4,
    status: "sent",
    sender: {
      id: "johndoe-user-id",
      name: "John Doe",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
      username: "@johndoe",
    },
    timestamp: 1234567899123,
    content: {
      type: "message",
      text: "Absolutely! Let me pull up my notes from the customer interviews",
    },
  },
  {
    id: 3,
    status: "sent",
    sender: {
      id: "johndoe-user-id",
      name: "John Doe",
      avatarUrl:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_13.png",
      username: "@johndoe",
    },
    timestamp: 1234567895123,
    content: { type: "message", text: "Hey! Doing great, thanks for asking!" },
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
    timestamp: 1234567892123,
    content: {
      type: "message",
      text: "Could you share your thoughts on the UX flow? Want to make sure we're creating real value for our users.",
    },
  },
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
    timestamp: 1234567890123,
    content: { type: "message", text: "Hey there! How's your day going?" },
  },
];
