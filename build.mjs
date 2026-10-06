// Builds the bilingual static site from content/*.json.
// Usage: node build.mjs   ->  writes index.html (English) and el.html (Greek)
// No dependencies: plain Node 18+.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

// ---- Site settings: edit these -------------------------------------------
const site = {
  url: "https://vasileios-dev.vercel.app", // change when you buy your own domain
  email: "vdimitropoulos01@gmail.com",
  phone: "+30 698 017 8200",
  phoneHref: "+306980178200",
  github: "https://github.com/vasileios-dev",
  bookingUrl: "#contact",                 // TODO: your Cal.com or Calendly link
  formAction: "https://formspree.io/f/YOUR_FORM_ID", // TODO: your Formspree form id
};
// ---------------------------------------------------------------------------

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const icons = {
  website: '<path d="M3 5h18v14H3z"/><path d="M3 9h18"/><circle cx="6" cy="7" r=".6"/><circle cx="8.2" cy="7" r=".6"/>',
  redesign: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
  wordpress: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"/><path d="M5 9l4 10 3-8 3 8 4-10"/>',
  ai: '<path d="M4 5h16v11H9l-5 4z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/>',
};
const iconKeys = ["website", "redesign", "wordpress", "ai"];
const icon = (k) =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icons[k]}</svg>`;

function page(t, { prefix, selfPath, otherPath }) {
  const year = new Date().getFullYear();
  const services = t.services.items
    .map(
      (s, i) => `
        <article class="service">
          ${icon(iconKeys[i])}
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.text)}</p>
        </article>`
    )
    .join("");

  const work = t.work.items
    .map(
      (w, i) => `
        <article class="project${i === 0 ? " project--feature" : ""}">
          <div class="project__thumb project__thumb--${i}" aria-hidden="true">
            <span class="project__mock"></span>
          </div>
          <div class="project__body">
            <div class="project__meta"><span class="tag">${esc(w.tag)}</span><span class="status status--${i}">${esc(w.status)}</span></div>
            <h3>${esc(w.name)}</h3>
            <p>${esc(w.text)}</p>
            <p class="stack">${esc(w.stack)}</p>
          </div>
        </article>`
    )
    .join("");

  const steps = t.process.steps
    .map(
      (s, i) => `
        <li class="step">
          <span class="step__num">${i + 1}</span>
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.text)}</p>
        </li>`
    )
    .join("");

  const facts = t.about.facts
    .map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`)
    .join("");

  const f = t.contact.form;

  const head = `
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:image" content="${site.url}/vasileios.jpg">
<link rel="canonical" href="${site.url}/${selfPath}">
<link rel="alternate" hreflang="en" href="${site.url}/">
<link rel="alternate" hreflang="el" href="${site.url}/el.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..700&family=Syne:wght@600..800&display=swap">
<link rel="stylesheet" href="style.css">`;

  const body = `
<a class="skip" href="#main">${t.lang === "el" ? "Μετάβαση στο περιεχόμενο" : "Skip to content"}</a>
<header class="nav" id="top">
  <div class="wrap nav__inner">
    <a class="logo" href="#top" aria-label="${esc(t.hero.name)}"><span>VD</span></a>
    <nav aria-label="Main">
      <ul class="nav__links">
        <li><a href="#services">${esc(t.nav.services)}</a></li>
        <li><a href="#work">${esc(t.nav.work)}</a></li>
        <li><a href="#process">${esc(t.nav.process)}</a></li>
        <li><a href="#about">${esc(t.nav.about)}</a></li>
        <li><a href="#contact">${esc(t.nav.contact)}</a></li>
      </ul>
    </nav>
    <div class="nav__actions">
      <a class="lang" href="${otherPath}" hreflang="${t.otherLang}" lang="${t.otherLang}" title="${esc(t.otherLangName)}">${esc(t.otherLangLabel)}</a>
      <a class="btn btn--small" href="${site.bookingUrl}">${esc(t.nav.cta)}</a>
    </div>
  </div>
</header>

<main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero__inner">
      <div class="hero__text">
        <p class="eyebrow eyebrow--light">${esc(t.hero.eyebrow)}</p>
        <h1 id="hero-title">${esc(t.hero.name)}</h1>
        <p class="hero__tagline">${esc(t.hero.tagline)}</p>
        <div class="hero__ctas">
          <a class="btn" href="${site.bookingUrl}">${esc(t.hero.primary)}</a>
          <a class="btn btn--ghost" href="#work">${esc(t.hero.secondary)}</a>
        </div>
        <p class="hero__badge"><span class="dot" aria-hidden="true"></span>${esc(t.hero.badge)}</p>
      </div>
      <figure class="hero__photo">
        <img src="vasileios.jpg" alt="${esc(t.hero.photoAlt)}" width="800" height="1055">
      </figure>
    </div>
  </section>

  <section class="section" id="services" aria-labelledby="services-title">
    <div class="wrap">
      <p class="eyebrow">${esc(t.services.eyebrow)}</p>
      <h2 id="services-title">${esc(t.services.title)}</h2>
      <div class="services">${services}
      </div>
    </div>
  </section>

  <section class="section section--alt" id="work" aria-labelledby="work-title">
    <div class="wrap">
      <p class="eyebrow">${esc(t.work.eyebrow)}</p>
      <h2 id="work-title">${esc(t.work.title)}</h2>
      <div class="projects">${work}
      </div>
      <p class="note">${esc(t.work.note)}</p>
    </div>
  </section>

  <section class="section" id="process" aria-labelledby="process-title">
    <div class="wrap">
      <p class="eyebrow">${esc(t.process.eyebrow)}</p>
      <h2 id="process-title">${esc(t.process.title)}</h2>
      <ol class="steps">${steps}
      </ol>
    </div>
  </section>

  <section class="section section--alt" id="about" aria-labelledby="about-title">
    <div class="wrap about">
      <div class="about__text">
        <p class="eyebrow">${esc(t.about.eyebrow)}</p>
        <h2 id="about-title">${esc(t.about.title)}</h2>
        ${t.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n        ")}
      </div>
      <dl class="facts">${facts}</dl>
    </div>
  </section>

  <section class="contact" id="contact" aria-labelledby="contact-title">
    <div class="wrap contact__inner">
      <div class="contact__intro">
        <p class="eyebrow eyebrow--light">${esc(t.contact.eyebrow)}</p>
        <h2 id="contact-title">${esc(t.contact.title)}</h2>
        <p>${esc(t.contact.text)}</p>
        <a class="btn" href="${site.bookingUrl}">${esc(t.contact.book)}</a>
        <dl class="contact__details">
          <div><dt>${esc(t.contact.emailLabel)}</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div>
          <div><dt>${esc(t.contact.phoneLabel)}</dt><dd><a href="tel:${site.phoneHref}">${site.phone}</a></dd></div>
          <div><dt>GitHub</dt><dd><a href="${site.github}" rel="noopener">github.com/vasileios-dev</a></dd></div>
        </dl>
      </div>
      <form class="form" id="contact-form" action="${site.formAction}" method="POST"
        data-not-connected="${esc(f.notConnected)}" data-sending="${esc(f.sending)}" data-sent="${esc(f.sent)}" data-error="${esc(f.error)}">
        <label for="cf-name">${esc(f.name)}</label>
        <input id="cf-name" name="name" type="text" autocomplete="name" required>
        <label for="cf-email">${esc(f.email)}</label>
        <input id="cf-email" name="email" type="email" autocomplete="email" required>
        <label for="cf-message">${esc(f.message)}</label>
        <textarea id="cf-message" name="message" rows="5" placeholder="${esc(f.messagePlaceholder)}" required></textarea>
        <button class="btn" type="submit">${esc(f.send)}</button>
        <p class="form__status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="wrap footer__inner">
    <p>© ${year} ${esc(t.hero.name)}. ${esc(t.footer.rights)}</p>
    <a href="#top">${esc(t.footer.top)} ↑</a>
  </div>
</footer>
<script src="main.js" defer></script>`;

  return { head, body };
}

const full = (lang, { head, body }) => `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">${head}
</head>
<body>${body}
</body>
</html>
`;

const en = JSON.parse(readFileSync("content-en.json", "utf8"));
const el = JSON.parse(readFileSync("content-el.json", "utf8"));

writeFileSync("index.html", full("en", page(en, { prefix: "", selfPath: "", otherPath: "el.html" })));
writeFileSync("el.html", full("el", page(el, { prefix: "", selfPath: "el.html", otherPath: "index.html" })));

// Optional: a body-only copy used for the claude.ai preview.
if (process.argv.includes("--preview")) {
  mkdirSync("preview", { recursive: true });
  const p = page(en, { prefix: "", selfPath: "", otherPath: "el.html" });
  writeFileSync("preview/index.html", p.head + "\n" + p.body + "\n");
}

console.log("Built index.html and el.html");
