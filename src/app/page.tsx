import { UsageExampleSection } from "@/components/page-sections/usage-example/usage-example-section";
import { ComponentDemoSection } from "@/components/page-sections/component-demo-section";
import { InstallationSection } from "@/components/page-sections/installation-section";
import { CTASection } from "@/components/page-sections/cta-section";

export default function Home() {
  return (
    <main className="py-32 flex flex-col items-center">
      <CTASection />

      <ComponentDemoSection />
      <InstallationSection />
      <UsageExampleSection />
    </main>
  );
}
