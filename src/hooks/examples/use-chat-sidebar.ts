import { useState } from "react";

export const useChatSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<"search" | "profile">(
    "search",
  );

  return {
    sidebarOpen,
    setSidebarOpen,
    sidebarView,
    setSidebarView,
  };
};
