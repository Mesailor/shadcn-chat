/* One-off sync of chat-basic registry from the example sources. */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ALIAS = "@/registry/new-york/blocks/chat-basic";
const REG = path.join(ROOT, "registry/new-york/blocks/chat-basic");

function rewrite(content, srcFile) {
  // Resolve relative imports to @/ aliases first
  content = content.replace(/from "(\.{1,2}\/[^"]+)"/g, (m, rel) => {
    const abs = path.posix
      .normalize(path.posix.join(path.posix.dirname(srcFile), rel))
      .replace(/^src\//, "@/");
    return `from "${abs}"`;
  });
  return content
    .replace(/@\/data\/examples\//g, `${ALIAS}/data/`)
    .replace(/@\/data\//g, `${ALIAS}/data/`)
    .replace(/@\/hooks\/examples\//g, `${ALIAS}/hooks/`)
    .replace(
      /@\/hooks\/(use-is-wider|use-long-press|use-is-viewport-wider)/g,
      `${ALIAS}/hooks/$1`,
    )
    .replace(/@\/components\/examples\//g, `${ALIAS}/components/`);
}

function emit(srcRel, destRel, transform) {
  let content = fs.readFileSync(path.join(ROOT, srcRel), "utf8");
  content = rewrite(content, srcRel);
  if (transform) content = transform(content);
  const dest = path.join(REG, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
  console.log("wrote", destRel);
}

// page.tsx: default export + full-viewport height
emit("src/components/examples/chat-example-component.tsx", "page.tsx", (c) =>
  c
    .replace(
      "export function ChatExampleComponent()",
      "export default function ChatExampleComponent()",
    )
    .replace(
      '<Chat ref={chatContainerRef} className="h-full">',
      '<Chat ref={chatContainerRef} className="h-svh">',
    ),
);

// data
for (const f of ["messages.ts", "users.ts"]) emit(`src/data/${f}`, `data/${f}`);
emit("src/data/examples/mock-api.ts", "data/mock-api.ts");

// hooks
for (const f of fs.readdirSync(path.join(ROOT, "src/hooks/examples"))) {
  if (f.endsWith(".ts")) emit(`src/hooks/examples/${f}`, `hooks/${f}`);
}
for (const f of ["use-is-wider.ts", "use-long-press.ts", "use-is-viewport-wider.ts"]) {
  emit(`src/hooks/${f}`, `hooks/${f}`);
}

// components (everything under examples except the page source and tests)
const COMP_SRC = path.join(ROOT, "src/components/examples");
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "__tests__") walk(full);
      continue;
    }
    if (
      entry.name === "chat-example-component.tsx" ||
      entry.name.includes(".test.")
    )
      continue;
    const rel = path.relative(COMP_SRC, full);
    emit(path.relative(ROOT, full), path.join("components", rel));
  }
})(COMP_SRC);
