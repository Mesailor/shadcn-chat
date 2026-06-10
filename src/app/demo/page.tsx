"use client";

import { useEffect, useRef } from "react";
import { ChatExampleComponent } from "@/components/examples/chat-example-component";

export default function DemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const updateHeight = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${vv.height}px`;
      }
    };

    vv.addEventListener("resize", updateHeight);
    updateHeight();

    return () => vv.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div ref={containerRef} className="h-dvh overflow-hidden">
      <ChatExampleComponent />
    </div>
  );
}
