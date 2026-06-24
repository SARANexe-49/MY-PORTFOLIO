/* =========================================================
   SARAN VIVEK S V — PORTFOLIO
   Shared interactive behavior
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initActiveNav();
  initNavToggle();
  initRevealOnScroll();
  initLightbox();
  initHeaderScrollState();
  initHeroTyper();
});

/* ---------- Preloader ---------- */
function initPreloader() {
  const loader = document.getElementById("preloader");
  if (!loader) return;
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("done"), 200);
  });
  // fallback in case load event already fired
  setTimeout(() => loader.classList.add("done"), 900);
}

/* ---------- Active nav highlighting ---------- */
function initActiveNav() {
  const links = document.querySelectorAll("nav.primary-nav a");
  const current = location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    const href = link.getAttribute("href").replace("./", "");
    if (href === current) link.classList.add("active");
  });
}

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("nav.primary-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    nav.classList.toggle("open");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      nav.classList.remove("open");
    })
  );
}

/* ---------- Header subtle state on scroll ---------- */
function initHeaderScrollState() {
  const header = document.querySelector("header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 12) {
      header.style.borderBottomColor = "rgba(168,80,94,0.2)";
    } else {
      header.style.borderBottomColor = "var(--line)";
    }
  });
}

/* ---------- Scroll reveal ---------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item, i) => {
    item.style.setProperty("--i", i % 8);
    observer.observe(item);
  });
}

/* ---------- Hero role typewriter ---------- */
function initHeroTyper() {
  const el = document.querySelector(".hero-role .typed-text");
  if (!el) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phrases = el.dataset.phrases
    ? el.dataset.phrases.split(";").map((p) => p.trim())
    : [el.textContent.trim()];

  if (reduceMotion) {
    el.textContent = phrases[0];
    return;
  }

  el.textContent = "";
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 28;
  const HOLD_TIME = 2200;
  const SWAP_PAUSE = 500;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        if (phrases.length === 1) return; // single phrase: type once and stop
        deleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, SWAP_PAUSE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // small delay so it starts just after the preloader clears
  setTimeout(tick, 450);
}

/* ---------- Certificate lightbox ---------- */
function initLightbox() {
  const frames = document.querySelectorAll(".cert-frame img");
  if (!frames.length) return;

  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.innerHTML = `<div class="lb-close" aria-label="Close">&times;</div><img alt="" />`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img");

  frames.forEach((img) => {
    img.parentElement.addEventListener("click", (e) => {
      e.preventDefault();
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.getAttribute("alt") || "";
      lb.classList.add("open");
    });
  });

  function close() {
    lb.classList.remove("open");
  }
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.classList.contains("lb-close")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}
