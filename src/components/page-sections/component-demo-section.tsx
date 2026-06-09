"use client";

import { ChatExampleComponent } from "@/components/examples/chat-example-component";
import { CSSProperties, ReactNode, useRef, useState } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import {
  Maximize2Icon,
  MessageCircleIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import Link from "next/link";

const SCREEN_SIZES: { [key: string]: CSSProperties } = {
  desktop: { width: "100%", maxWidth: 1280, height: "85vh" },
  tablet: { width: "100%", maxWidth: 768, height: "85vh" },
  smartphone: { width: "100%", maxWidth: 375, height: 667 },
  chatbox: { width: "100%", maxWidth: 344, height: 344 },
};

const BUTTONS: { icon: ReactNode; size: keyof typeof SCREEN_SIZES }[] = [
  { icon: <MonitorIcon />, size: "desktop" },
  { icon: <TabletIcon />, size: "tablet" },
  { icon: <SmartphoneIcon />, size: "smartphone" },
  { icon: <MessageCircleIcon />, size: "chatbox" },
];

export function ComponentDemoSection() {
  const [screenSize, setScreenSize] =
    useState<keyof typeof SCREEN_SIZES>("desktop");
  const sectionRef = useRef<HTMLElement>(null);

  const handleSetScreenSize = (size: keyof typeof SCREEN_SIZES) => {
    setScreenSize(size);
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="min-h-[600px] w-full py-8 md:px-4 space-y-4 flex flex-col items-center scroll-m-12"
    >
      <div className="flex items-center gap-2">
        <ButtonGroup className="hidden sm:flex">
          {BUTTONS.map((button) => (
            <Button
              key={button.size}
              size="icon-sm"
              variant={screenSize === button.size ? "default" : "outline"}
              onClick={() => handleSetScreenSize(button.size)}
            >
              {button.icon}
            </Button>
          ))}
        </ButtonGroup>
        <Button className="sm:size-8" variant="outline" asChild>
          <Link href="/demo">
            <span className="sm:hidden">Full-screen demo</span>
            <Maximize2Icon />
          </Link>
        </Button>
      </div>
      <div
        className="border rounded-lg overflow-hidden transition-all duration-500 max-h-[1080px]"
        style={{
          width: SCREEN_SIZES[screenSize].width,
          height: SCREEN_SIZES[screenSize].height,
          maxWidth: SCREEN_SIZES[screenSize].maxWidth,
        }}
      >
        <ChatExampleComponent />
      </div>
    </section>
  );
}
