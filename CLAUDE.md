# Flexge repository instructions

Read and follow @AGENTS.md and @src/design-system/README.md before UI work.

Every screen and prototype must use the Flexge Design System, including in
clones and forks. Import components from `@/src/design-system` and reuse semantic
`--ds-*` tokens. Compose existing components and extend the shared core for
reusable gaps; keep business logic in features. Do not create a parallel UI
library or override core component styling locally. The canonical guide defines
stories, accessibility, validation and collaboration. Follow `VERCEL.md` for
publishing.
