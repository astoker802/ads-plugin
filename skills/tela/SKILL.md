---
name: tela
description: Monta uma tela inteira com os moldes do Aspectie Design System - listagem, formulario, detalhe, CRUD, login, painel - escolhendo o overlay certo, a ordem dos botoes e a navegacao por teclado. Use ao criar uma pagina ou fluxo novo, ou ao decidir entre dialogo, gaveta e pagina.
---

# Montar uma tela com o ADS

Tela nao e pilha de componentes. A ordem dos botoes, o overlay escolhido e o caminho do
foco sao regra do sistema, e a maior parte das telas ja tem molde.

## A ordem

1. **O molde existe?** `search_patterns({ query })` com o tipo de tela (crud, listagem,
   formulario, detalhe, login). `get_screen()` traz tela ja construida para partir dela.
2. **A regra de composicao.** `get_rules({ topic: "12" })`: qual overlay usar para cada
   caso, a ordem fixa de botao no rodape, teclado e foco. Leia antes de decidir entre
   dialogo, gaveta e pagina.
3. **As pecas.** Para cada regiao, siga a skill `componente`: nenhuma peca entra sem
   passar por `get_component_code({ name })`.
4. **Estrutura e respiro.** `get_rules({ topic: "03" })` e `get_tokens({ category })`
   para espaco e largura. Nada de medida cravada.
5. **Celular.** `get_rules({ topic: "10" })`. Nada fica fora da tela: tabela vira
   cartao, menu nunca abre para fora da janela.
6. **Texto.** Skill `texto` em todo rotulo, titulo, erro e estado vazio.
7. **Conferir.** `check_markup({ code })` e `get_checklist()`.

## O que mais reprova

- Dois botoes principais na mesma regiao. Uma tela, uma acao principal.
- Dialogo para tarefa longa (vira gaveta ou pagina) e gaveta para confirmar (vira dialogo).
- Estado vazio, de carga e de erro esquecidos. Toda lista tem os tres.
- Foco que some ao abrir ou fechar overlay. Ele entra no overlay e volta para quem abriu.
- Dica de ferramenta no celular. La nao ha ponteiro.

## Validacao

Abra no navegador: claro e escuro, mesa e celular, e a tela inteira so com o teclado.
Relate o que conferiu e o que nao conferiu.
