// Builds the static Touristt site into ./site from data.mjs.
//   node build.mjs          → HTML pages, sitemap, robots.txt
//   node build.mjs --pdf    → also renders the documents checklist PDF (needs Playwright)
import { mkdirSync, writeFileSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE, FIELDS, CITIES, LANGS, TYPES, UNIVERSITIES, COUNTRIES, SERVICES, JOURNEY,
  VIDEOS, TOURS, STORIES, FAQ, CHECKLIST, DEMO_APPLICATIONS,
} from "./data.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "site");

// ---------- helpers ----------

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Both languages live in the markup; CSS shows the one matching <html lang>.
const t = (o) => `<span class="ar">${o.ar}</span><span class="en" lang="en">${o.en}</span>`;
const T = (ar, en) => t({ ar, en });

const rm = (n) => "RM " + n.toLocaleString("en-US");
const feeRange = (u) => `${rm(u.fee[0])}–${u.fee[1].toLocaleString("en-US")}`;

const wa = (ar, en) => {
  const base = `https://wa.me/${SITE.whatsapp}?text=`;
  return `href="${base}${encodeURIComponent(ar)}" data-href-en="${base}${encodeURIComponent(en)}" target="_blank" rel="noopener"`;
};

// Field labels / placeholders that need swapping are handled in app.js.
const ph = (ar, en) => `placeholder="${esc(ar)}" data-ph-ar="${esc(ar)}" data-ph-en="${esc(en)}"`;

const ICONS = {
  cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M9 8h6M9 12h4"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/>',
  plane: '<path d="M10.5 13.5L3 11l1.5-1.5 8 .5 4-4.5a2 2 0 0 1 3 3L15 13l.5 8-1.5 1.5-2.5-7.5L8 18v3l-1.5 1-1-3.5L2 17.5l1-1.5h3z"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
  wa: '<path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.5-4.3a8.5 8.5 0 1 1 15.5-4.6z"/><path d="M9 8.5c0 3.5 2.9 6.5 6.5 6.5l1-1.6-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/>',
  ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/>',
  tt: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.8 2.3 4.6 5 5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
};
const icon = (k, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;

// Kuala Lumpur skyline: Merdeka 118, KL Tower and the Petronas Twin Towers,
// drawn from simple shapes so it stays crisp at any width.
function skyline() {
  const G = 340;
  const blocks = [
    [0, 90, 70], [80, 60, 110], [150, 80, 60], [240, 50, 140], [300, 70, 90], [470, 60, 120], [540, 80, 70],
    [700, 70, 150], [780, 50, 95], [840, 90, 125], [1190, 60, 130], [1260, 90, 85], [1360, 80, 115],
  ].map(([x, w, h]) => `<rect x="${x}" y="${G - h}" width="${w}" height="${h}"/>`).join("");
  const tiers = [[64, 150], [56, 50], [48, 28], [40, 20], [30, 14], [20, 10]];
  const tower = (cx) => {
    let y = G, s = "";
    for (const [w, h] of tiers) { y -= h; s += `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}"/>`; }
    s += `<rect x="${cx - 2}" y="${y - 54}" width="4" height="54"/><circle cx="${cx}" cy="${y - 20}" r="4"/>`;
    return s;
  };
  const t1 = 1010, t2 = 1120;
  return `<svg class="skyline" viewBox="0 0 1440 ${G}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <defs>
    <pattern id="win" width="8" height="7" patternUnits="userSpaceOnUse"><rect width="8" height="1.4" y="3" class="win-line"/></pattern>
  </defs>
  <g class="sky-stars">${[[90, 40], [260, 70], [380, 28], [560, 60], [760, 34], [900, 80], [1280, 46], [1390, 90], [1180, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4"/>`).join("")}</g>
  <g class="sky-back">${blocks}</g>
  <g class="sky-mid">
    <polygon points="${380},${G} ${450},${G} ${428},${60} ${402},${60}"/>
    <rect x="413" y="10" width="4" height="52"/>
    <rect x="645" y="150" width="12" height="${G - 150}"/>
    <ellipse cx="651" cy="146" rx="26" ry="11"/><rect x="638" y="128" width="26" height="10" rx="3"/>
    <rect x="649.5" y="70" width="3" height="60"/>
  </g>
  <g class="sky-front">${tower(t1)}${tower(t2)}
    <rect x="${t1 + 30}" y="${G - 168}" width="${t2 - t1 - 60}" height="7"/>
    <path d="M${t1 + 30} ${G - 140} L${t1 + 55} ${G - 161} L${t2 - 30} ${G - 140}" fill="none" stroke-width="3" class="bridge-leg"/>
  </g>
  <g class="sky-windows" fill="url(#win)">${tower(t1)}${tower(t2)}</g>
</svg>`;
}

// ---------- layout ----------

function layout({ path, title, desc, body, jsonld = [], keywords = "" }) {
  const depth = path.split("/").length - 1;
  const r = depth ? "../".repeat(depth) : "";
  const url = SITE.domain + "/" + path.replace(/index\.html$/, "");
  const nav = [
    ["index.html#services", "الخدمات", "Services"],
    ["universities/index.html", "الجامعات", "Universities"],
    ["cost-calculator.html", "التكاليف", "Costs"],
    ["index.html#journey", "رحلتك", "Your journey"],
    ["index.html#tourism", "السياحة", "Tourism"],
    ["tracker.html", "تتبّع طلبك", "Track application"],
  ];
  const org = {
    "@context": "https://schema.org", "@type": "EducationalOrganization", name: "Touristt", alternateName: "توريست",
    url: SITE.domain, areaServed: ["SD", "YE", "IQ", "LY"], address: { "@type": "PostalAddress", addressCountry: "MY" },
    sameAs: [SITE.instagram, SITE.tiktok],
  };
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ""}
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="ar_AR">
<meta property="og:locale:alternate" content="en_US">
<meta name="theme-color" content="#0b1a3d">
<link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@500;600;700&family=Readex+Pro:wght@300;400;500;600&display=swap">
<link rel="stylesheet" href="${r}assets/style.css">
<script>try{var l=new URLSearchParams(location.search).get("lang")||localStorage.getItem("tt-lang");if(l==="en"){document.documentElement.lang="en";document.documentElement.dir="ltr"}}catch(e){}</script>
${[org, ...jsonld].map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
</head>
<body>
<a class="skip" href="#main">${T("تخطَّ إلى المحتوى", "Skip to content")}</a>
<header class="top">
  <div class="wrap top-in">
    <a class="brand" href="${r}index.html" aria-label="Touristt">
      <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect x="9" y="8" width="5" height="22" rx="1"/><rect x="18" y="8" width="5" height="22" rx="1"/><rect x="11" y="2" width="1" height="7"/><rect x="20" y="2" width="1" height="7"/><rect x="14" y="17" width="4" height="2"/></svg>
      <span class="brand-name">Touristt<small>${T("توريست للتعليم والسياحة", "Education &amp; tourism, Malaysia")}</small></span>
    </a>
    <nav class="nav" aria-label="${"الرئيسية"}">
      ${nav.map(([h, a, e]) => `<a href="${r}${h}">${T(a, e)}</a>`).join("")}
    </nav>
    <div class="top-actions">
      <button class="lang-btn" type="button" data-lang-toggle aria-label="Switch language"><span class="ar" lang="en">English</span><span class="en">العربية</span></button>
      <a class="btn btn-wa btn-sm hide-sm" ${wa("السلام عليكم، أريد استشارة عن الدراسة في ماليزيا", "Hello, I would like advice about studying in Malaysia")}>${icon("wa")}${T("واتساب", "WhatsApp")}</a>
      <button class="menu-btn" type="button" data-menu aria-expanded="false" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="wrap foot-in">
    <div class="foot-brand">
      <p class="foot-name">Touristt · توريست</p>
      <p>${T("شركة ماليزية للخدمات التعليمية والسياحية. نرافقك من أول خطوة حتى الوصول، ومن التقديم حتى التخرج.", "A Malaysian education and tourism services company. With you from the first step until arrival, and from application to graduation.")}</p>
      <div class="social">
        <a ${wa("السلام عليكم", "Hello")} aria-label="WhatsApp">${icon("wa")}</a>
        <a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon("ig")}</a>
        <a href="${SITE.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${icon("tt")}</a>
      </div>
    </div>
    <div>
      <p class="foot-h">${T("ادرس من بلدك", "Study from")}</p>
      <ul>${COUNTRIES.map((c) => `<li><a href="${r}countries/${c.slug}.html">${T("الطلاب " + c.demonym.ar, c.demonym.en + " students")}</a></li>`).join("")}</ul>
    </div>
    <div>
      <p class="foot-h">${T("أدوات", "Tools")}</p>
      <ul>
        <li><a href="${r}universities/index.html">${T("دليل الجامعات", "University finder")}</a></li>
        <li><a href="${r}cost-calculator.html">${T("حاسبة التكاليف", "Cost calculator")}</a></li>
        <li><a href="${r}checklist.html">${T("قائمة المستندات", "Documents checklist")}</a></li>
        <li><a href="${r}tracker.html">${T("تتبّع طلبك", "Track your application")}</a></li>
        <li><a href="${r}sudan-certificate.html">${T("مبروك الشهادة السودانية", "Sudanese certificate graduates")}</a></li>
      </ul>
    </div>
    <div>
      <p class="foot-h">${T("تواصل", "Contact")}</p>
      <ul>
        <li>${T("واتساب", "WhatsApp")}: <span class="ltr sel">${SITE.whatsappDisplay}</span></li>
        <li><span class="ltr sel">${SITE.email}</span></li>
        <li>${T("كوالالمبور، ماليزيا", "Kuala Lumpur, Malaysia")}</li>
      </ul>
    </div>
  </div>
  <div class="wrap foot-note">${T("الرسوم والتكاليف في هذا الموقع تقديرية للتخطيط فقط، ونؤكدها لك قبل التقديم.", "Fees and costs on this site are planning estimates only; we confirm them with you before you apply.")} · © ${new Date().getFullYear()} Touristt</div>
</footer>
<nav class="dock" aria-label="Quick contact">
  <a class="btn btn-ghost" href="${r}index.html#contact">${T("استشارة مجانية", "Free consultation")}</a>
  <a class="btn btn-wa" ${wa("السلام عليكم، أريد استشارة عن الدراسة في ماليزيا", "Hello, I would like advice about studying in Malaysia")}>${icon("wa")}${T("واتساب", "WhatsApp")}</a>
</nav>
<script>window.TT=${JSON.stringify({ whatsapp: SITE.whatsapp, usdRate: SITE.usdRate, root: r })};</script>
<script src="${r}assets/app.js" defer></script>
</body>
</html>
`;
}

// ---------- shared sections ----------

const sectionHead = (eyebrow, h, p = null) => `
  <div class="sec-head">
    <p class="eyebrow">${t(eyebrow)}</p>
    <h2>${t(h)}</h2>
    ${p ? `<p class="lead">${t(p)}</p>` : ""}
  </div>`;

const uniData = () => UNIVERSITIES.map((u) => ({
  slug: u.slug, short: u.short, type: u.type, city: u.city, fields: u.fields, langs: u.langs, fee: u.fee, name: u.name,
}));

function finder(r, { limit = 0 } = {}) {
  const opt = (obj) => Object.entries(obj).map(([k, v]) => `<option value="${k}" data-ar="${esc(v.ar)}" data-en="${esc(v.en)}">${v.ar}</option>`).join("");
  return `
  <div class="finder" data-finder data-limit="${limit}" data-root="${r}">
    <form class="filters" data-filters>
      <label class="fld"><span class="lbl">${T("التخصص", "Field of study")}</span>
        <select id="f-field" name="field"><option value="" data-ar="كل التخصصات" data-en="All fields">كل التخصصات</option>${opt(FIELDS)}</select></label>
      <label class="fld"><span class="lbl">${T("المدينة", "City")}</span>
        <select id="f-city" name="city"><option value="" data-ar="كل المدن" data-en="All cities">كل المدن</option>${opt(CITIES)}</select></label>
      <label class="fld"><span class="lbl">${T("نوع الجامعة", "University type")}</span>
        <select id="f-type" name="type"><option value="" data-ar="الكل" data-en="All">الكل</option>${opt(TYPES)}</select></label>
      <fieldset class="fld seg-fld"><legend class="lbl">${T("لغة الدراسة", "Language of study")}</legend>
        <div class="seg">
          <label><input type="radio" name="lang" value="" checked><span>${T("الكل", "Any")}</span></label>
          <label><input type="radio" name="lang" value="en-only"><span>${T("إنجليزي فقط", "English only")}</span></label>
          <label><input type="radio" name="lang" value="other"><span>${T("عربي أو ملايو متاح", "Arabic or Malay too")}</span></label>
        </div>
      </fieldset>
      <label class="fld fld-wide"><span class="lbl">${T("أقصى رسوم سنوية", "Max yearly tuition")} <output class="num" data-budget-out>RM 60,000</output></span>
        <input id="f-budget" type="range" name="budget" min="12000" max="60000" step="1000" value="60000"></label>
    </form>
    <p class="count" data-count aria-live="polite"></p>
    <div class="uni-grid" data-results></div>
    <p class="empty" data-empty hidden>${T("لا توجد جامعة تطابق كل هذه الشروط. جرّب رفع الميزانية أو اختيار مدينة أخرى، أو اسألنا على واتساب.", "No university matches all of these filters. Try a higher budget or another city, or ask us on WhatsApp.")}</p>
    <script type="application/json" data-unis>${JSON.stringify({ unis: uniData(), fields: FIELDS, cities: CITIES, types: TYPES })}</script>
    <noscript><ul class="noscript-list">${UNIVERSITIES.map((u) => `<li><a href="${r}universities/${u.slug}.html">${u.name.ar} · ${u.name.en}</a></li>`).join("")}</ul></noscript>
  </div>`;
}

function calculator() {
  const uniOpts = UNIVERSITIES.map((u) => `<option value="${Math.round((u.fee[0] + u.fee[1]) / 2)}" data-city="${u.city}" data-slug="${u.slug}" data-ar="${esc(u.name.ar)} (${u.short})" data-en="${esc(u.name.en)}">${u.name.ar} (${u.short})</option>`).join("");
  return `
  <div class="calc" data-calc>
    <form class="calc-form" data-calc-form>
      <label class="fld"><span class="lbl">${T("الجامعة", "University")}</span>
        <select id="c-uni" name="uni">${uniOpts}<option value="custom" data-ar="رسوم أخرى (اكتبها بنفسك)" data-en="Other (enter your own fee)">رسوم أخرى (اكتبها بنفسك)</option></select></label>
      <label class="fld"><span class="lbl">${T("المرحلة", "Level")}</span>
        <select id="c-level" name="level">
          <option value="english" data-ar="كورس لغة إنجليزية" data-en="English course">كورس لغة إنجليزية</option>
          <option value="foundation" data-ar="فاونديشن (سنة تأسيسية)" data-en="Foundation year">فاونديشن (سنة تأسيسية)</option>
          <option value="bachelor" selected data-ar="بكالوريوس" data-en="Bachelor's">بكالوريوس</option>
          <option value="master" data-ar="ماجستير" data-en="Master's">ماجستير</option>
          <option value="phd" data-ar="دكتوراه" data-en="PhD">دكتوراه</option>
        </select></label>
      <label class="fld"><span class="lbl">${T("الرسوم السنوية (رينجت)", "Yearly tuition (RM)")}</span>
        <input id="c-tuition" name="tuition" type="number" inputmode="numeric" min="0" step="500" value="25000" class="num"></label>
      <label class="fld"><span class="lbl">${T("مدة الدراسة", "Programme length")}</span>
        <select id="c-years" name="years">
          ${[1, 2, 3, 4, 5].map((y) => `<option value="${y}" ${y === 3 ? "selected" : ""} data-ar="${y === 1 ? "سنة واحدة" : y === 2 ? "سنتان" : y + " سنوات"}" data-en="${y} year${y > 1 ? "s" : ""}">${y === 1 ? "سنة واحدة" : y === 2 ? "سنتان" : y + " سنوات"}</option>`).join("")}
        </select></label>
      <label class="fld"><span class="lbl">${T("المدينة", "City")}</span>
        <select id="c-city" name="city">${Object.entries(CITIES).map(([k, v]) => `<option value="${k}" data-ar="${esc(v.ar)}" data-en="${esc(v.en)}">${v.ar}</option>`).join("")}</select></label>
      <label class="fld"><span class="lbl">${T("السكن", "Housing")}</span>
        <select id="c-housing" name="housing">
          <option value="shared" data-ar="غرفة مشتركة" data-en="Shared room">غرفة مشتركة</option>
          <option value="single" selected data-ar="غرفة خاصة في شقة" data-en="Private room in a flat">غرفة خاصة في شقة</option>
          <option value="studio" data-ar="استوديو مستقل" data-en="Studio">استوديو مستقل</option>
        </select></label>
      <fieldset class="fld seg-fld"><legend class="lbl">${T("نمط المعيشة (أكل، مواصلات، اتصالات)", "Lifestyle (food, transport, phone)")}</legend>
        <div class="seg">
          <label><input type="radio" name="life" value="low"><span>${T("اقتصادي", "Budget")}</span></label>
          <label><input type="radio" name="life" value="mid" checked><span>${T("متوسط", "Moderate")}</span></label>
          <label><input type="radio" name="life" value="high"><span>${T("مريح", "Comfortable")}</span></label>
        </div>
      </fieldset>
    </form>
    <div class="calc-out" aria-live="polite">
      <div class="calc-cur">
        <span class="lbl">${T("العملة", "Currency")}</span>
        <div class="seg seg-sm">
          <label><input type="radio" name="cur" value="rm" checked><span>RM</span></label>
          <label><input type="radio" name="cur" value="usd"><span>USD</span></label>
        </div>
        <label class="rate"><span>1 USD =</span><input id="c-rate" type="number" step="0.05" min="1" value="${SITE.usdRate}" class="num" aria-label="RM per USD"><span>RM</span></label>
      </div>
      <p class="calc-label">${T("ميزانية السنة الأولى", "First-year budget")}</p>
      <p class="calc-total num" data-out="first">—</p>
      <p class="calc-sub">${T("حوالي", "About")} <b class="num" data-out="month">—</b> ${T("شهرياً", "a month")} · ${T("كامل البرنامج", "Whole programme")} <b class="num" data-out="all">—</b></p>
      <div class="bar" data-bar role="img" aria-label="Breakdown"></div>
      <table class="calc-table">
        <tbody data-table></tbody>
      </table>
      <p class="fine">${T("أرقام تقديرية للتخطيط، لا تشمل تذكرة الطيران. نؤكد لك الرسوم الفعلية للجامعة التي تختارها.", "Planning estimates; flights not included. We confirm the actual fees for the university you choose.")}</p>
      <a class="btn btn-gold" data-calc-wa ${wa("السلام عليكم، حسبت ميزانيتي على الموقع وأريد تأكيدها", "Hello, I estimated my budget on your site and would like to confirm it")}>${icon("wa")}${T("أرسل الميزانية لنا على واتساب", "Send this budget to us on WhatsApp")}</a>
    </div>
  </div>`;
}

function contactForm() {
  return `
  <form class="contact-form" data-contact novalidate>
    <label class="fld"><span class="lbl">${T("الاسم", "Name")}</span><input id="k-name" name="name" required autocomplete="name" ${ph("اسمك الكامل", "Your full name")}></label>
    <label class="fld"><span class="lbl">${T("رقم واتساب", "WhatsApp number")}</span><input id="k-phone" name="phone" type="tel" required inputmode="tel" autocomplete="tel" dir="ltr" ${ph("+249 …", "+249 …")}></label>
    <label class="fld"><span class="lbl">${T("بلدك", "Your country")}</span>
      <select id="k-country" name="country">${COUNTRIES.map((c) => `<option value="${c.name.en}" data-ar="${esc(c.name.ar)}" data-en="${esc(c.name.en)}">${c.name.ar}</option>`).join("")}<option value="Other" data-ar="دولة أخرى" data-en="Other">دولة أخرى</option></select></label>
    <label class="fld"><span class="lbl">${T("تحتاج مساعدة في", "I need help with")}</span>
      <select id="k-service" name="service">${SERVICES.map((s) => `<option value="${s.t.en}" data-ar="${esc(s.t.ar)}" data-en="${esc(s.t.en)}">${s.t.ar}</option>`).join("")}<option value="Tourism" data-ar="رحلة سياحية" data-en="A tourism trip">رحلة سياحية</option></select></label>
    <label class="fld fld-wide"><span class="lbl">${T("رسالتك (اختياري)", "Message (optional)")}</span><textarea id="k-msg" name="msg" rows="3" ${ph("مثلاً: نسبتي 82٪ علمي وأريد هندسة", "For example: I scored 82% (science) and want engineering")}></textarea></label>
    <p class="form-err fld-wide" data-err hidden>${T("اكتب اسمك ورقم واتساب حتى نرد عليك.", "Add your name and WhatsApp number so we can reply.")}</p>
    <div class="fld-wide form-actions">
      <button class="btn btn-wa" type="submit">${icon("wa")}${T("أرسل عبر واتساب", "Send on WhatsApp")}</button>
      <p class="fine" data-sent hidden>${T("فتحنا لك واتساب برسالة جاهزة، اضغط إرسال هناك. إذا لم يفتح،", "We opened WhatsApp with your message ready; tap send there. If it didn't open,")} <a data-sent-link target="_blank" rel="noopener">${T("اضغط هنا", "tap here")}</a>.</p>
    </div>
  </form>`;
}

const ctaBand = (ar, en) => `
<section class="band band-cta">
  <div class="wrap cta-in">
    <h2>${T(ar, en)}</h2>
    <div class="btn-row">
      <a class="btn btn-gold" ${wa("السلام عليكم، أريد استشارة مجانية", "Hello, I would like a free consultation")}>${icon("wa")}${T("استشارة مجانية على واتساب", "Free consultation on WhatsApp")}</a>
    </div>
  </div>
</section>`;

const uniCard = (u, r) => `
  <article class="uni">
    <div class="uni-top"><span class="pill pill-${u.type}">${t(TYPES[u.type])}</span><span class="uni-short">${u.short}</span></div>
    <h3><a href="${r}universities/${u.slug}.html">${t(u.name)}</a></h3>
    <p class="uni-meta">${t(CITIES[u.city])}</p>
    <p class="uni-fee num">${feeRange(u)} <small>${T("/ سنة", "/ year")}</small></p>
    <ul class="chips">${u.fields.slice(0, 3).map((f) => `<li>${t(FIELDS[f])}</li>`).join("")}</ul>
  </article>`;

// ---------- pages ----------

function home() {
  const r = "";
  const body = `
<section class="hero">
  <div class="wrap hero-in">
    <p class="eyebrow eyebrow-gold">${T("رحلتك إلى ماليزيا، من أول خطوة حتى الوصول", "Your journey to Malaysia, from the first step to arrival")}</p>
    <h1>${T("هل تحلم بالدراسة في <em>ماليزيا</em>؟", "Dreaming of studying in <em>Malaysia</em>?")}</h1>
    <p class="hero-lead">${T("نختار معك الجامعة، ونقدّم عنك، ونتابع الفيزا والسكن، ونستقبلك في المطار. أكثر من 20 جامعة ومعهد إنجليزي شريك.", "We choose your university with you, apply for you, handle your visa and housing, and meet you at the airport. More than 20 partner universities and English institutes.")}</p>
    <div class="btn-row">
      <a class="btn btn-gold btn-lg" href="#contact">${T("احجز استشارة مجانية", "Book a free consultation")}</a>
      <a class="btn btn-wa btn-lg" ${wa("السلام عليكم، أحلم بالدراسة في ماليزيا وأريد استشارة", "Hello, I want to study in Malaysia and would like advice")}>${icon("wa")}${T("تواصل عبر واتساب", "Chat on WhatsApp")}</a>
    </div>
    <ul class="hero-facts">
      <li><b class="num">+20</b>${T("جامعة ومعهد شريك", "partner universities and institutes")}</li>
      <li><b>${T("6 خدمات", "6 services")}</b>${T("من التقديم حتى التخرج", "from application to graduation")}</li>
      <li><b class="num">29K</b>${T("مشاهدة لمقاطعنا على تيك توك", "views on our TikTok videos")}</li>
    </ul>
  </div>
  ${skyline()}
</section>

<section class="sec" id="services">
  <div class="wrap">
    ${sectionHead({ ar: "خدماتنا", en: "Our services" }, { ar: "كل ما تحتاجه للدراسة في ماليزيا، عند جهة واحدة", en: "Everything you need to study in Malaysia, in one place" })}
    <div class="svc-grid">
      ${SERVICES.map((s) => `<article class="svc">${icon(s.icon, "ic ic-lg")}<h3>${t(s.t)}</h3><p>${t(s.d)}</p></article>`).join("")}
    </div>
  </div>
</section>

<section class="sec sec-alt" id="finder">
  <div class="wrap">
    ${sectionHead({ ar: "دليل الجامعات", en: "University finder" }, { ar: "ابحث عن جامعتك حسب التخصص والميزانية والمدينة", en: "Find your university by field, budget and city" }, { ar: "الرسوم تقديرية لطالب البكالوريوس الدولي في السنة.", en: "Fees are indicative per year for international bachelor's students." })}
    ${finder(r, { limit: 6 })}
    <p class="more"><a class="link-arrow" href="universities/index.html">${T("عرض كل الجامعات", "See all universities")}${icon("arrow", "ic ic-sm flip")}</a></p>
  </div>
</section>

<section class="sec" id="costs">
  <div class="wrap">
    ${sectionHead({ ar: "حاسبة التكاليف", en: "Cost calculator" }, { ar: "كم ستكلّفك الدراسة في ماليزيا؟", en: "What will studying in Malaysia cost you?" }, { ar: "اختر الجامعة والمدينة ونوع السكن، وتظهر لك ميزانية واقعية لك ولأهلك في ثوانٍ.", en: "Pick a university, city and housing type to get a realistic budget for you and your family in seconds." })}
    ${calculator()}
  </div>
</section>

<section class="sec sec-navy" id="journey">
  <div class="wrap">
    ${sectionHead({ ar: "رحلتك معنا", en: "Your journey" }, { ar: "من أول خطوة حتى الوصول", en: "From the first step until arrival" }, { ar: "خمس مراحل، وفي كل مرحلة نتولى عنك الجزء الصعب.", en: "Five stages, and at each one we take care of the hard part." })}
    <ol class="journey">
      ${JOURNEY.map((j, i) => `<li class="step"><span class="step-n num">${i + 1}</span><div class="step-body"><h3>${t(j.t)}</h3><p>${t(j.d)}</p><p class="we-lbl">${T("ما نتولاه نحن", "What we handle")}</p><ul class="we">${j.we.map((w) => `<li>${icon("check", "ic ic-sm")}${t(w)}</li>`).join("")}</ul></div></li>`).join("")}
    </ol>
  </div>
</section>

<section class="sec" id="life">
  <div class="wrap">
    ${sectionHead({ ar: "حياة الطالب", en: "Student life" }, { ar: "شوف ماليزيا بعيون طلابنا", en: "See Malaysia through our students' eyes" }, { ar: "جولات جامعية ونصائح يومية ولحظات العيد مع المجتمع، من حسابنا على تيك توك.", en: "Campus tours, everyday tips and Eid with the community, from our TikTok." })}
    <div class="feed">
      ${VIDEOS.map((v, i) => v.video
        ? `<blockquote class="tiktok-embed" cite="${SITE.tiktok}/video/${v.video}" data-video-id="${v.video}"><section></section></blockquote>`
        : `<a class="clip clip-${i}" href="${SITE.tiktok}" target="_blank" rel="noopener"><span class="clip-tag">${t(v.tag)}</span><span class="clip-play" aria-hidden="true"></span><span class="clip-t">${t(v.t)}</span><span class="clip-views num">${icon("tt", "ic ic-sm")}${v.views} ${T("مشاهدة", "views")}</span></a>`).join("")}
    </div>
    <p class="more"><a class="link-arrow" href="${SITE.tiktok}" target="_blank" rel="noopener">${T("تابعنا على تيك توك", "Follow us on TikTok")} <span class="ltr">${SITE.tiktokHandle}</span>${icon("arrow", "ic ic-sm flip")}</a></p>
  </div>
</section>

<section class="sec sec-alt" id="tourism">
  <div class="wrap">
    ${sectionHead({ ar: "السياحة", en: "Tourism" }, { ar: "زيارة ماليزيا للعائلات والزوار", en: "Visiting Malaysia, for families and travellers" }, { ar: "رحلات قصيرة لأهل الطالب في زيارة أو حفل التخرج، مع المواصلات والفندق والمرشد.", en: "Short trips for families visiting a student or coming for graduation, with transport, hotel and guide." })}
    <div class="tour-grid">
      ${TOURS.map((x) => `<article class="tour tour-${x.key}"><div class="tour-art" aria-hidden="true"></div><div class="tour-body"><p class="tour-days">${t(x.days)}</p><h3>${t(x.t)}</h3><p>${t(x.d)}</p><a class="link-arrow" ${wa("السلام عليكم، أريد تفاصيل رحلة " + x.t.ar, "Hello, I'd like details on the " + x.t.en + " trip")}>${T("اطلب السعر", "Ask for the price")}${icon("arrow", "ic ic-sm flip")}</a></div></article>`).join("")}
    </div>
  </div>
</section>

<section class="sec" id="trust">
  <div class="wrap">
    ${sectionHead({ ar: "قصص نجاح", en: "Success stories" }, { ar: "طلاب بدأوا رحلتهم معنا", en: "Students who started their journey with us" })}
    <div class="stories">
      ${STORIES.map((s) => `<figure class="story"><blockquote>${t(s.q)}</blockquote><figcaption><b>${t(s.who)}</b><span>${s.uni}</span></figcaption></figure>`).join("")}
    </div>
    <p class="fine sample-note">${T("قصص توضيحية لعرض التصميم، تُستبدل بقصص طلاب حقيقيين بعد موافقتهم.", "Illustrative stories for the design; to be replaced with real students' stories, with their consent.")}</p>

    <div class="partners">
      <p class="eyebrow">${T("جامعات نساعدك في التقديم إليها", "Universities we help you apply to")}</p>
      <ul class="partner-strip">${UNIVERSITIES.map((u) => `<li><a href="universities/${u.slug}.html">${u.short}</a></li>`).join("")}</ul>
    </div>

    <a class="season" href="sudan-certificate.html">
      <span class="season-k">${T("موسم النتائج " + SITE.examYear, SITE.examYear + " results season")}</span>
      <span class="season-t">${T("مبروك لخريجي الشهادة السودانية! خطوتك التالية: ماليزيا", "Congratulations, Sudanese certificate graduates! Your next step: Malaysia")}</span>
      ${icon("arrow", "ic flip")}
    </a>

    <div class="faq-wrap" id="faq">
      <h2 class="h-sm">${T("أسئلة متكررة", "Frequently asked questions")}</h2>
      <div class="faq">${FAQ.map((f) => `<details><summary>${t(f.q)}</summary><p>${t(f.a)}</p></details>`).join("")}</div>
    </div>
  </div>
</section>

<section class="sec sec-navy" id="contact">
  <div class="wrap contact">
    <div class="contact-copy">
      <p class="eyebrow eyebrow-gold">${T("تواصل معنا", "Contact us")}</p>
      <h2>${T("ابدأ رحلتك اليوم", "Start your journey today")}</h2>
      <p>${T("املأ البيانات وسنفتح لك محادثة واتساب برسالة جاهزة. نرد عادةً خلال ساعات.", "Fill this in and we'll open a WhatsApp chat with your message ready. We usually reply within hours.")}</p>
      <ul class="contact-list">
        <li>${icon("wa")}<span class="ltr sel">${SITE.whatsappDisplay}</span></li>
        <li><a href="${SITE.instagram}" target="_blank" rel="noopener">${icon("ig")}Instagram</a></li>
        <li><a href="${SITE.tiktok}" target="_blank" rel="noopener">${icon("tt")}TikTok <span class="ltr">${SITE.tiktokHandle}</span></a></li>
        <li><a href="checklist.html">${icon("doc")}${T("قائمة المستندات المطلوبة", "Required documents checklist")}</a></li>
      </ul>
    </div>
    ${contactForm()}
  </div>
</section>`;
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q.ar, acceptedAnswer: { "@type": "Answer", text: f.a.ar } })) };
  return layout({
    path: "index.html",
    title: "توريست | الدراسة في ماليزيا للطلاب العرب والسودانيين",
    desc: "توريست: القبول الجامعي في ماليزيا، كورسات اللغة الإنجليزية، المنح، الفيزا، السكن والاستقبال من المطار. أكثر من 20 جامعة شريكة. استشارة مجانية.",
    keywords: "الدراسة في ماليزيا, الدراسة في ماليزيا للطلاب السودانيين, جامعات ماليزيا, تكاليف الدراسة في ماليزيا, study in Malaysia",
    body, jsonld: [faqLd],
  });
}

function universitiesIndex() {
  const r = "../";
  const body = `
<section class="page-hero">
  <div class="wrap">
    <p class="crumbs"><a href="../index.html">${T("الرئيسية", "Home")}</a> / ${T("الجامعات", "Universities")}</p>
    <h1>${T("دليل الجامعات في ماليزيا", "Universities in Malaysia")}</h1>
    <p class="lead">${T(UNIVERSITIES.length + " جامعة حكومية وخاصة نساعدك في التقديم إليها. فلتر حسب التخصص والميزانية والمدينة ولغة الدراسة.", UNIVERSITIES.length + " public and private universities we help you apply to. Filter by field, budget, city and language of study.")}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap">${finder(r)}</div>
</section>
${ctaBand("لم تجد ما تبحث عنه؟ نختار لك الجامعة المناسبة مجاناً.", "Not sure which one fits? We'll shortlist universities for you, free.")}`;
  return layout({
    path: "universities/index.html",
    title: "جامعات ماليزيا: الرسوم والتخصصات والمدن | توريست",
    desc: "قارن جامعات ماليزيا الحكومية والخاصة حسب التخصص والرسوم السنوية والمدينة ولغة الدراسة، مع صفحة لكل جامعة.",
    keywords: "جامعات ماليزيا, رسوم الجامعات في ماليزيا, أفضل جامعة في ماليزيا للطلاب العرب",
    body,
  });
}

function universityPage(u) {
  const r = "../";
  const similar = UNIVERSITIES.filter((x) => x.slug !== u.slug && (x.city === u.city || x.fields[0] === u.fields[0])).slice(0, 3);
  const body = `
<section class="page-hero">
  <div class="wrap">
    <p class="crumbs"><a href="../index.html">${T("الرئيسية", "Home")}</a> / <a href="index.html">${T("الجامعات", "Universities")}</a> / ${u.short}</p>
    <div class="uni-hero">
      <div>
        <span class="pill pill-${u.type}">${t(TYPES[u.type])}</span>
        <h1>${t(u.name)}</h1>
        <p class="lead">${t(u.about)}</p>
        <div class="btn-row">
          <a class="btn btn-gold" ${wa("السلام عليكم، أريد التقديم على " + u.name.ar, "Hello, I would like to apply to " + u.name.en)}>${icon("wa")}${T("قدّم عن طريقنا", "Apply through us")}</a>
          <a class="btn btn-ghost-light" href="../cost-calculator.html?uni=${u.slug}">${T("احسب تكلفتك", "Estimate your costs")}</a>
        </div>
      </div>
      <dl class="facts">
        <div><dt>${T("المدينة", "City")}</dt><dd>${t(CITIES[u.city])}</dd></div>
        <div><dt>${T("الرسوم السنوية التقديرية", "Indicative yearly tuition")}</dt><dd class="num">${feeRange(u)}</dd></div>
        <div><dt>${T("لغة الدراسة", "Language of study")}</dt><dd>${u.langs.map((l) => t(LANGS[l])).join(" · ")}</dd></div>
        <div><dt>${T("كورس إنجليزي / فاونديشن", "English course / foundation")}</dt><dd>${u.english ? T("متوفر", "Available") : T("غير متوفر", "Not offered")}</dd></div>
      </dl>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap two-col">
    <div>
      <h2 class="h-sm">${T("التخصصات المتاحة", "Fields of study")}</h2>
      <ul class="chips chips-lg">${u.fields.map((f) => `<li>${t(FIELDS[f])}</li>`).join("")}</ul>
      <h2 class="h-sm">${T("ماذا نفعل لك في " + u.short, "What we do for you at " + u.short)}</h2>
      <ul class="ticks">
        ${[["نتأكد من شروط القبول لشهادتك ونسبتك", "Check the entry requirements for your certificate and grade"], ["نجهّز الملف ونقدّم الطلب ونتابع حتى القبول", "Prepare your file, apply and follow up until you're accepted"], ["نتابع فيزا EMGS حتى صدور eVAL", "Handle your EMGS visa until the eVAL is issued"], ["نحجز لك سكناً قريباً من " + u.short, "Book housing close to " + u.short], ["نستقبلك في المطار ونرافقك يوم التسجيل", "Meet you at the airport and go with you on registration day"]].map(([a, e]) => `<li>${icon("check", "ic ic-sm")}${T(a, e)}</li>`).join("")}
      </ul>
    </div>
    <aside class="side-card">
      <p class="eyebrow">${T("التقديم", "Applying")}</p>
      <p>${T("دفعات الدراسة عادةً في فبراير–مارس، يوليو، وسبتمبر–أكتوبر. قدّم قبل موعدك بثلاثة أشهر على الأقل.", "Intakes are usually February–March, July and September–October. Apply at least three months before your intake.")}</p>
      <a class="link-arrow" href="../checklist.html">${T("المستندات المطلوبة", "Documents you need")}${icon("arrow", "ic ic-sm flip")}</a>
    </aside>
  </div>
</section>
<section class="sec sec-alt">
  <div class="wrap">
    <h2 class="h-sm">${T("جامعات مشابهة", "Similar universities")}</h2>
    <div class="uni-grid">${similar.map((x) => uniCard(x, r)).join("")}</div>
  </div>
</section>
${ctaBand("مهتم بـ " + u.name.ar + "؟ استشارتك الأولى مجانية.", "Interested in " + u.name.en + "? Your first consultation is free.")}`;
  const ld = {
    "@context": "https://schema.org", "@type": "CollegeOrUniversity", name: u.name.en, alternateName: [u.name.ar, u.short],
    address: { "@type": "PostalAddress", addressLocality: CITIES[u.city].en, addressCountry: "MY" },
  };
  return layout({
    path: `universities/${u.slug}.html`,
    title: `${u.name.ar} (${u.short}): الرسوم والتخصصات والقبول | توريست`,
    desc: `الدراسة في ${u.name.ar} ${u.name.en}: التخصصات، الرسوم السنوية التقديرية ${feeRange(u)}، لغة الدراسة، والتقديم عن طريق توريست.`,
    keywords: `${u.name.ar}, ${u.name.en}, ${u.short}, الدراسة في ماليزيا`,
    body, jsonld: [ld],
  });
}

function countryPage(c) {
  const r = "../";
  const top = UNIVERSITIES.filter((u) => ["apu", "iium", "universiti-putra-malaysia", "msu", "universiti-teknologi-malaysia", "limkokwing-university"].includes(u.slug));
  const body = `
<section class="page-hero">
  <div class="wrap">
    <p class="crumbs"><a href="../index.html">${T("الرئيسية", "Home")}</a> / ${t(c.name)}</p>
    <h1>${T("الدراسة في ماليزيا للطلاب " + c.demonym.ar, "Studying in Malaysia for " + c.demonym.en + " students")}</h1>
    <p class="lead">${T("كل ما يحتاجه حامل " + c.cert.ar + " للقبول في جامعات ماليزيا: الشروط والمستندات والتكاليف، ومن يرافقك في كل خطوة.", "Everything a holder of the " + c.cert.en + " needs to get into a Malaysian university: requirements, documents, costs and someone with you at every step.")}</p>
    <div class="btn-row">
      <a class="btn btn-gold" ${wa("السلام عليكم، أنا من " + c.name.ar + " وأريد الدراسة في ماليزيا", "Hello, I'm from " + c.name.en + " and want to study in Malaysia")}>${icon("wa")}${T("استشارة مجانية", "Free consultation")}</a>
      <a class="btn btn-ghost-light" href="../checklist.html">${T("قائمة المستندات", "Documents checklist")}</a>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap two-col">
    <div>
      <h2 class="h-sm">${T("ما يهمك كطالب من " + c.name.ar, "What matters for students from " + c.name.en)}</h2>
      <ul class="ticks">${c.notes.map((n) => `<li>${icon("check", "ic ic-sm")}${t(n)}</li>`).join("")}</ul>
      <h2 class="h-sm">${T("خطواتك", "Your steps")}</h2>
      <ol class="mini-steps">${JOURNEY.map((j) => `<li><b>${t(j.t)}</b> ${t(j.d)}</li>`).join("")}</ol>
    </div>
    <aside class="side-card">
      <p class="eyebrow">${T("تنبيه", "Please note")}</p>
      <p>${T("متطلبات التوثيق والفيزا تتغير من وقت لآخر. نراجع معك المتطلبات الحالية لبلدك قبل أن تدفع أي رسوم.", "Attestation and visa requirements change from time to time. We check the current rules for your country with you before you pay any fees.")}</p>
      <a class="link-arrow" href="../cost-calculator.html">${T("احسب تكلفة دراستك", "Estimate your costs")}${icon("arrow", "ic ic-sm flip")}</a>
    </aside>
  </div>
</section>
<section class="sec sec-alt">
  <div class="wrap">
    <h2 class="h-sm">${T("جامعات يختارها الطلاب " + c.demonym.ar + " كثيراً", "Popular with " + c.demonym.en + " students")}</h2>
    <div class="uni-grid">${top.map((u) => uniCard(u, r)).join("")}</div>
  </div>
</section>
${ctaBand("ابدأ ملفك اليوم، ونرد عليك على واتساب خلال ساعات.", "Start your file today; we reply on WhatsApp within hours.")}`;
  return layout({
    path: `countries/${c.slug}.html`,
    title: `الدراسة في ماليزيا للطلاب ${c.demonym.ar} | توريست`,
    desc: `دليل الطلاب ${c.demonym.ar} للدراسة في ماليزيا: قبول ${c.cert.ar}، المستندات، الفيزا، التكاليف والسكن، مع استشارة مجانية من توريست.`,
    keywords: `الدراسة في ماليزيا للطلاب ${c.demonym.ar}, ${c.cert.ar} ماليزيا, study in Malaysia ${c.demonym.en}`,
    body,
  });
}

function sudanPage() {
  const y = SITE.examYear;
  const body = `
<section class="hero hero-short">
  <div class="wrap hero-in">
    <p class="eyebrow eyebrow-gold">${T("نتائج الشهادة السودانية " + y, "Sudan School Certificate results " + y)}</p>
    <h1>${T("مبروك النجاح! <em>ماليزيا</em> في انتظارك", "Congratulations! <em>Malaysia</em> is waiting for you")}</h1>
    <p class="hero-lead">${T("أرسل لنا نسبتك ومسارك، ونقول لك خلال 24 ساعة ما هي الجامعات والتخصصات المتاحة لك وكم ستكلّفك.", "Send us your percentage and track, and within 24 hours we'll tell you which universities and programmes are open to you and what they cost.")}</p>
    <div class="btn-row">
      <a class="btn btn-gold btn-lg" ${wa("السلام عليكم، نجحت في الشهادة السودانية " + y + " ونسبتي: ", "Hello, I passed the Sudan School Certificate " + y + " with a score of: ")}>${icon("wa")}${T("أرسل نسبتك على واتساب", "Send your score on WhatsApp")}</a>
    </div>
  </div>
  ${skyline()}
</section>
<section class="sec">
  <div class="wrap">
    ${sectionHead({ ar: "بعد النتيجة", en: "After your results" }, { ar: "ماذا تفعل الآن؟", en: "What to do now" })}
    <ol class="journey journey-light">
      ${[
        [["جهّز شهادتك", "Get your certificate ready"], ["استخرج الشهادة وكشف الدرجات، ووثّقها من الجهات المختصة. نرشدك إلى مكان التوثيق إن كنت خارج السودان.", "Get your certificate and transcript and have them attested. We tell you where to attest them if you're outside Sudan."]],
        [["اختر التخصص والجامعة", "Choose a programme and university"], ["نقترح عليك جامعات تقبل نسبتك ومسارك وتناسب ميزانية أسرتك.", "We suggest universities that accept your score and track and fit your family's budget."]],
        [["قدّم مبكراً", "Apply early"], ["أقرب دفعة غالباً في فبراير–مارس. التقديم المبكر يعطيك وقتاً كافياً للفيزا والسكن.", "The next intake is usually February–March. Applying early leaves time for your visa and housing."]],
      ].map(([h, d], i) => `<li class="step"><span class="step-n num">${i + 1}</span><div class="step-body"><h3>${T(...h)}</h3><p>${T(...d)}</p></div></li>`).join("")}
    </ol>
  </div>
</section>
<section class="sec sec-alt">
  <div class="wrap">
    <h2 class="h-sm">${T("أين يدرس الطلاب السودانيون في ماليزيا؟", "Where Sudanese students study in Malaysia")}</h2>
    <div class="uni-grid">${UNIVERSITIES.filter((u) => ["apu", "iium", "msu", "universiti-putra-malaysia", "limkokwing-university", "segi-university"].includes(u.slug)).map((u) => uniCard(u, "")).join("")}</div>
  </div>
</section>
${ctaBand("ألف مبروك! خطوتك التالية تبدأ برسالة واتساب.", "Congratulations! Your next step starts with one WhatsApp message.")}`;
  return layout({
    path: "sudan-certificate.html",
    title: `مبروك لخريجي الشهادة السودانية ${y} | الدراسة في ماليزيا مع توريست`,
    desc: `نجحت في الشهادة السودانية ${y}؟ اكتشف الجامعات المتاحة لنسبتك في ماليزيا والتكاليف والخطوات، واحصل على استشارة مجانية.`,
    keywords: `الشهادة السودانية ${y}, نتيجة الشهادة السودانية, الدراسة في ماليزيا للطلاب السودانيين`,
    body,
  });
}

function costPage() {
  const body = `
<section class="page-hero">
  <div class="wrap">
    <p class="crumbs"><a href="index.html">${T("الرئيسية", "Home")}</a> / ${T("حاسبة التكاليف", "Cost calculator")}</p>
    <h1>${T("تكاليف الدراسة في ماليزيا", "The cost of studying in Malaysia")}</h1>
    <p class="lead">${T("الرسوم الجامعية والسكن والمعيشة والفيزا في حساب واحد، بالرينجت أو الدولار.", "Tuition, housing, living and visa costs in one estimate, in ringgit or US dollars.")}</p>
  </div>
</section>
<section class="sec"><div class="wrap">${calculator()}</div></section>
${ctaBand("نراجع ميزانيتك معك ونبحث لك عن منح وخصومات.", "We'll review your budget with you and look for scholarships and discounts.")}`;
  return layout({
    path: "cost-calculator.html",
    title: "حاسبة تكاليف الدراسة في ماليزيا | توريست",
    desc: "احسب تكلفة الدراسة والمعيشة في ماليزيا: الرسوم الجامعية، السكن، المعيشة، الفيزا والتأمين، بالرينجت والدولار.",
    keywords: "تكاليف الدراسة في ماليزيا, تكلفة المعيشة في ماليزيا للطلاب, رسوم الجامعات الماليزية",
    body,
  });
}

function checklistPage() {
  const body = `
<section class="page-hero">
  <div class="wrap">
    <p class="crumbs"><a href="index.html">${T("الرئيسية", "Home")}</a> / ${T("قائمة المستندات", "Documents checklist")}</p>
    <h1>${T("المستندات المطلوبة للدراسة في ماليزيا", "Documents you need to study in Malaysia")}</h1>
    <p class="lead">${T("علّم على ما جهّزته، أو حمّل القائمة كملف PDF وأرسلها لأهلك.", "Tick off what you have ready, or download the list as a PDF to share with your family.")}</p>
    <div class="btn-row">
      <a class="btn btn-gold" href="assets/touristt-documents-checklist.pdf" download>${icon("doc")}${T("حمّل القائمة (PDF)", "Download checklist (PDF)")}</a>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap checklist" data-checklist>
    <p class="progress-txt"><b class="num" data-done>0</b> / <span class="num">${CHECKLIST.reduce((n, g) => n + g.items.length, 0)}</span> ${T("جاهز", "ready")}</p>
    ${CHECKLIST.map((g, gi) => `<fieldset class="cl-group"><legend>${t(g.group)}</legend>${g.items.map((it, ii) => `<label class="cl-item"><input type="checkbox" id="cl-${gi}-${ii}"><span>${t(it)}</span></label>`).join("")}</fieldset>`).join("")}
    <p class="fine">${T("قد تطلب بعض الجامعات مستندات إضافية. نرسل لك القائمة النهائية بعد اختيار الجامعة.", "Some universities ask for extra documents. We send you the final list once you've chosen a university.")}</p>
  </div>
</section>
${ctaBand("أرسل لنا مستنداتك ونراجعها مجاناً.", "Send us your documents and we'll review them for free.")}`;
  return layout({
    path: "checklist.html",
    title: "قائمة المستندات المطلوبة للدراسة في ماليزيا | توريست",
    desc: "قائمة كاملة بالمستندات المطلوبة للقبول الجامعي والفيزا الطلابية EMGS والسفر إلى ماليزيا، قابلة للتحميل PDF.",
    body,
  });
}

function trackerPage() {
  const body = `
<section class="page-hero">
  <div class="wrap">
    <p class="crumbs"><a href="index.html">${T("الرئيسية", "Home")}</a> / ${T("تتبّع طلبك", "Track your application")}</p>
    <h1>${T("أين وصل طلبك؟", "Where is your application?")}</h1>
    <p class="lead">${T("أدخل رقم الطلب الذي أرسلناه لك وآخر 4 أرقام من هاتفك.", "Enter the application number we sent you and the last 4 digits of your phone.")}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap tracker" data-tracker>
    <form class="track-form" data-track-form>
      <label class="fld"><span class="lbl">${T("رقم الطلب", "Application number")}</span><input id="t-code" name="code" dir="ltr" autocomplete="off" required ${ph("TT-26-0000", "TT-26-0000")}></label>
      <label class="fld"><span class="lbl">${T("آخر 4 أرقام من الهاتف", "Last 4 phone digits")}</span><input id="t-pin" name="pin" dir="ltr" inputmode="numeric" maxlength="4" required ${ph("0000", "0000")}></label>
      <button class="btn btn-gold" type="submit">${T("اعرض حالة طلبي", "Show my status")}</button>
      <p class="form-err" data-track-err hidden>${T("لم نجد طلباً بهذه البيانات. تأكد من الرقم أو راسلنا على واتساب.", "We couldn't find an application with those details. Check the number or message us on WhatsApp.")}</p>
      <p class="fine demo-note">${T("نسخة تجريبية: جرّب الرقم", "Demo version: try")} <code class="ltr sel">TT-26-1042</code> ${T("مع", "with")} <code class="ltr sel">4821</code></p>
    </form>
    <div class="track-out" data-track-out hidden>
      <p class="eyebrow" data-t-code></p>
      <h2 class="h-sm" data-t-name></h2>
      <p class="fine" data-t-meta></p>
      <ol class="track-steps">${JOURNEY.map((j, i) => `<li data-step="${i}"><span class="dot num">${i + 1}</span><div><b>${t(j.t)}</b><p>${t(j.we[0])}</p></div></li>`).join("")}</ol>
    </div>
    <script type="application/json" data-apps>${JSON.stringify(DEMO_APPLICATIONS)}</script>
  </div>
</section>`;
  return layout({ path: "tracker.html", title: "تتبّع طلبك | توريست", desc: "تابع مرحلة طلبك للدراسة في ماليزيا مع توريست: القبول، الفيزا، السكن والوصول.", body });
}

// Plain printable checklist used only to render the PDF.
function checklistPrint() {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@600&family=Readex+Pro:wght@400;500&display=swap">
<style>
@page{size:A4;margin:16mm 16mm 14mm}
body{font-family:"Readex Pro",Tahoma,sans-serif;color:#13203d;font-size:10.5pt;line-height:1.55;margin:0}
header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #b8892c;padding-bottom:8px;margin-bottom:14px}
h1{font-family:"El Messiri",serif;font-size:20pt;margin:0;color:#0b1a3d}
.en{direction:ltr;text-align:left;color:#5a6683;font-size:9pt}
h2{font-family:"El Messiri",serif;font-size:13pt;margin:14px 0 6px;color:#0b1a3d;display:flex;justify-content:space-between;align-items:baseline}
h2 .en{font-family:"Readex Pro",sans-serif;font-size:9pt;font-weight:500}
li{display:grid;grid-template-columns:16px 1fr 1fr;gap:10px;align-items:start;padding:5px 0;border-bottom:1px solid #dce2ee}
ul{list-style:none;margin:0;padding:0}
.box{width:12px;height:12px;border:1.4px solid #0b1a3d;border-radius:2px;margin-top:3px}
footer{margin-top:18px;font-size:9pt;color:#5a6683;display:flex;justify-content:space-between}
.brand{font-family:"El Messiri",serif;font-size:14pt;color:#b8892c}
</style></head><body>
<header><div><h1>قائمة المستندات المطلوبة</h1><div class="en">Documents checklist for studying in Malaysia</div></div><div class="brand">Touristt · توريست</div></header>
${CHECKLIST.map((g) => `<h2><span>${g.group.ar}</span><span class="en">${g.group.en}</span></h2><ul>${g.items.map((i) => `<li><span class="box"></span><span>${i.ar}</span><span class="en">${i.en}</span></li>`).join("")}</ul>`).join("")}
<footer><span>واتساب: <span dir="ltr">${SITE.whatsappDisplay}</span> · ${SITE.domain.replace("https://", "")}</span><span>قد تطلب بعض الجامعات مستندات إضافية</span></footer>
</body></html>`;
}

// ---------- write ----------

const write = (p, s) => { const f = join(OUT, p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, s); };

rmSync(OUT, { recursive: true, force: true });
cpSync(join(HERE, "assets"), join(OUT, "assets"), { recursive: true });

const pages = {
  "index.html": home(),
  "universities/index.html": universitiesIndex(),
  "cost-calculator.html": costPage(),
  "checklist.html": checklistPage(),
  "tracker.html": trackerPage(),
  "sudan-certificate.html": sudanPage(),
};
for (const u of UNIVERSITIES) pages[`universities/${u.slug}.html`] = universityPage(u);
for (const c of COUNTRIES) pages[`countries/${c.slug}.html`] = countryPage(c);
for (const [p, html] of Object.entries(pages)) write(p, html);

write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(pages).filter((p) => p !== "tracker.html").map((p) => `  <url><loc>${SITE.domain}/${p.replace(/index\.html$/, "")}</loc></url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /tracker.html\nSitemap: ${SITE.domain}/sitemap.xml\n`);

console.log(`Built ${Object.keys(pages).length} pages into ${OUT}`);

if (process.argv.includes("--pdf")) {
  // Use a local Playwright install if there is one, else the global one.
  let pw;
  try { pw = await import("playwright"); } catch {
    const { execSync } = await import("node:child_process");
    const { createRequire } = await import("node:module");
    pw = createRequire(import.meta.url)(join(execSync("npm root -g").toString().trim(), "playwright"));
  }
  const { chromium } = pw;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(checklistPrint(), { waitUntil: "networkidle" });
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  writeFileSync(join(HERE, "assets", "touristt-documents-checklist.pdf"), pdf);
  writeFileSync(join(OUT, "assets", "touristt-documents-checklist.pdf"), pdf);
  console.log("Rendered checklist PDF");
}
