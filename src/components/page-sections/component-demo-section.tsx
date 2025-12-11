"use client";

import { ChatExampleComponent } from "@/components/examples/chat-example-component";
import { ReactNode, useState } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import {
  CodeIcon,
  MessageCircleIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import Link from "next/link";

const SCREEN_SIZES = {
  desktop: { width: "100%", height: 667 },
  tablet: { width: 768, height: 667 },
  smartphone: { width: 375, height: 667 },
  chatbox: { width: 344, height: 344 },
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

  return (
    <section className="h-[800px] py-8 w-full px-6 space-y-4 flex flex-col items-center">
      <div className="relative w-full flex justify-center">
        <ButtonGroup>
          {BUTTONS.map((button) => (
            <Button
              key={button.size}
              size="icon-sm"
              variant={screenSize === button.size ? "default" : "outline"}
              onClick={() => setScreenSize(button.size)}
            >
              {button.icon}
            </Button>
          ))}
        </ButtonGroup>
        <Button
          className="absolute top-0 right-2"
          variant="ghost"
          size="sm"
          asChild
        >
          <Link
            href="https://github.com/Mesailor/shadcn-chat"
            target="_blank"
            rel="noreferrer"
          >
            <CodeIcon /> Code
          </Link>
        </Button>
      </div>
      <div
        className="border rounded-lg overflow-hidden transition-all duration-500"
        style={{
          width: SCREEN_SIZES[screenSize].width,
          height: SCREEN_SIZES[screenSize].height,
        }}
      >
        <ChatExampleComponent />
      </div>
    </section>
  );
}
