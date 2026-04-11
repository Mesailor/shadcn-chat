import { useState, useEffect, RefObject } from "react";

export function useIsWider(ref: RefObject<HTMLElement | null>, pixels: number) {
  const [isWider, setIsWider] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setIsWider(entry.contentRect.width >= pixels);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, pixels]);

  return isWider;
}
