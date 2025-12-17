import { useSyncExternalStore } from "react";

export function useMounted() {
  return useSyncExternalStore(
    () => () => {}, // Empty subscribe function (we don't need to subscribe to anything)
    () => true, // Client-side value
    () => false // Server-side value
  );
}
