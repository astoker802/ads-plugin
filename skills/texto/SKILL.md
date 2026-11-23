---
name: texto
description: Escreve e revisa o texto visivel da interface com o vocabulario do Aspectie Design System - rotulo de botao, titulo, rotulo de campo, dica, mensagem de erro, aviso, estado vazio e aria-label. Use SEMPRE que criar ou alterar qualquer texto que o usuario le.
---

# Texto de interface

Metade do design system e texto. "OK" onde o ADS diz "Confirmar" passa por toda revisao
visual e ainda esta errado.

## A ordem

1. `get_voice()` **antes** de escrever: publico, tom, vocabulario e forma.
2. Escreva. Idioma da interface configurado na instalacao: `${user_config.language}`
   (padrao `pt`, portugues).
3. `check_copy({ text })` **depois**, em cada rotulo novo. Ele devolve o termo fora do
   vocabulario e o que usar no lugar.

## As regras que mais pegam

- **Uma intencao, um rotulo.** Se a acao ja tem nome em outra tela, e o mesmo nome aqui.
- **Botao diz o que faz**: verbo no infinitivo e objeto quando houver duvida ("Salvar
  alteracoes", nao "OK").
- **Erro diz o que houve e o que fazer**, sem culpar e sem codigo tecnico sozinho.
- **Estado vazio diz o proximo passo**, nao so que nao ha nada.
- **So hifen ASCII**, nunca travessao. Nenhuma caixa alta decorativa.
- **Rotulo acessivel** em todo controle so com icone, igual ao que a dica mostra.

## O que nao e desta skill

Julgar se a tela esta certa e da skill `tela`; conferir markup e da skill `conferir`.
Aqui o assunto e so o que esta escrito.
