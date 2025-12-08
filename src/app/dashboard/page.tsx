import { AppSidebar } from "@/components/app-sidebar";
import { ChatExampleComponent } from "@/components/examples/chat-example-component";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <ChatExampleComponent />
      </SidebarInset>
    </SidebarProvider>
  );
}
