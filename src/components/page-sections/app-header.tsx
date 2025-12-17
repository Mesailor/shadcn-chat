import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  return (
    <header className="px-4 py-3 fixed top-0 left-0 w-full backdrop-blur-sm border-b z-50">
      <ThemeToggle className="ml-auto flex" />
    </header>
  );
}
