const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const closeMenu = () => {
  nav?.classList.remove("is-open");
  toggle?.setAttribute("aria-expanded", "false");
};
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });
}

// Animate once, keeping a complete heading available without JavaScript.
const typing = document.querySelector("[data-typewriter]");
if (typing) {
  const fullText = typing.textContent;
  const letters = Array.from(fullText);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer;
  let index = 0;
  const finish = () => {
    clearTimeout(timer);
    typing.textContent = fullText;
    typing.classList.remove("is-typing");
  };
  if (!motion.matches) {
    typing.textContent = "";
    typing.classList.add("is-typing");
    const tick = () => {
      typing.textContent = letters.slice(0, ++index).join("");
      if (index < letters.length) timer = setTimeout(tick, 65);
      else finish();
    };
    timer = setTimeout(tick, 200);
    motion.addEventListener?.("change", finish, { once: true });
  }
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const cards = [...carousel.querySelectorAll(".graphic-card")];
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
  if (!track || !previous || !next || !cards.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = 0;
  let destination = null;
  let settleTimer;
  const position = (card) => card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
  const nearestIndex = () => cards.reduce((best, card, index) => {
    const distance = Math.abs(position(card) - track.scrollLeft);
    return distance < best.distance ? { index, distance } : best;
  }, { index: 0, distance: Infinity }).index;
  const syncDots = () => dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === active);
    if (index === active) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  const goTo = (index) => {
    active = (index + cards.length) % cards.length;
    destination = active;
    syncDots();
    track.scrollTo({ left: position(cards[active]), behavior: reduceMotion.matches ? "instant" : "smooth" });
  };
  const layout = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    // Let every card reach the start, so the final two projects have distinct positions.
    track.style.setProperty("--carousel-tail", Math.max(0, track.clientWidth - cards[0].getBoundingClientRect().width - gap) + "px");
    track.scrollTo({ left: position(cards[active]), behavior: "instant" });
  };
  previous.addEventListener("click", () => goTo(active - 1));
  next.addEventListener("click", () => goTo(active + 1));
  dots.forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));
  track.addEventListener("keydown", (event) => {
    const keys = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: cards.length - 1 };
    if (event.target === track && Object.hasOwn(keys, event.key)) {
      event.preventDefault();
      goTo(keys[event.key]);
    }
  });
  track.addEventListener("scroll", () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      active = nearestIndex();
      destination = null;
      syncDots();
    }, 150);
    if (destination === null) {
      active = nearestIndex();
      syncDots();
    }
  }, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(layout).observe(track);
  else window.addEventListener("resize", layout);
  layout();
  syncDots();
});
