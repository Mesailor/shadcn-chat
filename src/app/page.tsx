import { UsageExampleSection } from "@/components/page-sections/usage-example/usage-example-section";
import { ExampleSection } from "@/components/page-sections/example-section";
import { InstallationSection } from "@/components/page-sections/installation-section";

export default function Home() {
  return (
    <main className="py-32 flex flex-col items-center">
      <section className="py-8 w-full max-w-2xl px-4 text-center space-y-4">
        <h1 className="text-3xl">Chat Window Component Page</h1>
        <p className="text-lg text-center text-muted-foreground">
          This is the home page. Navigate to the dashboard to see the chat
          window component in action.
        </p>
      </section>

      <ExampleSection />
      <InstallationSection />
      <UsageExampleSection />
    </main>
  );
}
