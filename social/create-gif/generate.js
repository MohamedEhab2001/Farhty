// @ts-check
'use strict';

const { chromium } = require('playwright');
const sharp = require('sharp');
const GIFEncoder = require('gif-encoder-2');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

const TEMPLATES = [
  { name: 'asala',   dist: path.join(ROOT, 'apps/templates/template-asala/dist'),   port: 5100 },
  { name: 'bahr',    dist: path.join(ROOT, 'apps/templates/template-bahr/dist'),    port: 5101 },
  { name: 'fardous', dist: path.join(ROOT, 'apps/templates/template-fardous/dist'), port: 5102 },
];

// Layout constants
const FRAME_COUNT  = 28;
const FRAME_DELAY  = 100; // ms per frame
const PHONE_W      = 200;
const PHONE_H      = 433; // 390:844 ≈ 200:433
const BORDER       = 14;
const FRAMED_W     = PHONE_W + BORDER * 2;   // 228
const FRAMED_H     = PHONE_H + BORDER * 2;   // 461
const GIF_W        = 800;
const GIF_H        = 520;
const BG_R = 10, BG_G = 10, BG_B = 20;       // dark navy

const GAP   = Math.floor((GIF_W - 3 * FRAMED_W) / 4);  // ~29
const POS_Y = Math.floor((GIF_H - FRAMED_H) / 2);       // ~29
const POS_X = [
  GAP,
  GAP * 2 + FRAMED_W,
  GAP * 3 + FRAMED_W * 2,
];

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.mp4':  'video/mp4',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
};

// ── Static file server ────────────────────────────────────────────────────────

function startServer(distDir, port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = req.url.split('?')[0];
      let filePath = path.join(distDir, urlPath);
      try {
        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          filePath = path.join(distDir, 'index.html');
        }
      } catch {
        filePath = path.join(distDir, 'index.html');
      }
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', MIME_MAP[ext] || 'application/octet-stream');
      res.setHeader('Access-Control-Allow-Origin', '*');
      const stream = fs.createReadStream(filePath);
      stream.on('error', () => { res.writeHead(404); res.end(); });
      stream.pipe(res);
    });
    server.listen(port, '127.0.0.1', () => {
      console.log(`  ✓ serving ${path.basename(distDir)} → http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

// ── Mock API response from template-record.json ───────────────────────────────

function buildMockResponse(templateName) {
  const recordPath = path.join(ROOT, `apps/templates/template-${templateName}/template-record.json`);
  const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));

  const data = {};
  for (const field of record.fields) {
    data[field.key] = field.defaultValue;
  }
  // Ensure a future wedding date for countdown timers
  if ('wedding_date' in data && !data.wedding_date) {
    data.wedding_date = '2026-12-25';
  }

  return {
    instanceId:  `preview-${templateName}`,
    templateId:  `template-${templateName}`,
    slug:        `preview-${templateName}`,
    isPreview:   true,
    features:    record.features || {},
    fields:      record.fields,
    data,
  };
}

// ── Playwright scroll capture ─────────────────────────────────────────────────

let browser;

async function captureFrames(port, templateName) {
  const mock = buildMockResponse(templateName);
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Log page console and errors for debugging
  page.on('console', msg => { if (msg.type() === 'error') console.log(`  [${templateName}] console.${msg.type()}: ${msg.text()}`); });
  page.on('pageerror', err => console.log(`  [${templateName}] PAGE ERROR: ${err.message}`));
  page.on('requestfailed', req => console.log(`  [${templateName}] FAILED: ${req.url()}`));

  // Intercept API calls – return mock data
  await page.route('**/api/instances/by-domain**', route => {
    console.log(`  [${templateName}] intercepted: ${route.request().url()}`);
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(mock) });
  });
  await page.route('**/api/**', route =>
    route.request().url().includes('by-domain')
      ? route.continue()
      : route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  );

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`  [${templateName}] page loaded`);

  // Wait for loading screen (SDK enforces min 800ms) + initial animations
  await page.waitForTimeout(3000);

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log(`  [${templateName}] after 3s: height=${pageHeight}, bodyBg=${bodyBg}`);

  // Template-specific intro dismissal
  if (templateName === 'bahr') {
    // Click the intro button, then wait for 5.2s gate video
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="افتح الدعوة"]') ||
                  document.querySelector('main button') ||
                  document.querySelector('button');
      console.log('bahr: found button:', btn ? btn.ariaLabel || btn.textContent.trim().slice(0, 30) : 'none');
      if (btn) btn.click();
    });
    await page.waitForTimeout(6500); // video takes 5.2s
  } else if (templateName === 'fardous') {
    // Click the cover screen open button
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        console.log('fardous btn:', b.textContent.trim().slice(0, 40));
        b.click();
      });
    });
    await page.waitForTimeout(2500); // wait for AnimatePresence transition
    // Remove overflow-hidden so full-page capture works
    await page.evaluate(() => {
      const el = document.getElementById('root')?.firstElementChild;
      if (el) { el.style.overflow = 'visible'; el.style.overflowX = 'hidden'; }
    });
    await page.waitForTimeout(300);
  } else {
    // asala: click to dismiss curtain intro
    try { await page.click('body', { timeout: 500 }); } catch {}
    await page.waitForTimeout(2000);
  }

  // Debug: save what the page looks like right now
  const debugBuf = await page.screenshot({ type: 'png' });
  require('fs').writeFileSync(path.join(ROOT, `social/${templateName}-debug.png`), debugBuf);

  // Capture full page then crop into scroll frames
  const fullPageBuf = await page.screenshot({ type: 'png', fullPage: true });
  const meta        = await sharp(fullPageBuf).metadata();
  const totalH      = meta.height;
  const maxScroll   = Math.max(0, totalH - 844);
  console.log(`  ${templateName}: full-page height = ${totalH}px, scrollable = ${maxScroll}px`);

  const frames = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    const t       = i / (FRAME_COUNT - 1);
    const eased   = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const topPx   = Math.round(maxScroll * eased);

    const frame = await sharp(fullPageBuf)
      .extract({ left: 0, top: topPx, width: 390, height: Math.min(844, totalH - topPx) })
      .resize(390, 844, { fit: 'contain', background: '#ffffff' })
      .png()
      .toBuffer();
    frames.push(frame);
  }

  await context.close();
  return frames;
}

// ── Image compositing ─────────────────────────────────────────────────────────

const CORNER_R       = 20;
const FRAME_CORNER_R = CORNER_R + Math.round(BORDER * 0.8);

async function makePhoneFrame(screenshotBuf) {
  // Rounded-corner mask for the screenshot
  const innerMask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${PHONE_W}" height="${PHONE_H}" rx="${CORNER_R}" ry="${CORNER_R}"/></svg>`
  );
  const rounded = await sharp(screenshotBuf)
    .resize(PHONE_W, PHONE_H, { fit: 'cover' })
    .ensureAlpha()
    .composite([{ input: innerMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Rounded mask for the outer dark frame
  const outerMask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${FRAMED_W}" height="${FRAMED_H}" rx="${FRAME_CORNER_R}" ry="${FRAME_CORNER_R}"/></svg>`
  );

  return sharp({
    create: {
      width:      FRAMED_W,
      height:     FRAMED_H,
      channels:   4,
      background: { r: 28, g: 28, b: 40, alpha: 1 },
    },
  })
    .composite([
      { input: rounded,   top: BORDER, left: BORDER },
      { input: outerMask, blend: 'dest-in' },
    ])
    .png()
    .toBuffer();
}

async function buildGifFrame(frameIdx, allFrames) {
  const phones = await Promise.all(
    allFrames.map(frames => makePhoneFrame(frames[frameIdx]))
  );

  const { data } = await sharp({
    create: { width: GIF_W, height: GIF_H, channels: 4, background: { r: BG_R, g: BG_G, b: BG_B, alpha: 1 } },
  })
    .composite(phones.map((buf, i) => ({ input: buf, top: POS_Y, left: POS_X[i] })))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return data; // RGBA buffer
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🎬 Farhty GIF Generator\n');

  console.log('Starting static servers...');
  const servers = await Promise.all(TEMPLATES.map(t => startServer(t.dist, t.port)));

  console.log('\nLaunching browser...');
  browser = await chromium.launch({
    headless: true,
    executablePath: chromium.executablePath(),
  });

  try {
    const allFrames = [];
    for (const t of TEMPLATES) {
      console.log(`\nCapturing ${t.name}...`);
      allFrames.push(await captureFrames(t.port, t.name));
    }

    console.log('\nEncoding GIF...');
    const outPath = path.join(ROOT, 'social/preview.gif');
    const encoder = new GIFEncoder(GIF_W, GIF_H);
    const writeStream = fs.createWriteStream(outPath);
    encoder.createReadStream().pipe(writeStream);

    encoder.setDelay(FRAME_DELAY);
    encoder.setRepeat(0);
    encoder.setQuality(10);
    encoder.start();

    for (let i = 0; i < FRAME_COUNT; i++) {
      process.stdout.write(`\r  frame ${i + 1}/${FRAME_COUNT}`);
      const pixels = await buildGifFrame(i, allFrames);
      encoder.addFrame(pixels);
    }

    encoder.finish();
    await new Promise(resolve => writeStream.on('finish', resolve));

    console.log(`\n\n✅ Done! Saved to: ${outPath}`);
    const size = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2);
    console.log(`   File size: ${size} MB`);

  } finally {
    await browser.close();
    servers.forEach(s => s.close());
  }
}

main().catch(err => { console.error(err); process.exit(1); });
