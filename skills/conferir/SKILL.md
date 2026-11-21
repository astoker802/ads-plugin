---
name: conferir
description: Confere uma entrega contra o Aspectie Design System antes do PR - cor e medida cravadas, classe que nao existe, tema, movimento, teclado, texto e o checklist de fidelidade. Use quando pedirem para revisar, auditar ou validar uma tela ou componente ("isso segue o ADS?", "valida antes do PR").
---

# Conferir uma entrega

Confere, relata e **nao corrige sem confirmacao**. O resultado e uma lista com
arquivo, linha, regra e o que fazer.

## A ordem

1. **O verificador local**, que le o texto dos arquivos:
   `node scripts/ads-check.mjs <arquivos>` a partir da raiz do plugin (no Claude Code,
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/ads-check.mjs" <arquivos>`). Ele acusa cor
   literal, px onde ha escala, travessao, movimento no hover, modo escuro dentro de
   componente e dependencia visual externa.
2. **`check_markup({ code })`** em cada arquivo de interface. Ele roda as regras do ADS
   mais o indice de classes que existem de fato: classe `ads-*` inventada aparece aqui.
3. **`get_checklist()`** - os criterios de fidelidade. Passe um por um, com evidencia.
4. **`get_keyboard({ name })`** para cada componente interativo: a tela inteira se usa
   sem ponteiro, o foco e visivel e volta para quem abriu o overlay.
5. **`check_copy({ text })`** em cada rotulo.
6. **No navegador**: claro e escuro, mesa e celular. O que e imagem, quadro embutido ou
   so nasce de clique nao aparece em leitura de texto.

## Como relatar

Para cada desvio, classifique:

- **Divergencia**: o ADS cobre o caso e a entrega fez diferente. Corrige-se.
- **Decisao**: fez diferente de proposito. Registra-se o motivo na linha.
- **Lacuna**: o ADS nao cobre o caso. Vira proposta, nao remendo.

Diga sempre o que **nao** foi conferido. Cobertura parcial apresentada como aprovacao e
pior que nenhuma conferencia.

## Excecao declarada

Uma linha pode declarar a excecao com um comentario: `allow-hex` (cor que precisa ser
literal), `a11y-const` (medida fixa por acessibilidade) ou `ilustracao` (desenho, nao
interface). Excecao sem motivo escrito ao lado volta como divergencia.
