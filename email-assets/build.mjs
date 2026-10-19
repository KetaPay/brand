// Renders the images the KetaPay Business emails use into cdn/email/, served from
// https://cdn.ketapay.com/email/. Emails can't rely on SVG or web fonts, so every image is a PNG drawn
// at 2x from the HTML below.
//
// Run: PLAYWRIGHT=<path to playwright/index.mjs> node email-assets/build.mjs

import { mkdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ICONS } from './icons.mjs'

const { chromium } = await import(process.env.PLAYWRIGHT ?? 'playwright')

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '../cdn/email')
const dataUri = async (file, type) => `data:${type};base64,${(await readFile(join(here, file))).toString('base64')}`
// The brand's own files (business-dashboard/public/brand, the app's K mark)
const logo = await dataUri('logo-white.svg', 'image/svg+xml')
const mark = await dataUri('mark-white.png', 'image/png')
const teamPhoto = await dataUri('team-photo.jpg', 'image/jpeg')

const BRAND = { deep: '#3b0764', violet: '#7c3aed', tint: '#f3f0ff', ink: '#111827', muted: '#6b7280' }
const FONT = `<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=block" rel="stylesheet">`
const svg = (name, size, color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="${size}" height="${size}" fill="${color}" style="color:${color}">${ICONS[name]}</svg>`

const page = (width, height, body, css = '') => `<!doctype html><html><head>${FONT}<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${width}px; height: ${height}px; background: transparent; font-family: Onest, sans-serif; }
  ${css}
</style></head><body>${body}</body></html>`

// The welcome email's header is live text on a solid purple cell; these sit around it
const logoWhite = page(173, 36, `<img src="${logo}">`, `img { height: 36px; display: block; }`)

const avatar = page(
  72,
  72,
  `<div class="ring"><span>👋</span></div>`,
  `.ring { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #ede9fe, #c4b5fd); box-shadow: inset 0 0 0 3px rgba(255,255,255,.5); }
   span { font-size: 36px; line-height: 1; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; }`,
)

// A thick brand ribbon running off the top and right edges, like a K's stroke
const ribbon = page(
  220,
  320,
  `<svg width="220" height="320" viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a78bfa"/><stop offset=".55" stop-color="${BRAND.violet}"/><stop offset="1" stop-color="#6d28d9"/></linearGradient></defs>
    <path d="M10 92 L150 -10 M150 -10 L60 150 L250 60 M250 150 C150 200 110 250 150 300 C170 330 230 320 260 300"
      fill="none" stroke="url(#g)" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
)

// How a sale flows through KetaPay, drawn like an onboarding map: cards on one line, the gap
// labels saying what moves the money on, the end of the line is the platform's commission
const card = (x, y, w, icon, label) =>
  `<div class="card" style="left:${x}px; top:${y}px; width:${w}px">${svg(icon, 18, BRAND.violet).replace('<svg', '<svg class="ic"')}<span>${label}</span></div>`
const gap = (x, y, text) => `<span class="gap" style="left:${x}px; top:${y}px">${text}</span>`
const joint = (x, y, dir) =>
  `<span class="joint" style="left:${x - 9}px; top:${y - 9}px"><svg viewBox="0 0 10 10" width="8" height="8"><path d="${dir === 'down' ? 'M2 3.5 5 6.5 8 3.5' : 'M3.5 2 6.5 5 3.5 8'}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`

const flow = page(
  600,
  340,
  `<div class="map">
    <svg class="line" width="600" height="340"><path d="M92 54 V250 Q92 292 134 292 H528 Q570 292 570 250 V150" fill="none" stroke="#2A2340" stroke-width="2.5"/></svg>
    <span class="start">Your customer checks out</span>
    ${card(36, 70, 196, 'Storefront', 'Buyer pays')}
    ${gap(58, 134, 'card or transfer')}
    ${card(36, 172, 196, 'ShieldCheck', 'Held in escrow')}
    ${joint(92, 164, 'down')}
    ${gap(62, 236, 'until delivered')}
    ${card(126, 266, 186, 'Handshake', 'Order delivered')}
    ${joint(124, 292, 'right')}
    ${gap(322, 281, 'buyer confirms')}
    ${card(432, 266, 128, 'Wallet', 'Seller paid')}
    ${joint(430, 292, 'right')}
    <span class="end"></span>
    <span class="end-label">Your commission<br>lands in your wallet</span>
    <div class="title"><small>KetaPay escrow</small>How every<br>sale flows</div>
    <div class="side">${svg('Scales', 14, BRAND.violet)}<span>Dispute? KetaPay reviews it and decides.</span></div>
    <span class="arc a"></span><span class="arc b"></span>
  </div>`,
  `.map { position: relative; width: 600px; height: 340px; overflow: hidden; border-radius: 18px; background: #ECE8FB; }
   .line { position: absolute; inset: 0; }
   .start { position: absolute; left: 36px; top: 24px; font-size: 14px; font-weight: 700; color: #17111F; }
   .card { position: absolute; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 12px; background: #fff;
      border-radius: 10px; box-shadow: 0 1px 2px rgba(23,17,31,.06), 0 8px 20px -12px rgba(59,7,100,.25);
      font-size: 14px; font-weight: 600; color: #2A2340; white-space: nowrap; }
   .ic { flex: none; width: 30px; height: 30px; padding: 6px; border-radius: 8px; background: ${BRAND.tint}; }
   .gap { position: absolute; font-size: 10px; font-weight: 600; color: ${BRAND.violet}; background: #fff;
      border: 1px solid #C9BDF7; border-radius: 4px; padding: 2px 7px; white-space: nowrap; }
   .joint { position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #2A2340; display: flex; align-items: center; justify-content: center; }
   .end { position: absolute; left: 561px; top: 141px; width: 18px; height: 18px; border-radius: 50%; background: ${BRAND.violet};
      box-shadow: 0 0 0 5px rgba(124,58,237,.18); }
   .end-label { position: absolute; right: 14px; top: 92px; text-align: right; font-size: 13px; font-weight: 700; line-height: 1.35; color: #17111F; }
   .title { position: absolute; left: 286px; top: 120px; font-size: 30px; line-height: 1.08; font-weight: 700; color: #1E1033; letter-spacing: -.02em; }
   .title small { display: block; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: ${BRAND.violet}; margin-bottom: 8px; }
   .side { position: absolute; left: 286px; top: 210px; display: flex; gap: 6px; align-items: center; font-size: 11px; color: #4B4360; }
   .arc { position: absolute; width: 30px; height: 30px; border: 2px solid #B9B2CC; }
   .arc.a { left: 250px; top: 60px; border-right: 0; border-bottom: 0; border-radius: 14px 0 0 0; }
   .arc.b { left: 470px; top: 196px; border-left: 0; border-top: 0; border-radius: 0 0 14px 0; }`,
)

// The same flow, top to bottom, for phones (swapped in by a media query)
const vstep = (y, icon, label) => card(44, y, 252, icon, label)
const flowMobile = page(
  340,
  560,
  `<div class="map v">
    <div class="title"><small>KetaPay escrow</small>How every sale flows</div>
    <svg class="line" width="340" height="560"><path d="M70 96 V512" fill="none" stroke="#2A2340" stroke-width="2.5"/></svg>
    <span class="start">Your customer checks out</span>
    ${vstep(126, 'Storefront', 'Buyer pays')}
    ${gap(84, 190, 'card or transfer')}
    ${vstep(222, 'ShieldCheck', 'Held in escrow')}
    ${joint(70, 214, 'down')}
    ${gap(86, 286, 'until delivered')}
    ${vstep(318, 'Handshake', 'Order delivered')}
    ${joint(70, 310, 'down')}
    ${gap(86, 382, 'buyer confirms')}
    ${vstep(414, 'Wallet', 'Seller paid')}
    ${joint(70, 406, 'down')}
    <span class="end"></span>
    <span class="end-label">Your commission lands in your wallet</span>
    <div class="side">${svg('Scales', 14, BRAND.violet)}<span>Dispute? KetaPay reviews it and decides.</span></div>
  </div>`,
  `.map { position: relative; width: 340px; height: 560px; overflow: hidden; border-radius: 18px; background: #ECE8FB; }
   .line { position: absolute; inset: 0; }
   .title { position: absolute; left: 24px; top: 22px; font-size: 22px; line-height: 1.1; font-weight: 700; color: #1E1033; letter-spacing: -.02em; }
   .title small { display: block; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: ${BRAND.violet}; margin-bottom: 6px; }
   .start { position: absolute; left: 86px; top: 92px; font-size: 13px; font-weight: 700; color: #17111F; }
   .card { position: absolute; height: 50px; display: flex; align-items: center; gap: 10px; padding: 0 12px; background: #fff;
      border-radius: 10px; box-shadow: 0 1px 2px rgba(23,17,31,.06), 0 8px 20px -12px rgba(59,7,100,.25);
      font-size: 15px; font-weight: 600; color: #2A2340; white-space: nowrap; }
   .ic { flex: none; width: 30px; height: 30px; padding: 6px; border-radius: 8px; background: ${BRAND.tint}; }
   .gap { position: absolute; font-size: 10px; font-weight: 600; color: ${BRAND.violet}; background: #fff;
      border: 1px solid #C9BDF7; border-radius: 4px; padding: 2px 7px; white-space: nowrap; }
   .joint { position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #2A2340; display: flex; align-items: center; justify-content: center; }
   .end { position: absolute; left: 61px; top: 503px; width: 18px; height: 18px; border-radius: 50%; background: ${BRAND.violet}; box-shadow: 0 0 0 5px rgba(124,58,237,.18); }
   .end-label { position: absolute; left: 92px; top: 502px; font-size: 13px; font-weight: 700; color: #17111F; }
   .side { position: absolute; left: 24px; bottom: 16px; display: flex; gap: 6px; align-items: center; font-size: 11px; color: #4B4360; }`,
)

// A real photo between sections (the marketing site's own), cropped for the email
const photo = page(
  600,
  260,
  `<img src="${teamPhoto}">`,
  `img { width: 600px; height: 260px; object-fit: cover; object-position: 50% 35%; display: block; }`,
)

const tile = (name) =>
  page(
    56,
    56,
    `<div class="tile">${svg(name, 30, BRAND.violet)}</div>`,
    `.tile { width: 56px; height: 56px; border-radius: 16px; background: ${BRAND.tint}; display: flex; align-items: center; justify-content: center; }`,
  )

const social = (name) =>
  page(
    36,
    36,
    `<div class="c">${svg(name, 18, BRAND.deep)}</div>`,
    `.c { width: 36px; height: 36px; border-radius: 50%; background: #ede9fe; display: flex; align-items: center; justify-content: center; }`,
  )

const ASSETS = {
  'flow-welcome.png': flow,
  'flow-welcome-mobile.png': flowMobile,
  'photo-team.jpg': photo,
  'logo-white.png': logoWhite,
  'welcome-avatar.png': avatar,
  'welcome-ribbon.png': ribbon,
  'icon-escrow.png': tile('ShieldCheck'),
  'icon-api.png': tile('Code'),
  'icon-wallet.png': tile('Wallet'),
  'icon-team.png': tile('UsersThree'),
  'icon-disputes.png': tile('Scales'),
  'icon-webhooks.png': tile('WebhooksLogo'),
  'social-x.png': social('XLogo'),
  'social-linkedin.png': social('LinkedinLogo'),
  'social-instagram.png': social('InstagramLogo'),
  'social-youtube.png': social('YoutubeLogo'),
}

await mkdir(out, { recursive: true })
const browser = await chromium.launch()
const tab = await browser.newPage({ deviceScaleFactor: 2 })
for (const [file, html] of Object.entries(ASSETS)) {
  const [, w, h] = html.match(/html, body \{ width: (\d+)px; height: (\d+)px/)
  await tab.setViewportSize({ width: Number(w), height: Number(h) })
  await tab.setContent(html, { waitUntil: 'networkidle' })
  await tab.evaluate(() => document.fonts.ready)
  const jpeg = file.endsWith('.jpg')
  await tab.screenshot({ path: join(out, file), ...(jpeg ? { type: 'jpeg', quality: 82 } : { omitBackground: true }) })
  console.log('wrote', file)
}
await browser.close()
