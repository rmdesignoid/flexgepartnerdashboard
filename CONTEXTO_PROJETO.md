# Contexto do projeto Flexge

> Documento de handoff para outra IA. Baseado no estado local do repositório em 13/08/2026. Leia este arquivo antes de propor ou implementar mudanças.

## Premissa de publicação (atualizada em 08/10/2026)

O destino oficial de publicação é o **Vercel**, via repositório GitHub `rmdesignoid/flexgepartnerdashboard`, branch `main`. Use `npm run build:vercel` e siga `VERCEL.md`. Não publicar no ChatGPT Sites; `.openai/hosting.json` é um manifesto legado.

## Resumo executivo

Este repositório contém um protótipo front-end do painel do professor da Flexge, com foco em planejamento semanal de aulas. A aplicação também inclui telas de recursos didáticos e estudantes, além de um design system documentado no Storybook e distribuível por um registry compatível com shadcn.

O produto atual é uma demonstração navegável, não uma aplicação completa conectada a dados reais. Quase todos os dados estão hardcoded e o estado vive apenas na memória do React. Não há banco habilitado, APIs de domínio, persistência de recursos, upload real, autenticação aplicada às telas nem integrações externas funcionais.

O `README.md` ainda descreve principalmente o starter vinext original e está desatualizado em relação ao produto implementado. Para entender o estado real, priorize este documento e o código.

## Objetivo e público do produto

- Produto: painel web para professores/gestores de ensino de inglês.
- Caso de uso principal: visualizar a agenda semanal, abrir os detalhes de uma aula e preparar o plano da aula.
- Casos de uso secundários: organizar materiais didáticos e consultar alunos/progresso.
- Idioma predominante da interface: inglês.
- Exceção atual: a mensagem de indisponibilidade em telas pequenas está em português.
- Plataforma-alvo atual: desktop com largura mínima de 1024 px. Em telas menores, a aplicação esconde o painel e mostra a mensagem `DesktopOnly`.

## Funcionalidades implementadas

### Shell e navegação

- Sidebar expansível/recolhível; a preferência é salva em `localStorage` com a chave `planner-sidebar`.
- Grupos de navegação recolhíveis.
- Alternância de tema claro/escuro apenas durante a sessão.
- Apenas três entradas trocam de módulo de fato: `Class Planner`, `My Resources` e `Students`.
- Os demais itens da navegação são visuais e não possuem tela/rota funcional.

### Class Planner

- Calendário semanal de domingo a sábado, com 24 horas e linha do horário atual.
- Navegação entre semanas e retorno à semana atual.
- Eventos estáticos com estados `To Plan`, `Planning`, `Planned` e `Taught`.
- Aulas em grupo e individuais possuem apresentações visuais diferentes.
- Clique em um evento abre um popover com detalhes e participantes.
- `View Class Plan` abre a experiência de planejamento da aula.
- A tela de planejamento possui abas `Class Plan`, `Class Summary`, `Homework` e `Whiteboard`.
- Somente `Class Plan` e `Class Summary` têm conteúdo. `Homework` e `Whiteboard` ficam vazias.
- Campos, editor e ações como importar, compartilhar e finalizar planejamento são apenas UI; não salvam dados.

### My Resources

- Lista inicial de materiais simulados.
- Busca por título.
- Filtros múltiplos por nível, gramática e tags.
- Modal de detalhes.
- Fluxos locais de criar, editar, duplicar e excluir recursos.
- Validação básica de título e origem do recurso.
- Seletores permitem múltiplos níveis, gramáticas e tags; alguns aceitam criação de opções.
- Alterações existem apenas no estado do componente e são perdidas ao recarregar.
- Upload de arquivo não envia o conteúdo para lugar algum; apenas captura um objeto `File` local durante a sessão.
- Parte das imagens é local em `public/resources/`; existe também um fallback remoto da API de assets do Figma, criando uma dependência externa frágil.

### Students

- Tabela estática com aluno, status, curso, progresso, meta semanal, presença e última atividade.
- Busca por nome ou e-mail.
- Botões de novo aluno, exportação, ações e filtros avançados são visuais ou incompletos.
- Não há CRUD nem integração com dados reais.

## Arquitetura atual

### Stack

- Node.js `>=22.13.0`.
- React `19.2.6` e React DOM `19.2.6`.
- TypeScript `5.9.3`, com modo `strict`.
- vinext `1.0.0-beta.2`, oferecendo uma API compatível com Next.js sobre Vite/Cloudflare.
- Vite `8.0.13`.
- Tailwind CSS `4.2.1`, importado no CSS global, embora a UI principal use majoritariamente CSS manual.
- Radix UI Popover para popovers de evento e filtros.
- Lucide React para ícones.
- Storybook `10.5.7` com addons de documentação e acessibilidade.
- Drizzle ORM + Cloudflare D1 preparados, mas não ativados.

### Organização importante

```text
app/
  page.tsx                 # Toda a aplicação/protótipo principal (client component monolítico)
  globals.css              # Estilos de todas as telas e temas
  layout.tsx               # Metadados e layout raiz
  chatgpt-auth.ts          # Helpers de autenticação opcionais, ainda não usados pela UI
src/design-system/
  index.tsx                # Primitivos reutilizáveis
  tokens.css               # Tokens semânticos e temas
  styles.css               # Estilos dos componentes e documentação
  *.stories.tsx / *.mdx    # Stories e fundamentos no Storybook
registry/
  registry.json            # Catálogo-fonte do registry
  flexge/button-story/     # Exemplo de bloco publicável
public/r/                  # JSON gerado para consumo do registry
scripts/
  build-registry.mjs
  validate-registry.mjs
db/
  schema.ts                # Vazio intencionalmente
  index.ts                 # Inicialização do Drizzle/D1 quando houver binding
examples/d1/               # Exemplo opcional, não parte do fluxo atual
tests/rendered-html.test.mjs # Testes antigos do starter; atualmente obsoletos
worker/index.ts            # Entrada do worker gerada/esperada pela plataforma
.openai/hosting.json       # Configuração de hosting; D1 e R2 estão nulos
```

### Estado e fluxo de dados

- `app/page.tsx` começa com `"use client"` e concentra tipos, dados fake, helpers e todas as views.
- Não há roteamento de domínio: a troca entre planner, recursos e estudantes é feita por `activeModule` dentro da mesma página.
- Modelos locais principais: `PlannerEvent`, `ResourceRecord` e `StudentRecord`.
- Eventos e estudantes são constantes estáticas.
- Recursos começam estáticos e viram estado local com `useState` para simular CRUD.
- Não existe camada de serviços, fetch de API, cache, gerenciamento global de estado ou persistência.
- O calendário usa a data local do navegador; os eventos fake aparecem somente em `weekOffset: 0`, isto é, na semana atual calculada no momento da execução.

## Design system

A pasta `src/design-system` é declarada como fonte de verdade dos componentes core. Os princípios já registrados são:

- usar tokens semânticos `--ds-*`, evitando cores e espaçamentos locais;
- badges totalmente arredondados com `--ds-radius-full`;
- campos com estados default, hover, focus, filled, disabled e invalid;
- variantes visuais representadas por props explícitas;
- componente novo deve ter stories dos estados relevantes e tema escuro;
- elementos específicos de calendário, estudantes e recursos devem compor os primitivos, não entrar no núcleo.

Primitivos existentes: `Button`, `IconButton`, `Input`, `SearchInput`, `Textarea`, `Select`, `FormField`, `Badge`, `StatusBadge`, `Avatar`, `AvatarStack`, `Card`, `Tabs` e `EmptyState`.

Há uma separação ainda incompleta: a tela principal usa os tokens do design system, mas implementa muitos componentes e estilos próprios diretamente em `app/page.tsx` e `app/globals.css`, em vez de consumir todos os primitivos de `src/design-system`.

O Storybook carrega `src/design-system/styles.css`, oferece seletor de tema claro/escuro e inclui documentação de foundations. O parâmetro de acessibilidade está como `todo`, portanto não bloqueia builds.

O registry possui 6 itens válidos: button, fields, badge, avatar, tabs e card. Só o botão tem implementação isolada dentro de `registry/flexge`; os demais itens publicam principalmente os arquivos de stories do design system.

## Convenções visuais observadas

- Fonte Inter local em `public/fonts/inter-latin.woff2`.
- Cor primária azul `#285d8d`.
- Accent violeta `#753fe5`.
- Superfícies claras em cinzas muito suaves; tema escuro aplicado via `.theme-dark` e tokens `data-theme="dark"` no design system.
- Controles geralmente têm 32 px de altura e raio de 6 px.
- Ícones são majoritariamente Lucide com traço leve.
- O shell exige desktop e ocupa `100vh`, com scroll interno nas áreas necessárias.

Ao alterar a UI, preserve a linguagem visual existente e prefira os tokens semânticos. Não introduza cores hardcoded sem necessidade. Se um padrão for reutilizável, mova-o para o design system com stories.

## Infraestrutura, autenticação e dados

- O build usa vinext + Vite + plugin Cloudflare/Sites.
- `.openai/hosting.json` não habilita D1 nem R2 (`d1: null`, `r2: null`).
- `db/schema.ts` está vazio. Não assuma que existe banco ou migração de domínio.
- `db/index.ts` só funciona quando o binding `DB` existir.
- `app/chatgpt-auth.ts` fornece `getChatGPTUser`, `requireChatGPTUser`, URLs de login/logout e validação segura de `returnTo`.
- Esses helpers não são importados pela interface atual; a aplicação permanece anônima.
- A plataforma reserva `/signin-with-chatgpt`, `/signout-with-chatgpt` e `/callback`. Não crie rotas da aplicação nesses caminhos.
- Não há variáveis de ambiente de negócio documentadas nem segredos necessários para executar o protótipo.

## Comandos

Em PowerShell com política restrita, use `npm.cmd` em vez de `npm`.

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd run start
npm.cmd run lint
npm.cmd test
npm.cmd run storybook
npm.cmd run build-storybook
npm.cmd run registry:build
npm.cmd run registry:validate
npm.cmd run db:generate
```

- Aplicação local: comando `dev` (porta definida pelo vinext/Vite).
- Storybook: `http://localhost:6006`.
- Registry configurado no `components.json`: `http://localhost:6006/r/{name}.json`.

## Estado de qualidade verificado em 13/08/2026

- `npm.cmd run build`: **passa**. O build de produção foi concluído pelo vinext.
- `npm.cmd run registry:validate`: **passa**, com 6 itens.
- `npm.cmd run lint`: **falha**, com 8 erros e 9 avisos.
- `npm.cmd test`: **falha** após um build bem-sucedido; os 2 testes ainda esperam a tela de loading do starter, metadados antigos e arquivos removidos de `app/_sites-preview`.

Principais problemas do lint:

- uso de `autoFocus` em dois pontos;
- label sem associação com controle;
- elemento não interativo com papel interativo;
- link usado como botão;
- `setState` síncrono dentro de `useEffect` para restaurar a sidebar;
- dependência ausente em um `useEffect` de recursos;
- duas variáveis não usadas em `scripts/build-registry.mjs`;
- avisos de imagens usando `<img>` em vez de uma estratégia otimizada.

Não interprete a falha de `npm test` como falha do build do produto. Os testes estão desalinhados com a aplicação atual e devem ser substituídos por testes do dashboard.

## Dívidas técnicas e limitações prioritárias

1. `app/page.tsx` tem mais de mil linhas e mistura dados, regras, estado e apresentação. Deve ser dividido por feature e componentes.
2. `app/globals.css` também é monolítico e duplica parte dos padrões do design system.
3. Não há persistência, APIs ou backend de domínio.
4. Muitos botões sugerem ações ainda inexistentes; isso pode confundir usuários e testes.
5. Os testes automatizados são herdados do starter e não cobrem o produto atual.
6. O lint não está limpo, com problemas reais de acessibilidade e hooks.
7. O suporte mobile é apenas uma tela de bloqueio.
8. Idiomas estão misturados e não há estratégia de i18n.
9. A dependência de um asset remoto do Figma deve ser removida ou substituída por asset local.
10. O nome do pacote (`site-creator-vinext-starter`) e o README ainda refletem o starter.
11. `Homework` e `Whiteboard` não renderizam conteúdo e podem deixar uma área vazia.
12. Upload, exportação, paginação, autenticação, compartilhamento e salvamento são simulados ou ausentes.

## Cuidados ao trabalhar no repositório

- A árvore Git já contém várias alterações locais e arquivos não rastreados. Não descarte, sobrescreva ou reverta trabalho existente sem autorização explícita.
- Arquivos `.tgz`, `.zip`, logs, diretórios de build (`dist`, `.next`, `.vinext`, `storybook-static`) e caches são artefatos, não fontes primárias.
- Preserve Vercel como destino de publicação. Mudanças de provedor ou de infraestrutura exigem uma nova instrução explícita do usuário.
- Antes de conectar dados reais, defina contratos de domínio e a estratégia de autenticação/autorização.
- Preserve acessibilidade: teclado, foco, labels, `aria-*`, contraste e redução de movimento.
- Ao criar componente reutilizável, atualize implementação, tokens quando necessário, stories e registry quando aplicável.
- Após mudanças, execute pelo menos build, lint e os testes relevantes. No estado atual, registre separadamente falhas preexistentes das regressões introduzidas.

## Próximos passos recomendados

1. Substituir os testes do starter por smoke tests do dashboard e testes dos fluxos de recursos, planner e estudantes.
2. Corrigir os erros de lint/acessibilidade e tornar o lint um gate confiável.
3. Extrair `Planner`, `Resources`, `Students`, sidebar e modais para módulos próprios.
4. Consolidar os componentes comuns no design system e reduzir duplicação em `globals.css`.
5. Decidir o primeiro fluxo realmente persistente (provavelmente recursos ou planos de aula) e então modelar D1/API.
6. Aplicar autenticação somente quando houver dados ou ações por usuário, com autorização server-side.
7. Atualizar `README.md`, nome do pacote e documentação de setup.
8. Definir política de idioma/i18n e comportamento responsivo.

## Instruções para a IA que receber este contexto

- Trate o código local como fonte de verdade e este arquivo como mapa do estado atual.
- Não presuma que controles visuais possuem lógica, backend ou persistência.
- Antes de implementar, identifique se a mudança pertence ao protótipo, ao design system, ao registry ou à infraestrutura.
- Faça mudanças incrementais e preserve a aparência existente, salvo quando o pedido exigir redesign.
- Não habilite D1, R2, autenticação ou serviços externos implicitamente.
- Não edite artefatos gerados quando existir uma fonte correspondente; por exemplo, altere `registry/registry.json`/fontes e rode `registry:build` para regenerar `public/r`.
- Considere como baseline conhecido: build passa; registry valida; lint e testes falham pelos motivos documentados acima.
- Ao concluir uma tarefa, informe arquivos alterados, comportamento implementado e comandos de verificação executados.

## Arquivos para leitura inicial

Na maioria das tarefas, leia nesta ordem:

1. `CONTEXTO_PROJETO.md`
2. `package.json`
3. `app/page.tsx`
4. `app/globals.css`
5. `src/design-system/README.md`
6. `src/design-system/tokens.css`
7. `src/design-system/index.tsx`
8. stories ou arquivos da feature diretamente relacionados à tarefa

