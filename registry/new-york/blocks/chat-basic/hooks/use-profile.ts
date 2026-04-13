import { useCallback, useState } from "react";

export const useProfile = ({
  setSidebarOpen,
  setSidebarView,
  onBlock,
  onUnblock,
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarView: React.Dispatch<React.SetStateAction<"search" | "profile">>;
  onBlock: (userId: string) => Promise<void>;
  onUnblock: (userId: string) => Promise<void>;
}) => {
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const openProfile = useCallback(() => {
    setSidebarView("profile");
    setSidebarOpen(true);
  }, [setSidebarView, setSidebarOpen]);

  const handleBlock = useCallback(
    async (userId: string) => {
      try {
        await onBlock(userId);
        setIsBlocked(true);
        setOpenBlockDialog(false);
      } catch (error) {
        console.error("Failed to block user:", error);
      }
    },
    [onBlock],
  );

  const handleUnblock = useCallback(
    async (userId: string) => {
      try {
        await onUnblock(userId);
        setIsBlocked(false);
      } catch (error) {
        console.error("Failed to unblock user:", error);
      }
    },
    [onUnblock],
  );

  return {
    openBlockDialog,
    setOpenBlockDialog,
    isBlocked,
    openProfile,
    handleBlock,
    handleUnblock,
  };
};
