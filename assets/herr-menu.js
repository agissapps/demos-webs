// Menú desplegable "Herramientas": se abre al pasar el ratón o al tocar/clicar el botón
document.querySelectorAll(".herr-menu").forEach((m) => {
  const b = m.querySelector(".herr-btn");
  const poner = (v) => b.setAttribute("aria-expanded", String(v));
  b.addEventListener("click", () => poner(b.getAttribute("aria-expanded") !== "true"));
  m.addEventListener("keydown", (e) => { if (e.key === "Escape") { poner(false); b.focus(); } });
  m.addEventListener("focusout", (e) => { if (!m.contains(e.relatedTarget)) poner(false); });
  document.addEventListener("click", (e) => { if (!m.contains(e.target)) poner(false); });
});
