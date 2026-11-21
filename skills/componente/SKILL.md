---
name: componente
description: Encontra o componente do Aspectie Design System antes de escrever qualquer peca de interface - botao, campo, select, menu, tabela, dialogo, gaveta, aviso, abas - e traz o CSS e o JS oficiais com tudo que ele precisa, inclusive o port React, Angular ou React Native. Use SEMPRE antes de criar ou alterar um controle de interface.
---

# Usar um componente do ADS

O ADS entrega CSS e JS prontos. **Nao reescreva um componente a partir da descricao**:
peca recriada "parecida" nao acompanha tema, teclado nem troca de familia de icones.

## A ordem

1. **Existe?** `list_components()` e `search_patterns({ query })`. Procure pelo que a
   peca faz, nao so pelo nome que voce daria a ela.
2. **Como se comporta?** `get_component_spec({ name })`: anatomia, variantes, estados,
   o que e obrigatorio no markup.
3. **O codigo.** `get_component_code({ name })` devolve o componente **e o fecho do que
   ele precisa** para funcionar (a tabela ja vem com a paginacao; o tooltip, com o motor
   de posicionamento). O cabecalho da resposta lista cada arquivo e por que veio. Grave
   todos, nao so o primeiro.
   - Nao e vanilla? `framework: "react" | "angular" | "react-native"` devolve o port em
     TypeScript, derivado dos mesmos tokens.
4. **Icones.** `search_icons({ query })` quando nao souber o id, `get_icons({ names })`
   para trazer os simbolos. O icone segue a **acao** (salvar, excluir, editar), nao o
   desenho. Controle so com icone leva rotulo acessivel e dica.
5. **Teclado.** `get_keyboard({ name })` antes de ligar o comportamento.
6. **Conferir.** `check_markup({ code })` no que voce escreveu.

## Quando o componente nao existe

Diga ao usuario, com o que voce procurou e o que chegou mais perto. Ofereca as duas
saidas honestas: compor com pecas que existem, ou registrar a lacuna. Nunca entregue um
controle nativo estilizado como se fosse do sistema.

## Ao adaptar

- Valor novo sai de token: `get_tokens({ category })` responde "qual token uso aqui".
- Cor que nao sai de token passa por `check_contrast()` antes de entrar.
- Variante que o spec nao lista nao existe. Nao invente modificador de classe.
