#!/usr/bin/env node
/* ============================================================
   ads-check - o verificador local do Aspectie Design System.

   Le o TEXTO de um arquivo de interface e acusa o que foge das regras
   de consumo do ADS: cor literal, px onde ha escala, travessao,
   movimento no hover, modo escuro dentro de componente, dependencia
   visual externa.

   Dois modos:
     node ads-check.mjs <arquivo> [<arquivo>...]   confere os arquivos
     node ads-check.mjs --hook                     le o evento do agente
                                                   em stdin (PostToolUse)

   Desenho, e por que:
     - So LE. Nao escreve, nao executa nada, nao abre rede.
     - Nunca repete o conteudo do arquivo na saida: so caminho, linha,
       regra e o que fazer. Um arquivo com segredo nao vaza por aqui.
     - No modo --hook, falha interna e silencio (saida 0): verificador
       quebrado nao pode travar a sessao de quem esta trabalhando.
     - Zero dependencia: roda com o Node que a maquina ja tem.

   Saida: 0 = nada a dizer; 2 = ha achados (o agente os recebe).
   ============================================================ */

import { readFileSync, statSync } from 'node:fs';
import { extname, basename } from 'node:path';

const EXTENSOES = new Set([
  '.css', '.scss', '.less', '.html', '.htm',
  '.js', '.mjs', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro',
]);

/* Arquivos que SAO a fonte dos valores: neles o literal e o esperado. */
const FONTES_DE_VALOR = /(^|[\\/])(tokens|ads-theme|ads-tokens)[^\\/]*\.(css|scss|js|ts|json)$/i;

/* Excecao declarada na propria linha. */
const PRAGMA = /allow-hex|a11y-const|ilustracao|ads-check-ignore/;

const TAMANHO_MAXIMO = 1024 * 1024; // 1 MiB: acima disso nao e arquivo escrito a mao
const LINHA_MAXIMA = 2000;          // linha minificada nao se confere por regex
const ACHADOS_MAXIMOS = 40;

const SO_ESTILO = new Set(['.css', '.scss', '.less', '.html', '.htm', '.vue', '.svelte', '.astro']);

const REGRAS = [
  {
    id: 'cor-literal',
    onde: SO_ESTILO,
    testa: (l) => /:\s*[^;{}]*(#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\()/.test(l) && !/href\s*=|url\(\s*['"]?#/.test(l),
    diz: 'Cor literal. Use var(--ads-*); get_tokens({ category: "cores" }) diz qual. Excecao real leva "allow-hex" e o motivo na linha.',
  },
  {
    id: 'px-onde-ha-escala',
    onde: SO_ESTILO,
    testa: (l) => /\b(padding|margin|gap|row-gap|column-gap|border-radius|font-size)(-[a-z-]+)?\s*:\s*[^;{}]*\b\d+(\.\d+)?px\b/.test(l),
    diz: 'Px cravado onde ha escala. Use --ads-spacing-*, --ads-radius-* ou --ads-font-size-*; valor fixo nao acompanha o tema.',
  },
  {
    id: 'travessao',
    onde: null,
    testa: (l) => /[–—]/.test(l),
    diz: 'Travessao no texto. O ADS usa so hifen ASCII (-).',
  },
  {
    id: 'transicao-engolida',
    onde: SO_ESTILO,
    testa: (l) => /transition\s*:\s*[a-z-]+\s+var\(--ads-transition\)/.test(l),
    diz: 'O token --ads-transition ja traz "all" dentro: com a propriedade na frente, a linha inteira e descartada em silencio. Use os tokens de duracao e de curva.',
  },
  {
    id: 'tema-dentro-do-componente',
    onde: SO_ESTILO,
    testa: (l) => /prefers-color-scheme/.test(l),
    diz: 'Modo escuro dentro do componente. Tema e data-theme no <html>; o componente so le token.',
  },
  {
    id: 'caixa-alta',
    onde: SO_ESTILO,
    testa: (l) => /text-transform\s*:\s*uppercase/.test(l),
    diz: 'Caixa alta decorativa. A identidade do ADS nao usa.',
  },
  {
    id: 'dependencia-externa',
    onde: null,
    testa: (l) => /fonts\.googleapis\.com|fonts\.gstatic\.com|bootstrap(\.min)?\.(css|js)|cdn\.tailwindcss\.com/.test(l),
    diz: 'Dependencia visual externa. As fontes do ADS sao auto-hospedadas (get_boot_kit()); Bootstrap e Tailwind com tema padrao ficam de fora.',
  },
  {
    id: 'controle-nativo',
    onde: new Set(['.html', '.htm', '.jsx', '.tsx', '.vue', '.svelte', '.astro']),
    testa: (l) => /<select\b(?![^>]*\bads-)/.test(l),
    diz: 'Controle nativo onde o ADS tem componente. Confira list_components() antes: o nativo perde tema, teclado e o comportamento no celular.',
  },
];

/* Regra que precisa do bloco inteiro, nao da linha. */
function movimentoNoHover(texto) {
  const achados = [];
  const re = /:hover[^{}]{0,200}\{([^{}]{0,2000})\}/g;
  let m;
  while ((m = re.exec(texto)) !== null) {
    if (/(^|[;\s])(transform|box-shadow)\s*:/.test(m[1]) && !PRAGMA.test(m[1])) {
      achados.push(texto.slice(0, m.index).split('\n').length);
    }
  }
  return achados;
}

function confere(caminho) {
  const ext = extname(caminho).toLowerCase();
  if (!EXTENSOES.has(ext)) return [];
  if (FONTES_DE_VALOR.test(caminho)) return [];

  let info;
  try { info = statSync(caminho); } catch { return []; }
  if (!info.isFile() || info.size > TAMANHO_MAXIMO) return [];

  let texto;
  try { texto = readFileSync(caminho, 'utf8'); } catch { return []; }

  const achados = [];
  const linhas = texto.split('\n');
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    if (linha.length > LINHA_MAXIMA || PRAGMA.test(linha)) continue;
    for (const regra of REGRAS) {
      if (regra.onde && !regra.onde.has(ext)) continue;
      if (regra.testa(linha)) achados.push({ linha: i + 1, id: regra.id, diz: regra.diz });
    }
  }
  if (SO_ESTILO.has(ext)) {
    for (const n of movimentoNoHover(texto)) {
      achados.push({
        linha: n,
        id: 'movimento-no-hover',
        diz: 'transform ou sombra no hover. O movimento e da mudanca de estado, nunca da proximidade do ponteiro.',
      });
    }
  }
  achados.sort((a, b) => a.linha - b.linha);
  return achados;
}

function relata(caminho, achados) {
  /* O nome do arquivo vai para a saida que o agente le. Nome de arquivo e
     dado de terceiro: so letras, digitos, ponto, hifen e sublinhado passam,
     para que um nome nao carregue instrucao nem sequencia de terminal. */
  const nome = basename(caminho).replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 80);
  const mostra = achados.slice(0, ACHADOS_MAXIMOS);
  const linhas = mostra.map((a) => `${nome}:${a.linha}  [${a.id}]  ${a.diz}`);
  if (achados.length > mostra.length) {
    linhas.push(`${nome}: mais ${achados.length - mostra.length} achados nao listados.`);
  }
  return linhas;
}

function lerStdin() {
  try { return readFileSync(0, 'utf8'); } catch { return ''; }
}

function modoHook() {
  let evento;
  try { evento = JSON.parse(lerStdin()); } catch { return 0; }
  const caminho = evento && evento.tool_input && evento.tool_input.file_path;
  if (typeof caminho !== 'string' || caminho.length === 0 || caminho.length > 4096) return 0;

  const achados = confere(caminho);
  if (achados.length === 0) return 0;

  const saida = [
    'ADS: o arquivo que acabou de ser escrito foge das regras de consumo.',
    ...relata(caminho, achados),
    'Corrija na raiz (token no lugar do valor) ou declare a excecao na linha, com o motivo.',
  ];
  process.stderr.write(saida.join('\n') + '\n');
  return 2;
}

function modoArquivos(arquivos) {
  let total = 0;
  for (const caminho of arquivos) {
    const achados = confere(caminho);
    total += achados.length;
    for (const linha of relata(caminho, achados)) process.stdout.write(linha + '\n');
  }
  process.stdout.write(total === 0 ? 'ads-check: nada fora da regra.\n' : `ads-check: ${total} achados.\n`);
  return total === 0 ? 0 : 2;
}

const args = process.argv.slice(2);
if (args.includes('--hook')) {
  let codigo = 0;
  try { codigo = modoHook(); } catch { codigo = 0; }
  process.exit(codigo);
} else if (args.length === 0) {
  process.stdout.write('uso: node ads-check.mjs <arquivo> [<arquivo>...]\n');
  process.exit(0);
} else {
  process.exit(modoArquivos(args.filter((a) => !a.startsWith('--'))));
}
