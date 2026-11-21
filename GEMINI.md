# Aspectie Design System (ADS)

Este projeto consome o ADS. O servidor `ads` esta ligado por MCP e e somente leitura.
Tudo que esta abaixo se confirma por ferramenta, nunca por memoria.

## Regra zero: consultar antes de construir

Antes de escrever markup, CSS ou JS de qualquer peca de interface, pergunte se ela ja
existe: `list_components()` e `search_patterns({ query })`. Vale para botao, campo,
dropdown, select, menu, tabela, dialogo, gaveta, aviso, tudo.

Trocar o componente do ADS por um controle nativo parecido custa o tema, a navegacao por
teclado e o comportamento no celular. **Se a peca nao existir, diga ao usuario** em vez de
improvisar uma versao aproximada: peca aproximada quebra a troca de tema, que e o motivo
de o sistema existir. A regra inteira em `get_rules({ topic: "16" })`.

## A ordem que funciona

1. `get_rules()` - o indice das regras de consumo. Comece por 07 (raiz HTML) e 06 (temas).
2. `get_boot_kit()` - o que a pagina precisa antes de qualquer componente: as tres fontes
   auto-hospedadas, o sprite de icones e os carregadores prontos. Sem isso o texto cai na
   fonte do sistema e os icones nao aparecem.
3. `get_tokens({ format: "css" })` - o `tokens.css` inteiro, para salvar no projeto. Ele
   entra antes de qualquer outro CSS.
4. `search_patterns({ query })` - antes de montar uma tela, veja se o molde existe
   (listagem, formulario, detalhe, crud, login).
5. `list_components()` e `get_component_spec({ name })` - o que existe e como se comporta.
6. `get_component_code({ name })` - o CSS e o JS oficiais do componente **e de tudo que
   ele precisa para funcionar**. Com `framework: "react" | "angular" | "react-native"`,
   vem o port em TypeScript.
7. `get_icons({ names })` e `search_icons({ query })` - os simbolos do sprite. Nunca
   desenhe um icone proprio nem invente id.
8. `get_voice()` antes de escrever qualquer rotulo, `check_copy({ text })` depois. Texto
   tambem e design system: "OK" onde o ADS diz "Confirmar" reprova na revisao.
9. `get_keyboard({ name })` antes de montar navegacao.
10. `check_markup({ code })` no fim: ele passa o que voce escreveu pelas regras do ADS e
    devolve o que esta fora.

## Cinco regras que nao se negociam

1. **Cor sai de token.** Nada de hex, rgb ou hsl direto no componente. Hierarquia:
   componente (`--_*`) acima de semantico (`--ads-*`) acima de primitivo.
2. **Tema e atributo no `<html>`** (`data-theme="light|dark"`). Nunca modo escuro dentro
   do componente, nunca `prefers-color-scheme` em CSS de componente.
3. **Medida sai da escala.** Espaco, quina e tamanho de fonte vem de `--ads-spacing-*`,
   `--ads-radius-*`, `--ads-font-size-*`. Px cravado onde ha escala quebra o tema.
4. **Movimento sai de token**, e nunca no hover: sem `transform` nem sombra ao aproximar o
   ponteiro. O movimento e da mudanca de estado.
5. **Sem dependencia visual externa**: nada de Bootstrap nem Google Fonts. As tres
   familias (Bricolage Grotesque, Instrument Sans, Geist Mono) sao auto-hospedadas e
   chegam pelo `get_boot_kit()`.

## Texto

So hifen ASCII (`-`), nunca travessao. Nenhuma caixa alta decorativa. O vocabulario de
interface vem de `get_voice()`: uma intencao, um rotulo.
