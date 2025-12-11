import { Anchor } from "@/components/common/anchor";
import { EventUsageExample } from "./event-usage-example";
import { HeaderUsageExample } from "./header-usage-example";
import { MessagesUsageExample } from "./messages-usage-example";
import { ToolbarUsageExample } from "./toolbar-usage-example";

export function UsageExampleSection() {
  return (
    <section className="py-8 w-full max-w-4xl px-6 space-y-6">
      <Anchor id="usage-example" className="border-b pb-2">
        <h2 className="text-2xl font-semibold">Usage Example</h2>
      </Anchor>

      <HeaderUsageExample />
      <MessagesUsageExample />
      <EventUsageExample />
      <ToolbarUsageExample />
    </section>
  );
}
