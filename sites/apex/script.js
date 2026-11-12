/* Update these once — phone, WhatsApp, and email update everywhere on the Apex site. */
const VRUDDHI_CONTACT = {
  phoneDisplay: "+91 6360047399",
  phoneTel: "+916360047399",
  phoneWa: "916360047399",
  email: "kendraholdings@gmail.com",
};

document.querySelectorAll("[data-phone]").forEach((el) => {
  el.textContent = VRUDDHI_CONTACT.phoneDisplay;
});
document.querySelectorAll("[data-phone-href]").forEach((el) => {
  el.setAttribute("href", `tel:${VRUDDHI_CONTACT.phoneTel}`);
});
document.querySelectorAll("[data-whatsapp-href]").forEach((el) => {
  el.setAttribute("href", `https://wa.me/${VRUDDHI_CONTACT.phoneWa}`);
  el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener noreferrer");
});
document.querySelectorAll("[data-email]").forEach((el) => {
  el.textContent = VRUDDHI_CONTACT.email;
});
document.querySelectorAll("[data-email-href]").forEach((el) => {
  el.setAttribute("href", `mailto:${VRUDDHI_CONTACT.email}`);
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = String(new Date().getFullYear());

const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const speedNodes = [...document.querySelectorAll("[data-speed]")];
const strip = document.querySelector("[data-strip]");

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = window.scrollY;
  const p = max > 0 ? y / max : 0;

  if (progress) progress.style.width = `${p * 100}%`;
  if (header) header.classList.toggle("is-solid", y > 24);

  if (!reduceMotion) {
    speedNodes.forEach((el) => {
      const speed = Number(el.dataset.speed || 0);
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
    if (strip) strip.style.transform = `translate3d(${-y * 0.35}px, 0, 0)`;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-in");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });

document.querySelectorAll("[data-reveal]").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 6, 5) * 0.06}s`;
  revealObserver.observe(el);
});

document.querySelectorAll(".hero-title .line").forEach((line, i) => {
  window.setTimeout(() => line.classList.add("is-in"), 160 + i * 130);
});

function animateCount(el) {
  const target = Number(el.dataset.count || 0);
  if (reduceMotion) {
    el.textContent = String(target);
    return;
  }
  const start = performance.now();
  const duration = 1100;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.55 });

document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

function initCarousel(root) {
  const track = root.querySelector("[data-carousel-track]");
  const slides = [...root.querySelectorAll("[data-slide]")];
  const meter = root.querySelector("[data-carousel-meter]");
  const prev = root.querySelector("[data-carousel-prev]");
  const next = root.querySelector("[data-carousel-next]");
  if (!track || slides.length === 0) return;

  let index = 0;
  let timer;

  function go(to) {
    index = (to + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    if (meter) meter.style.transform = `scaleX(${(index + 1) / slides.length})`;
  }

  function play() {
    clearInterval(timer);
    if (reduceMotion) return;
    timer = setInterval(() => go(index + 1), 5600);
  }

  prev?.addEventListener("click", () => { go(index - 1); play(); });
  next?.addEventListener("click", () => { go(index + 1); play(); });
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", play);

  go(0);
  play();
}

document.querySelectorAll("[data-carousel]").forEach(initCarousel);