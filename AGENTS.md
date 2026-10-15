# Premissas do projeto

- Vercel é o destino oficial de publicação do Flexge Partner Dashboard.
- Publicações devem seguir `VERCEL.md`, usando `npm run build:vercel` e o repositório GitHub `https://github.com/rmdesignoid/flexgepartnerdashboard`, cuja branch `main` está conectada ao Vercel.
- Não publicar este projeto no ChatGPT Sites/Cloudflare Sites. A presença de `.openai/hosting.json` é legado e não define o destino de publicação.
- Preservar trabalho local existente e limitar os commits à alteração solicitada. Validar o build Vercel e os testes pertinentes antes do envio.

# Design System obrigatório

Estas regras valem para todo o repositório, incluindo novas telas, protótipos, clones e forks. Aplicar o Design System Flexge por padrão, sem depender de lembrete no prompt.

- Antes de criar ou alterar interface, ler `src/design-system/README.md` e consultar os componentes relevantes em `src/design-system/catalog.ts`, `src/design-system/index.tsx` e nas stories correspondentes.
- A implementação canônica está em `src/design-system/`: `palette.css`, `tokens.css`, `index.tsx`, `styles.css` e `motion.css`. O catálogo em `/design-system` e o Storybook demonstram essa implementação. Figma é referência de design; divergências devem ser reconciliadas no núcleo, nunca resolvidas com uma cópia local.
- Importar componentes de `@/src/design-system`. Compor os componentes existentes antes de criar novos. Não recriar botões, campos, seletores, badges, cards, tabelas, menus, modais ou navegação já disponíveis no núcleo, inclusive com HTML nativo estilizado para substituí-los.
- Usar os tokens semânticos `--ds-*` para cores, tipografia, espaçamento, raios, sombras e movimento. Não introduzir valores visuais arbitrários, outra biblioteca visual ou uma paleta paralela. Medidas estruturais específicas de layout podem ser locais quando não houver token aplicável.
- CSS de features deve cuidar da composição e do layout. Não sobrescrever seletores `.ds-*` ou redefinir tokens globais para mudar um componente em uma tela; adicionar uma prop/variante reutilizável no núcleo quando necessário.
- Um componente ausente e reutilizável deve nascer no núcleo com API explícita, estados acessíveis, stories e documentação no catálogo. Regras de negócio ficam em `src/features/`. Seguir o fluxo de extensão e validação do README do Design System.
- Preservar foco visível, navegação por teclado, nomes acessíveis, estados disabled/loading/error e tema escuro quando aplicáveis; usar os ícones e assets existentes.
- Telas antigas contêm CSS e controles legados. Isso não é precedente para novo código. Migrar o trecho alterado ao núcleo quando fizer parte do escopo; não fazer uma reescrita ampla incidental.
- Antes de entregar alterações de UI, executar `npm run test:design-system` e `npm run build:vercel`; para mudanças no núcleo, executar também `npm run build-storybook`. Depois do build Vercel, validar as rotas com `node --test tests/design-system-route.test.mjs tests/vercel-deployment.test.mjs`. Relatar os resultados e qualquer limitação real.
- Manter estas instruções e os arquivos de entrada das demais IAs apontando para a mesma fonte. Não duplicar especificações visuais nas regras de cada ferramenta.
