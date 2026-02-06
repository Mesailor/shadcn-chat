import { UsageExampleSection } from "@/components/page-sections/usage-example/usage-example-section";
import { ComponentDemoSection } from "@/components/page-sections/component-demo-section";
import { InstallationSection } from "@/components/page-sections/installation/installation-section";
import { CTASection } from "@/components/page-sections/cta-section";
import { BottomCTASection } from "@/components/page-sections/bottom-cta-section";
import { AppHeader } from "@/components/page-sections/app-header";

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="py-16 sm:py-32 flex flex-col items-center">
        <CTASection />

        <ComponentDemoSection />
        <InstallationSection />
        <UsageExampleSection />
        <BottomCTASection />
      </main>
    </>
  );
}
