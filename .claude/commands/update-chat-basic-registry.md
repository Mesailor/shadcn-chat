# Update chat-basic registry

The `chat-basic` registry block (`registry.json` → `"name": "chat-basic"`) mirrors the live demo at `src/components/examples/chat-example-component.tsx`. Your task is to sync the registry with any changes made to the example component.

## Source of truth

`src/components/examples/chat-example-component.tsx` is the source of truth. The installed registry must produce an identical result.

## Mapping rules

All registry files live under `registry/new-york/blocks/chat-basic/` (referred to as `registry/...` below). Derive the current file list from the filesystem at task time — do not rely on a hardcoded list.

| Source | Registry path | Install target |
|---|---|---|
| `src/components/examples/chat-example-component.tsx` | `registry/.../page.tsx` | `app/chat/page.tsx` |
| `src/data/<name>.ts` | `registry/.../data/<name>.ts` | `data/mock/<name>.ts` |
| `src/data/examples/<name>.ts` | `registry/.../data/<name>.ts` | `data/mock/<name>.ts` |
| `src/hooks/examples/<name>.ts` | `registry/.../hooks/use-<name>.ts` | `hooks/chat/use-<name>.ts` |
| `src/hooks/use-is-wider.ts` | `registry/.../hooks/use-is-wider.ts` | `hooks/use-is-wider.ts` |
| `src/components/examples/<path>` | `registry/.../components/<path>` | `components/chat/<path>` |

Hook files are renamed with the `use-` prefix (e.g. `messages.ts` → `use-messages.ts`) to follow convention and avoid basename collisions during shadcn CLI import resolution. Hook entries in `registry.json` use `"type": "registry:hook"`. All other non-page entries use `"type": "registry:file"` for data files and `"type": "registry:component"` for component files.

## Import path rewriting rule

When copying a source file into the registry, rewrite all internal `@/` imports so they point to the registry path equivalents. The pattern:

| Original prefix | Registry prefix |
|---|---|
| `@/data/...` | `@/registry/new-york/blocks/chat-basic/data/...` |
| `@/data/examples/...` | `@/registry/new-york/blocks/chat-basic/data/...` |
| `@/hooks/examples/<name>` | `@/registry/new-york/blocks/chat-basic/hooks/use-<name>` |
| `@/hooks/use-is-wider` | `@/registry/new-york/blocks/chat-basic/hooks/use-is-wider` |
| `@/components/examples/...` | `@/registry/new-york/blocks/chat-basic/components/...` |

The shadcn CLI then rewrites `@/registry/new-york/blocks/chat-basic/...` back to `@/` install paths when the user runs `npx shadcn add`.

## Custom CSS

Custom Tailwind utilities and keyframes live in the `"css"` field of the `chat-basic` item in `registry.json` (not in a separate file). The shadcn CLI injects them into the user's `globals.css` automatically on install.

The source definitions are in `src/app/globals.css`. Keep the `"css"` field in sync with any changes there.

## Steps

1. Read `src/components/examples/chat-example-component.tsx` and all files it depends on under `src/hooks/examples/`, `src/components/examples/`, and `src/data/`.
2. Diff each source file against its corresponding registry file using the mapping rules above.
3. Update changed registry files, rewriting imports as described.
4. If a source file was added: create the registry file and add an entry to `registry.json`.
5. If a source file was removed: delete the registry file and remove its entry from `registry.json`.
6. If custom CSS changed in `src/app/globals.css`, update the `"css"` field in `registry.json`.
7. Run `npm run registry:build` and confirm output is `✔ Building registry.`
