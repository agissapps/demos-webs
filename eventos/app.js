import "../assets/nav.js";

const WA = "520000000000"; // número de demostración
const enlaceWA = (texto) => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Antes y después: el "después" va encima y se recorta; el "antes" queda detrás y se descubre al mover.
for (const box of document.querySelectorAll(".compare")) {
  const range = box.querySelector("input[type=range]");
  const set = (v) => {
    box.style.setProperty("--pos", v + "%");
    range.value = v;
    range.setAttribute("aria-valuetext", `Se muestra ${Math.round(v)}% del salón decorado`);
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
        const v = p < .33 ? 50 - 42 * (p / .33) : p < .75 ? 8 + 84 * ((p - .33) / .42) : 92 - 42 * ((p - .75) / .25);
        set(v);
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, { threshold: .6 });
    io.observe(box);
  }
}

// Cotizador: los enlaces de evento y paquete preseleccionan el formulario.
const form = document.getElementById("cotizador");
const selEvento = form.elements.evento;
const selPaquete = form.elements.paquete;
for (const a of document.querySelectorAll("[data-evento], [data-paquete]")) {
  a.addEventListener("click", () => {
    if (a.dataset.evento) selEvento.value = a.dataset.evento;
    if (a.dataset.paquete) selPaquete.value = a.dataset.paquete;
  });
}

// La fecha no puede ser anterior a hoy.
const hoy = new Date();
form.elements.fecha.min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const fmtFecha = (iso) => iso ? new Date(iso + "T12:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) : "";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const out = form.querySelector("[role=status]");
  const nombre = form.elements.nombre;
  if (!nombre.value.trim()) {
    out.textContent = "Escribe tu nombre para poder enviarte la cotización.";
    nombre.focus();
    return;
  }
  const d = Object.fromEntries(new FormData(form));
  const lineas = [
    `Hola, soy ${d.nombre.trim()} y quiero cotizar un evento.`,
    `• Tipo: ${d.evento}`,
    d.paquete && `• Paquete: ${d.paquete}`,
    d.fecha && `• Fecha: ${fmtFecha(d.fecha)}`,
    d.invitados && `• Invitados: ${d.invitados}`,
    d.detalles.trim() && `• Detalles: ${d.detalles.trim()}`,
  ].filter(Boolean);
  window.open(enlaceWA(lineas.join("\n")), "_blank", "noopener");
  out.textContent = "Listo, abrimos WhatsApp con tu mensaje. (Sitio de demostración: el número es ficticio.)";
});
