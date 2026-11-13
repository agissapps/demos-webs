// Pestañas por vista: cada <section class="vista" id="..."> es una pestaña. Los enlaces "#id" cambian de vista
// (o bajan a una sección dentro de ella) y el botón Atrás del navegador funciona.
const vistas = [...document.querySelectorAll(".vista")];
const tira = document.querySelector(".tabs");
const tituloBase = document.title;
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
let actual = null;

function destino(hash) {
  const el = (hash.length > 1 && document.getElementById(decodeURIComponent(hash.slice(1)))) || null;
  const vista = el?.closest(".vista") ?? vistas[0];
  return { el: el ?? vista, vista };
}

function mostrar(hash, { animar = true, enfocar = true } = {}) {
  const { el, vista } = destino(hash);
  const cambia = vista !== actual;
  for (const v of vistas) v.hidden = v !== vista;
  for (const a of document.querySelectorAll(".tabs a")) {
    const on = destino(a.hash).vista === vista;
    on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
    if (on && tira) tira.scrollTo({ left: a.offsetLeft - (tira.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
  }
  document.title = vista === vistas[0] ? tituloBase : `${vista.dataset.titulo} · ${tituloBase}`;
  if (el === vista) window.scrollTo({ top: 0, behavior: "instant" });
  else el.scrollIntoView({ behavior: reduce.matches ? "instant" : "smooth", block: "start" });
  if (cambia && animar && !reduce.matches) {
    vista.classList.remove("entra"); void vista.offsetWidth; vista.classList.add("entra");
  }
  if (cambia && enfocar) vista.focus({ preventScroll: true });
  actual = vista;
}

document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  if (location.hash !== a.hash) history.pushState(null, "", a.hash || "#");
  mostrar(a.hash);
});
addEventListener("popstate", () => mostrar(location.hash));
for (const v of vistas) {
  v.tabIndex = -1;
  v.addEventListener("animationend", () => v.classList.remove("entra"));
}
mostrar(location.hash, { animar: false, enfocar: false });

// Fotos: si una imagen todavía no existe, su marco muestra el color de fondo en lugar del ícono roto.
for (const img of document.querySelectorAll(".foto img")) {
  const sin = () => img.closest(".foto").classList.add("sin-foto");
  if (img.complete && !img.naturalWidth) sin();
  else img.addEventListener("error", sin, { once: true });
}

export { mostrar };
