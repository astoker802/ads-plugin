# Aspectie Design System (ADS)

Este projeto consome o ADS. As regras abaixo valem para qualquer agente que escreva
interface aqui. A fonte da verdade e o servidor MCP `ads`
(`https://aspectie-ads-mcp.netlify.app/api/mcp`, somente leitura, sem chave).

## Regra zero

Antes de escrever markup, CSS ou JS de qualquer peca de interface, pergunte se ela ja
existe: `list_components()` e `search_patterns({ query })`. Se nao existir, **diga** em
vez de improvisar uma versao parecida.

## O que nao se faz

- Cor literal (hex, rgb, hsl) em componente. Cor sai de `var(--ads-*)`.
- Px cravado onde ha escala: espaco, quina e tamanho de fonte saem de token.
- Modo escuro dentro do componente. Tema e `data-theme` no `<html>`.
- `transform` ou sombra no hover. Duracao e curva de movimento saem de token.
- Bootstrap, Google Fonts ou fonte por CDN. As tres familias sao auto-hospedadas.
- Icone desenhado a mao ou id inventado. Use `search_icons({ query })`.
- Reescrever componente a partir da descricao. Use `get_component_code({ name })`.
- Travessao em texto de interface. So hifen ASCII.

## Antes de abrir o PR

1. `check_markup({ code })` em cada arquivo de interface alterado.
2. `check_copy({ text })` em cada rotulo novo.
3. `get_keyboard({ name })` para todo componente interativo novo: a tela inteira se usa
   sem ponteiro.
4. Abrir no navegador em claro e escuro, mesa e celular.
