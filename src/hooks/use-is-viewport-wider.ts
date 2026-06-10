import { useState, useEffect } from "react";

export function useIsViewportWider(pixels: number) {
  const [isWider, setIsWider] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${pixels}px)`);
    setIsWider(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsWider(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [pixels]);

  return isWider;
}
