# Aspectie Design System - plugin para agentes

O ADS dentro do seu agente de codigo: o servidor MCP ja ligado, seis skills com a ordem
de trabalho, dois agentes de conferencia e um verificador que acusa desvio a cada
arquivo escrito.

Um pacote, tres manifestos. O conteudo (`skills/` e o servidor MCP) e o mesmo em todos
os agentes; o que muda e quem le qual manifesto.

## Instalar

### Claude Code (terminal, VS Code, app de mesa)

```bash
claude plugin marketplace add astoker802/ads-plugin
claude plugin install ads@aspectie
```

Dentro de uma sessao: `/plugin marketplace add astoker802/ads-plugin` e depois
`/plugin install ads@aspectie`. A instalacao pergunta quatro preferencias, todas
opcionais: pasta de arquivos estaticos, cor de acao, familia de icones e idioma.

### Codex e ChatGPT

```bash
codex plugin marketplace add astoker802/ads-plugin
```

Depois, `/plugins` e instale `ads`.

### Cursor e VS Code com Copilot

Os dois leem o `plugin.json` da raiz (Agent Plugins 1.0). Adicione este repositorio como
marketplace no painel **Customize** e instale `ads`. No VS Code, a lista de marketplaces
fica em `chat.plugins.marketplaces`.

### Gemini CLI

```bash
gemini extensions install https://github.com/astoker802/ads-plugin
```

### Qualquer outro agente com MCP

Sem pacote: ligue o servidor e copie `skills/init/references/AGENTS.ads.md` para a raiz
do projeto como `AGENTS.md`.

```json
{ "mcpServers": { "ads": { "type": "http", "url": "https://aspectie-ads-mcp.netlify.app/api/mcp" } } }
```

## O que vem

| Peca | Onde | Quem le |
| - | - | - |
| Servidor MCP `ads` (somente leitura, sem chave) | `mcp.json`, `.mcp.json`, `gemini-extension.json` | todos |
| Skills `init`, `componente`, `tela`, `tema`, `texto`, `conferir` | `skills/` | Claude Code, Codex, Cursor, Copilot |
| Contexto de regras | `GEMINI.md` | Gemini CLI |
| Agentes `ads-fidelidade` e `ads-revisor-de-texto` | `agents/` | Claude Code |
| Verificador a cada arquivo escrito | `hooks/` + `scripts/ads-check.mjs` | Claude Code |

Depois de instalar, rode a skill `init` (no Claude Code, `/ads:init`): ela grava
`tokens.css`, as fontes, o sprite de icones e um `AGENTS.md` no projeto.

## O que o plugin faz na sua maquina

- **Liga um servidor MCP remoto**, `https://aspectie-ads-mcp.netlify.app/api/mcp`. E
  somente leitura e nao pede chave. O agente envia a ele o que consulta (nome de
  componente, trecho de markup para conferir, texto de rotulo).
- **Roda um script local a cada arquivo escrito** (so no Claude Code):
  `scripts/ads-check.mjs`. Ele so le o arquivo que o agente acabou de escrever, nao
  escreve nada, nao executa nada e nao abre rede. Na saida vao caminho, linha e regra,
  nunca o conteudo do arquivo. Sao menos de 200 linhas, sem dependencia: leia antes de
  instalar.
- **Nao instala binario, nao le variavel de ambiente, nao pede credencial.**

Para desligar so o verificador, desative o plugin e ligue o servidor MCP a mao.

## Licenca

MIT. Veja `LICENSE`.
