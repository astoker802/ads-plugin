---
name: init
description: Instala o Aspectie Design System (ADS) neste projeto - grava tokens.css, as tres fontes auto-hospedadas, o sprite de icones, a raiz HTML e um AGENTS.md com as regras de consumo. Use na primeira vez que o projeto consome o ADS, ou quando faltar tokens.css, fonte ou sprite.
---

# Instalar o ADS no projeto

O plugin configura o agente. Esta skill instala o sistema **no projeto**: os arquivos que
a pagina precisa antes de qualquer componente. Tudo sai do servidor `ads` por MCP. Nada
aqui se escreve de memoria.

## Antes de gravar

1. Descubra a pasta de arquivos estaticos. Preferencia configurada na instalacao do
   plugin: `${user_config.static_dir}`. Se vier em branco ou sem substituir, procure a
   convencao do projeto (`public/`, `static/`, `src/assets/`) e **confirme com o usuario**
   antes de gravar. O destino padrao e `<estaticos>/ads/`.
2. Veja se o ADS ja esta la. Se `tokens.css` existir, compare com o do servidor e diga o
   que mudou. Nunca sobrescreva arquivo que o usuario editou sem mostrar a diferenca.
3. Descubra a stack (vanilla, React, Angular, React Native). Ela decide o passo 5.

## Os passos

1. `get_rules({ topic: "07" })` e `get_rules({ topic: "06" })` - raiz HTML e temas. Leia
   antes de escrever o `<head>`.
2. `get_boot_kit()` - devolve onde baixar as tres fontes (Bricolage Grotesque, Instrument
   Sans, Geist Mono) e o sprite, mais os carregadores prontos. Baixe os arquivos para a
   pasta do passo anterior. As licencas das fontes vem junto e ficam ao lado delas.
3. `get_tokens({ format: "css" })` - grave como `tokens.css`. E o primeiro CSS da pagina,
   antes de qualquer outro.
4. `get_file({ path })` para a base da pagina (`components/ads-base.css`): fonte, papel e
   tinta no `body`, e o anel de foco. Entra logo depois de `tokens.css`.
5. Ligue na raiz do app, na ordem: `tokens.css`, `ads-base.css`, o carregador do sprite.
   O `<html>` leva `lang` e `data-theme="light"`; o `<head>` leva `<meta viewport>`.
   Em React, Angular ou React Native, siga o que `get_rules({ topic: "07" })` e
   `get_rules({ topic: "17" })` dizem para a stack.
6. Tema do produto, se houver cor configurada (`${user_config.accent_hex}`) ou familia de
   icones (`${user_config.icon_family}`): `get_theme({ ... })` expande a semente e
   devolve os tokens ja medidos no contraste. Grave como camada **depois** de
   `tokens.css`, nunca editando `tokens.css`.
7. Copie `references/AGENTS.ads.md` desta skill para a raiz do projeto como `AGENTS.md`.
   Se ja existir um `AGENTS.md`, acrescente a secao do ADS ao final em vez de substituir.
   Esse arquivo e o que os outros agentes do time leem.

## Conferir que ficou de pe

- Monte uma pagina minima com um botao: `get_component_code({ name: "button" })`.
- `check_markup({ code })` na pagina. Nada fora da regra.
- Abra no navegador, claro e escuro, mesa e celular. O texto nao pode cair na fonte do
  sistema e o icone tem que aparecer. Validacao visual e no navegador, nunca so no
  terminal.

## Relate ao usuario

Liste cada arquivo gravado com o caminho, o que foi ligado na raiz e o que ficou para
ele decidir. Se algum passo falhou, diga qual e com que erro.
