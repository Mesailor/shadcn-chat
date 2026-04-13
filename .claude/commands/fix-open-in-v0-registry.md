# Fix open-in-v0-chat registry imports

The v0 chat environment fails to rewrite `@/registry/new-york/...` import paths when installing the `open-in-v0-chat` block (this works correctly in a normal `npx shadcn add` installation). This skill patches the already-built `public/r/open-in-v0-chat.json` by resolving all registry-namespace imports to the final install paths.

Run this after every `npm run registry:build` (i.e. after `/update-chat-basic-registry`).

## Import mapping

| Registry path (in built JSON) | Resolved install path |
|---|---|
| `@/registry/new-york/blocks/chat-basic/data/` | `@/data/mock/` |
| `@/registry/new-york/blocks/chat-basic/hooks/use-is-wider` | `@/hooks/use-is-wider` |
| `@/registry/new-york/blocks/chat-basic/hooks/` | `@/hooks/chat/` |
| `@/registry/new-york/blocks/chat-basic/components/` | `@/components/chat/` |
| `@/registry/new-york/chat/` | `@/components/chat/` |

Note: `use-is-wider` is matched before the general hooks rule so it maps to `@/hooks/` instead of `@/hooks/chat/`.

## Steps

1. Run the following substitutions on `public/r/open-in-v0-chat.json` (order matters):
   ```bash
   sed -i '' \
     -e 's|@/registry/new-york/blocks/chat-basic/data/|@/data/mock/|g' \
     -e 's|@/registry/new-york/blocks/chat-basic/hooks/use-is-wider|@/hooks/use-is-wider|g' \
     -e 's|@/registry/new-york/blocks/chat-basic/hooks/|@/hooks/chat/|g' \
     -e 's|@/registry/new-york/blocks/chat-basic/components/|@/components/chat/|g' \
     -e 's|@/registry/new-york/chat/|@/components/chat/|g' \
     public/r/open-in-v0-chat.json
   ```
2. Verify no registry paths remain:
   ```bash
   grep -c '@/registry/new-york' public/r/open-in-v0-chat.json || echo "Clean"
   ```
   Expected output: `Clean` (or `0` if grep returns a count).
