import {
  Event,
  EventContent,
  EventFile,
  EVENTS,
} from "@/registry/new-york/blocks/chat-basic/data/messages";
import { CURRENT_USER } from "@/registry/new-york/blocks/chat-basic/data/users";

export const searchEvents = (query: string): Promise<Event[]> => {
  const q = query.trim().toLowerCase();
  if (!q) return Promise.resolve([]);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(EVENTS.filter((e) => e.content.text?.toLowerCase().includes(q)));
    }, 150);
  });
};

export const getEvents = () => {
  // Simulate fetching events from an API with a delay
  return new Promise<Event[]>((resolve) => {
    resolve(EVENTS);
  });
};

export const postEvent = ({
  text,
  files,
}: {
  text?: string;
  files?: File[];
}): Promise<Event> => {
  if (!text && (!files || files.length === 0)) {
    return Promise.reject(new Error("Either text or files must be provided"));
  }

  const content: EventContent = {
    type: "message",
    ...(text && { text }),
    ...(files &&
      files.length > 0 && {
        files: files.map((file) => ({
          url: URL.createObjectURL(file),
          fileName: file.name,
          mimeType: file.type || undefined,
        })),
      }),
  };

  const newEvent: Event = {
    id: Date.now(),
    status: "sent",
    sender: CURRENT_USER,
    timestamp: Date.now(),
    content,
  };
  // Simulate posting an event to an API with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      EVENTS.unshift(newEvent); // Add to the beginning since events are in reverse order
      resolve(newEvent);
    }, 1000);
  });
};

export const deleteEvent = (id: number) => {
  return new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      const index = EVENTS.findIndex((e) => e.id === id);
      if (index !== -1) {
        EVENTS.splice(index, 1);
        resolve(id);
      } else {
        reject(new Error("Event not found"));
      }
    }, 500);
  });
};

export const updateEvent = (
  id: number,
  data: { text?: string; uploadFiles?: File[]; editedFiles?: EventFile[] },
) => {
  return new Promise<Event>((resolve, reject) => {
    setTimeout(() => {
      const event = EVENTS.find((e) => e.id === id);
      if (!event) {
        reject(new Error("Event not found"));
        return;
      }
      const newFiles: EventFile[] = (data.uploadFiles ?? []).map((file) => ({
        url: URL.createObjectURL(file),
        fileName: file.name,
        mimeType: file.type || undefined,
      }));
      const allFiles = [...(data.editedFiles ?? []), ...newFiles];
      event.content = {
        ...event.content,
        ...(data.text !== undefined && { text: data.text }),
        ...(allFiles.length > 0 ? { files: allFiles } : { files: undefined }),
      };
      event.isEdited = true;
      resolve(structuredClone(event));
    }, 500);
  });
};

const blockUser = (userId: string): Promise<void> => {
  console.log(`Blocking user with ID: ${userId}`);
  return new Promise((resolve) => setTimeout(resolve, 200));
};

const unblockUser = (userId: string): Promise<void> => {
  console.log(`Unblocking user with ID: ${userId}`);
  return new Promise((resolve) => setTimeout(resolve, 200));
};

export const reactToEvent = (
  eventId: number,
  emoji: string,
): Promise<Event> => {
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
  blockUser,
  unblockUser,
  reactToEvent,
  searchEvents,
  deleteEvent,
  updateEvent,
  getEvents,
  postEvent,
};
