/* Update these once — phone, WhatsApp, and email update everywhere on the Study site. */
const VRUDDHI_CONTACT = {
  phoneDisplay: "+91 91 80 4905 41",
  phoneTel: "+919180490541",
  phoneWa: "919180490541",
  email: "info.vruddhi@gmail.com",
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

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const parallaxItems = document.querySelectorAll("[data-parallax]");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  parallaxItems.forEach((element) => {
    element.style.transform = `translateY(${y * Number(element.dataset.parallax)}px)`;
  });
}, { passive: true });

document.getElementById("year").textContent = String(new Date().getFullYear());

function updateClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}
updateClock();
setInterval(updateClock, 1000);

function initCarousel(root) {
  const track = root.querySelector("[data-carousel-track]");
  const slides = [...root.querySelectorAll("[data-slide]")];
  const meter = root.querySelector("[data-carousel-meter]");
  const prev = root.querySelector("[data-carousel-prev]");
  const next = root.querySelector("[data-carousel-next]");
  if (!track || slides.length === 0) return;

  slides.forEach((slide) => {
    const photo = slide.querySelector("img");
    if (!photo || slide.querySelector(".slide-fill")) return;
    photo.classList.add("slide-photo");
    const fill = photo.cloneNode(true);
    fill.className = "slide-fill";
    fill.removeAttribute("alt");
    fill.setAttribute("aria-hidden", "true");
    slide.prepend(fill);
  });

  let index = 0;
  let timer;

  function go(to) {
    index = (to + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    if (meter) meter.style.transform = `scaleX(${(index + 1) / slides.length})`;
  }

  function play() {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 4800);
  }

  prev?.addEventListener("click", () => { go(index - 1); play(); });
  next?.addEventListener("click", () => { go(index + 1); play(); });
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", play);

  go(0);
  play();
}

document.querySelectorAll("[data-carousel]").forEach(initCarousel);
