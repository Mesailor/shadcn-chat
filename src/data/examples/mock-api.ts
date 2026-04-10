import { Event, EVENTS } from "../messages";

const reactToEvent = (eventId: number, emoji: string): Promise<Event> => {
  const event = EVENTS.find((e) => e.id === eventId);
  if (!event) return Promise.reject(new Error("Event not found"));

  if (event.reactions?.includes(emoji)) {
    event.reactions = event.reactions.filter((r) => r !== emoji);
  } else {
    event.reactions = [emoji];
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(event), 200);
  });
};

export const mockAPI = {
  reactToEvent,
};
