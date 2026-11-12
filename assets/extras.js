import "./nav.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Antes y después: el "después" va encima y se recorta; el "antes" queda detrás.
for (const box of document.querySelectorAll(".compare")) {
  const range = box.querySelector("input[type=range]");
  const set = (v) => {
    box.style.setProperty("--pos", v + "%");
    range.value = v;
    range.setAttribute("aria-valuetext", `Se muestra ${Math.round(v)}% del después`);
  };
  set(range.value);
  let touched = false;
  const stop = () => { touched = true; box.classList.remove("hint"); };
  range.addEventListener("input", () => { stop(); set(range.value); });
  box.addEventListener("pointerdown", stop, { once: true });
  if (!reduce) {
    box.classList.add("hint");
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 2600;
      const frame = (t) => {
        if (touched) return;
        const p = Math.min((t - t0) / dur, 1);
        set(p < .33 ? 50 - 42 * (p / .33) : p < .75 ? 8 + 84 * ((p - .33) / .42) : 92 - 42 * ((p - .75) / .25));
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, { threshold: .6 });
    io.observe(box);
  }
}

// Imagen ampliada: cualquier botón con data-zoom abre el <dialog class="lightbox"> de la página.
const lb = document.querySelector("dialog.lightbox");
if (lb) {
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-zoom]");
    if (b) {
      lb.querySelector("img").src = b.dataset.zoom;
      lb.querySelector("img").alt = b.dataset.alt || "";
      lb.querySelector("p").textContent = b.dataset.alt || "";
      lb.showModal();
    } else if (e.target === lb || e.target.closest("dialog.lightbox [data-close]")) lb.close();
  });
}
