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

  if (!track || !previous || !next) return;

  const scrollAmount = () => Math.min(track.clientWidth * 0.82, 560);
  const updateControls = () => {
    previous.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };

  previous.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });
  next.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
  track.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls);
  updateControls();
});
