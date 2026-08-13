#!/usr/bin/env node
/**
 * Blog cover-image generator.
 *
 * Renders a 1600x900 PNG in the blog's house style:
 *   dark canvas, faint syntax-highlighted code behind, a heavy condensed
 *   uppercase title (Anton) with a cyan/magenta chromatic-aberration glitch,
 *   the Angular gradient shield, and the author handle.
 *
 * Usage:
 *   node generate.js path/to/config.json
 *
 * Config (JSON):
 *   {
 *     "title":   ["CHAINING RESOURCES", "IN ANGULAR"],  // one entry per line
 *     "emoji":   "",                                     // optional; appended to the last line
 *     "code":    "const x = ...",                        // faint background code (raw TS/HTML)
 *     "handle":  "@enea_jahollari",                      // optional (default shown)
 *     "output":  "src/assets/my-post.png",               // written relative to CWD
 *     "codeOpacity": 0.15,                               // optional (default 0.15)
 *     "titleSize":   118                                 // optional px (default 118)
 *   }
 *
 * Requires Google Chrome (headless) installed locally. Override the binary with
 * the CHROME_BIN env var if it lives somewhere non-standard.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const SKILL_DIR = __dirname;
const FONT_PATH = path.join(SKILL_DIR, 'fonts', 'Anton.ttf');

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return c; } catch (_) {}
  }
  throw new Error('Chrome not found. Set CHROME_BIN to your Chrome/Chromium binary.');
}

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Lightweight TS/JS tokenizer -> HTML with subtle syntax colors.
 * Faithful enough for the faint (~15% opacity) background; not a real parser.
 */
function highlight(code) {
  const keywords = new Set([
    'const', 'let', 'var', 'return', 'function', 'import', 'export', 'from',
    'new', 'throw', 'switch', 'case', 'if', 'else', 'for', 'of', 'in', 'async',
    'await', 'class', 'extends', 'implements', 'interface', 'type', 'public',
    'private', 'protected', 'readonly', 'default', 'as',
  ]);
  // strings (template/double/single), line comments, identifiers, whitespace, anything else
  const re = /(`(?:[^`\\]|\\.)*`)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(\/\/[^\n]*)|([A-Za-z_$][\w$]*)|(\s+)|([^])/g;
  let out = '';
  let m;
  while ((m = re.exec(code)) !== null) {
    const [full, tmpl, dq, sq, comment, ident, ws] = m;
    if (tmpl || dq || sq) {
      out += `<span class="str">${escapeHtml(full)}</span>`;
    } else if (comment) {
      out += `<span class="com">${escapeHtml(full)}</span>`;
    } else if (ident) {
      if (keywords.has(ident)) {
        out += `<span class="kw">${escapeHtml(full)}</span>`;
      } else if (code[re.lastIndex] === '(') {
        out += `<span class="fn">${escapeHtml(full)}</span>`;
      } else {
        out += escapeHtml(full);
      }
    } else {
      out += escapeHtml(full);
    }
  }
  return out;
}

function buildHtml(cfg) {
  const fontB64 = fs.readFileSync(FONT_PATH).toString('base64');
  const titleSize = cfg.titleSize || 118;

  // Theme palette — 'dark' (default) or 'light'.
  const theme = cfg.theme === 'light' ? 'light' : 'dark';
  const pal =
    theme === 'light'
      ? {
          bg: '#f3f1ea',
          code: '#26241f',
          kw: '#b0003e', fn: '#0e7490', str: '#047857', com: '#8a857c',
          title: '#18181b',
          titleShadow:
            '-3px 0 0 rgba(6,182,212,0.55), 3px 0 0 rgba(225,29,72,0.60), 0 3px 14px rgba(0,0,0,0.14)',
          vignette:
            'radial-gradient(120% 90% at 50% 42%, rgba(243,241,234,0) 30%, rgba(243,241,234,0.55) 78%, rgba(243,241,234,0.9) 100%)',
          handle: '#18181b',
          codeOpacity: 0.13,
        }
      : {
          bg: '#0d0d0f',
          code: '#8b93a7',
          kw: '#c586c0', fn: '#4ec9b0', str: '#ce9178', com: '#6a9955',
          title: '#ffffff',
          titleShadow:
            '-4px 0 0 rgba(0,224,255,0.92), 4px 0 0 rgba(255,26,74,0.92), 0 6px 26px rgba(0,0,0,0.6)',
          vignette:
            'radial-gradient(120% 90% at 50% 42%, rgba(13,13,15,0) 30%, rgba(13,13,15,0.55) 78%, rgba(13,13,15,0.85) 100%)',
          handle: '#ffffff',
          codeOpacity: 0.15,
        };

  const codeOpacity = cfg.codeOpacity != null ? cfg.codeOpacity : pal.codeOpacity;
  const handle = cfg.handle || '@enea_jahollari';
  const lines = (cfg.title || []).map((l) => escapeHtml(l));
  const emoji = cfg.emoji ? ` <span class="emoji">${cfg.emoji}</span>` : '';
  const titleHtml = lines
    .map((l, i) => (i === lines.length - 1 ? l + emoji : l))
    .join('<br>');

  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family:'Anton'; src:url(data:font/ttf;base64,${fontB64}) format('truetype'); }
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:1600px; height:900px; }
.card { position:relative; width:1600px; height:900px; overflow:hidden; background:${pal.bg}; }
.code {
  position:absolute; top:46px; left:70px; right:0;
  font-family:'SF Mono', Menlo, Consolas, monospace;
  font-size:40px; line-height:1.6; white-space:pre;
  color:${pal.code}; opacity:${codeOpacity}; filter:blur(0.4px);
}
.code .kw { color:${pal.kw}; }
.code .fn { color:${pal.fn}; }
.code .str { color:${pal.str}; }
.code .com { color:${pal.com}; }
.vignette { position:absolute; inset:0; background:${pal.vignette}; }
.title {
  position:absolute; top:232px; left:0; right:0; text-align:center;
  font-family:'Anton','Impact',sans-serif; font-weight:400;
  font-size:${titleSize}px; line-height:1.02; letter-spacing:1.5px;
  text-transform:uppercase; color:${pal.title};
  text-shadow:${pal.titleShadow};
}
.title .emoji { text-shadow:none; font-family:'Apple Color Emoji',sans-serif; font-size:${Math.round(titleSize * 0.8)}px; vertical-align:-8px; }
.logo { position:absolute; left:50%; top:612px; transform:translateX(-50%); width:118px; height:auto;
  filter:drop-shadow(0 8px 22px rgba(229,25,91,0.35)); }
.handle { position:absolute; left:0; right:0; top:792px; text-align:center;
  font-family:-apple-system,'Segoe UI',sans-serif; font-weight:700; font-size:34px; color:${pal.handle}; letter-spacing:0.3px; }
</style></head><body><div class="card">
  <div class="code">${highlight(cfg.code || '')}</div>
  <div class="vignette"></div>
  <div class="title">${titleHtml}</div>
  <svg class="logo" viewBox="0 0 223 236" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="ang" x1="30" y1="20" x2="170" y2="235" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#9C1FB0"/><stop offset="0.45" stop-color="#D81B76"/>
      <stop offset="0.75" stop-color="#F0175E"/><stop offset="1" stop-color="#FB2E63"/>
    </linearGradient></defs>
    <path fill="url(#ang)" fill-rule="evenodd" clip-rule="evenodd" d="m222.077 39.192-8.019 138.512L137.259.234l84.818 38.958Zm-53.526 162.884-56.647 32.507-56.647-32.507 11.42-27.66h90.454l11.42 27.66ZM111.904 62.109l29.727 72.033H82.187l29.717-72.033ZM7.322 177.704-.696 39.192 84.114.234 7.322 177.704Z"/>
  </svg>
  <div class="handle">${escapeHtml(handle)}</div>
</div></body></html>`;
}

function main() {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error('Usage: node generate.js path/to/config.json');
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!cfg.output) throw new Error('config.output is required');

  const html = buildHtml(cfg);
  const tmpHtml = path.join(os.tmpdir(), `cover-${process.pid}.html`);
  fs.writeFileSync(tmpHtml, html);

  const outPath = path.resolve(process.cwd(), cfg.output);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const chrome = findChrome();
  execFileSync(chrome, [
    '--headless', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--window-size=1600,900',
    '--default-background-color=00000000',
    `--screenshot=${outPath}`, `file://${tmpHtml}`,
  ], { stdio: 'ignore' });

  fs.unlinkSync(tmpHtml);
  console.log(`Wrote ${cfg.output} (1600x900)`);
}

main();
