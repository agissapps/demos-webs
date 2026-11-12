import "../assets/nav.js";

// Antes y después: el "después" va encima y se recorta; el "antes" queda detrás y se descubre al mover.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // Al entrar en pantalla, el control se mueve solo una vez para mostrar que se puede arrastrar.
  if (!reduce) {
    box.classList.add("hint");
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 2600;
      const frame = (t) => {
        if (touched) return;
        const p = Math.min((t - t0) / dur, 1);
        // 50 → 8 → 92 → 50
        const v = p < .33 ? 50 - 42 * (p / .33) : p < .75 ? 8 + 84 * ((p - .33) / .42) : 92 - 42 * ((p - .75) / .25);
        set(v);
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, { threshold: .6 });
    io.observe(box);
  }
}
