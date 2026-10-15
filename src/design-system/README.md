# Flexge Design System

Esta pasta é a fonte de verdade da interface Flexge em todo o projeto, incluindo
novos protótipos, clones e forks. As instruções de aplicação automática para
agentes estão em [`../../AGENTS.md`](../../AGENTS.md).

## Hierarquia das fontes

| Fonte | Responsabilidade |
| --- | --- |
| `palette.css` e `palettes.ts` | Paleta base e seus dados de documentação; manter os valores sincronizados. |
| `tokens.css` | Tokens semânticos, tipografia, espaçamento, raios, sombras, movimento e temas. |
| `index.tsx`, `styles.css` e `motion.css` | API pública, aparência, estados e comportamento dos componentes de produção. |
| `catalog.ts`, `*.stories.tsx` e exemplos | Documentação e demonstrações que devem acompanhar a API real. |
| `public/design-system/` | Assets compartilhados usados pelos componentes e pelo catálogo. |
| `registry/` e `public/r/` | Distribuição derivada. Atualizar pelas rotinas de registry, sem criar outra implementação. |

Consulte `/design-system` na aplicação e `npm run storybook` para explorar os
componentes. As referências Figma estão no catálogo. Ao encontrar divergência,
registre e reconcilie a decisão no núcleo e na documentação na mesma alteração.
CSS legado de features, screenshots e bundles exportados não substituem o núcleo.

## Construir uma tela

1. Identifique os componentes no catálogo e confira suas props em `index.tsx` e
   os exemplos nas stories. Não presuma APIs de outras bibliotecas.
2. Importe de `@/src/design-system` e componha a tela em `src/features/` ou `app/`.
3. Use tokens semânticos existentes nos estilos da composição. Mantenha regras
   de negócio na feature e estados/variantes reutilizáveis no núcleo.
4. Verifique a tela e seus estados no navegador, além dos comandos de validação.

Exemplo de composição com a API existente:

```tsx
"use client";

import { Button, Card, FormField, Input } from "@/src/design-system";

export function PrototypeForm() {
  return (
    <div className="ds-root">
      <Card header={<h1>Novo protótipo</h1>}>
        <form className="prototype-form" onSubmit={event => event.preventDefault()}>
          <FormField label="Nome" required>
            <Input name="name" placeholder="Nome do protótipo" />
          </FormField>
          <Button type="submit">Continuar</Button>
        </form>
      </Card>
    </div>
  );
}
```

```css
.prototype-form {
  display: grid;
  gap: var(--ds-space-4);
  color: var(--ds-foreground);
  font-family: var(--ds-font-sans);
}
```

`index.tsx` já importa os estilos dos componentes e de movimento; `styles.css`
importa os tokens e a paleta. A aplicação carrega os tokens em `app/globals.css`
e a fonte Inter local. Preserve essa cadeia de imports e os assets ao reutilizar
o projeto. Use `ds-root` nos novos contêineres de UI para a base tipográfica e
`data-theme="dark"` no contêiner quando houver tema escuro.

## Estender sem fragmentar

- Procure primeiro uma composição ou variante existente. CSS local pode definir
  grids, dimensões estruturais e responsividade; não deve redesenhar o núcleo.
- Se faltar uma variante reutilizável, adicione uma prop explícita em
  `index.tsx`, o estilo no núcleo e uma demonstração na story correspondente.
- Se faltar um token, defina seu propósito semântico e os valores nos temas
  aplicáveis em `tokens.css`. Evite tokens específicos de uma única tela.
- Para um novo componente compartilhado, atualize também `catalog.ts` e a
  apresentação no catálogo conforme os padrões de `DesignSystemView.tsx`.
- Inclua os estados relevantes: default, hover, focus, filled, disabled, invalid,
  loading, seleção e tema escuro. Verifique teclado, foco e nomes acessíveis.
- Atualize os testes de comportamento pertinentes. Se o componente for
  distribuído pelo registry, atualize `registry/registry.json`, execute
  `npm run registry:build` e `npm run registry:validate` e inclua os derivados.

Não copie componentes para uma feature nem adicione uma segunda biblioteca de
UI para resolver uma lacuna. Mudanças de identidade visual devem ser explícitas
e centralizadas no núcleo. Novos protótipos seguem o padrão sem pedido adicional.

## Clones, forks e colaboração

As regras vivem no Git, sem depender de configuração pessoal de um colaborador.
Inclua `AGENTS.md`, este guia e os arquivos de entrada de IA em cada clone/fork.
Esses arquivos precisam estar commitados e enviados ao GitHub para serem herdados.
Ferramentas que leem instruções do repositório recebem o mesmo ponto de partida;
nenhum arquivo garante obediência de toda IA. Revise o uso dos componentes no PR.

Ao iniciar uma tarefa, o colaborador deve preservar essas regras. Ao abrir um PR,
informe os componentes/tokens reutilizados e qualquer extensão do núcleo. O
workflow `.github/workflows/design-system.yml` valida testes, Storybook, build
Vercel e rotas; ele não substitui a revisão visual nem detecta toda divergência.
Configure esse check como obrigatório nas regras de proteção da branch do GitHub
se quiser impedir merges sem validação. Essa configuração é externa ao Git.

Forks evoluem separadamente. Traga atualizações do repositório de origem por merge
ou PR e devolva melhorias compartilhadas ao núcleo, mantendo componentes, tokens,
stories e documentação juntos. Clones do mesmo repositório recebem atualizações
por `git pull`. Não publique builds nem configure outro destino implicitamente;
siga `VERCEL.md`.

O projeto contém telas e estilos anteriores à adoção destas regras. Este ajuste
define o padrão de evolução; a migração completa do legado deve ser planejada
em alterações próprias e revisadas visualmente.

## Convenções

`Dialog` aceita `size="wide"` para revisão de conteúdo extenso e `scroll="body"`
para manter título e ações visíveis enquanto apenas o corpo rola. Preserve o
comportamento de foco, Escape e retorno ao acionador fornecido pelo componente.
As stories `WideScrollableDialog` e `WideScrollableDialogDark` demonstram o uso.

- Use tokens semânticos (`--ds-*`) em vez de cores ou espaçamentos locais.
- Badges são sempre totalmente arredondados com `--ds-radius-full`.
- Campos devem cobrir os estados default, hover, focus, filled, disabled e invalid.
- Toda variante visual deve ser representada por uma prop explícita.
- Todo componente novo precisa de story para estados padrão, interação, disabled/error quando aplicável e tema escuro.
- Componentes específicos de calendário, estudantes ou recursos devem ficar fora do núcleo e compor estes primitivos.

## Comandos

- `npm run storybook`: abrir a documentação local.
- `npm run build-storybook`: gerar a versão estática.
- `npm run test:design-system`: validar componentes e paleta.
- `npm run build:vercel`: validar o build oficial.
- `node --test tests/design-system-route.test.mjs tests/vercel-deployment.test.mjs`:
  validar rotas depois do build Vercel.
