const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const cards = [...carousel.querySelectorAll(".graphic-card")];
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];

  if (!track || !previous || !next || !cards.length) return;

  const currentIndex = () => {
    if (track.scrollLeft <= 4) return 0;
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) return cards.length - 1;
    return cards.reduce((closest, card, index) => {
      const distance = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Infinity }).index;
  };

  const goTo = (index) => {
    const target = Math.max(0, Math.min(index, cards.length - 1));
    track.scrollTo({ left: cards[target].offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  const updateControls = () => {
    const active = currentIndex();
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === active);
      if (index === active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };

  previous.addEventListener("click", () => {
    goTo((currentIndex() - 1 + cards.length) % cards.length);
  });
  next.addEventListener("click", () => {
    goTo((currentIndex() + 1) % cards.length);
  });
  dots.forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));
  track.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls);
  updateControls();
});
