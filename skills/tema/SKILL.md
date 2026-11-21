---
name: tema
description: Aplica, gera ou ajusta um tema do Aspectie Design System - cor de acao do produto, modo claro e escuro, quina, familia de fontes e de icones - sempre com o contraste medido. Use quando pedirem "a cara do produto", cor da marca, modo escuro, tema novo ou conferencia de contraste.
---

# Tema no ADS

Tema e uma **semente** de poucos campos que o motor expande em todos os tokens, com o
contraste medido. Voce nao pinta token por token.

## A ordem

1. `get_rules({ topic: "06" })` - tema e atributo no `<html>` (`data-theme`), nunca
   dentro do componente e nunca por `prefers-color-scheme` em CSS de componente.
2. `get_theme({ ... })` com a semente do produto. O servidor **roda o motor** e devolve
   os tokens ja aprovados no contraste AA. Preferencias configuradas na instalacao do
   plugin: cor `${user_config.accent_hex}`, icones `${user_config.icon_family}`.
   - Pediram "um tema qualquer"? `get_theme({ random: true, count: 3 })` sorteia entre os
     curados e mostra opcoes para escolher.
3. Grave o resultado como camada **depois** de `tokens.css`. Nunca edite `tokens.css`:
   ele e o que o servidor entrega e sera substituido na proxima atualizacao.
4. Cor que nao sai de token: `check_contrast()` no par antes de usar. Texto pede 4.5:1,
   texto grande e elemento grafico pedem 3:1.

## O que o tema nao pode quebrar

- Componente novo le token dinamico. Hex ou px cravado nao acompanha a troca de tema.
- Lima (ou a cor de acao do produto) e so para acao e selecao, nunca para decorar.
- Sombra so em overlay, e por token. Cartao nao tem sombra: separa por fio.
- A tela tem que funcionar no tema mais largo, nao so no padrao. Rodape que quebra em
  duas linhas num tema e defeito, nao detalhe.

## Conferir

Abra a tela no tema novo em claro e escuro. Se uma peca nao mudou, ela esta fora do
tema: procure o valor cravado nela com `check_markup({ code })`.
