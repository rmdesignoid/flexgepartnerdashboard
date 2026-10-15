## Alteração

Descreva o problema e o comportamento resultante.

## Design System

- Componentes e tokens Flexge reutilizados:
- Extensões do núcleo, stories e catálogo (se houver):
- Exceções ou legado ainda presente no trecho alterado e justificativa:

## Validação

- [ ] `npm run test:design-system`
- [ ] `npm run build:vercel`
- [ ] Após o build: `node --test tests/design-system-route.test.mjs tests/vercel-deployment.test.mjs`
- [ ] Se alterou o núcleo: `npm run build-storybook`
- [ ] Se alterou distribuição: `npm run registry:build` e `npm run registry:validate`
- [ ] UI alterada revisada no navegador: estados, teclado, foco, responsividade e tema quando aplicável

Inclua evidências visuais quando houver mudança de interface e registre comandos
não executados, falhas ou itens que não se aplicam.
