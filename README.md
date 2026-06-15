# Document Viewer

SSOT-governed Groupsum workspace for the `@groupsum/document-viewer` React package.

## Workspace

- Python workspace: `uv` with `ssot-registry` in the dev dependency group.
- JavaScript workspace: `pnpm` with packages under `packages/*`.
- Component package: `packages/document-viewer`.

## Commands

```powershell
uv sync
pnpm install
pnpm run typecheck
pnpm run build
uv run ssot validate .
```
