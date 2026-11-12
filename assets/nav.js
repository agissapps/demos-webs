// Navegación responsiva compartida: popover nativo si los enlaces no caben, fila en línea si caben.
if (!Object.hasOwn(HTMLElement.prototype, "popover")) {
  import("https://unpkg.com/@oddbird/popover-polyfill@0.4.4/dist/popover.min.js");
}

const isOpen = (el) => {
  try { return el.matches(":popover-open"); } catch { return el.classList.contains(":popover-open"); }
};

for (const header of document.querySelectorAll(".site-header")) {
  const inner = header.querySelector(".header-inner");
  const menu = header.querySelector(".site-menu");
  if (!inner || !menu) continue;
  let lastWidth = 0;

  const measure = () => {
    const width = header.clientWidth;
    const wasWide = header.classList.contains("is-wide");
    if (!wasWide && lastWidth && width <= lastWidth) { lastWidth = width; return; }
    lastWidth = width;
    const wasOpen = isOpen(menu);
    header.classList.add("is-measuring", "is-wide");
    menu.removeAttribute("popover");
    if (inner.scrollWidth > inner.clientWidth) {
      header.classList.remove("is-wide");
      menu.setAttribute("popover", "auto");
      if (wasOpen) menu.showPopover();
    }
    requestAnimationFrame(() => header.classList.remove("is-measuring"));
  };

  const ro = new ResizeObserver(measure);
  ro.observe(header);
  ro.observe(menu);

  menu.addEventListener("click", (e) => {
    if (e.target.closest("a") && menu.hasAttribute("popover") && isOpen(menu)) menu.hidePopover();
  });
}

for (const el of document.querySelectorAll("[data-year]")) el.textContent = new Date().getFullYear();

// Formularios de demo: no envían nada, sólo confirman.
for (const form of document.querySelectorAll("form[data-demo]")) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const out = form.querySelector("[role=status]");
    if (out) out.textContent = form.dataset.demo;
    form.reset();
  });
}
