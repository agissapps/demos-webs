import "../assets/nav.js";
import { motos, promos, refacciones, serviciosPorMarca, ventasPorMarca, serviciosPorMes, tiposDeServicio, fmtPrecio, fmtKm, escapar, imagen, guardado, pagoMensual } from "./motos.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s) => document.querySelector(s);

/* ---------- Cuenta regresiva: fin de noviembre ---------- */
const fin = new Date(new Date().getFullYear(), 10, 30, 23, 59, 59);
const cuenta = $("#cuenta");
function tic() {
  let r = Math.max(0, fin - Date.now()) / 1000;
  const v = { d: Math.floor(r / 86400), h: Math.floor(r % 86400 / 3600), m: Math.floor(r % 3600 / 60), s: Math.floor(r % 60) };
  for (const [k, n] of Object.entries(v)) { const el = cuenta.querySelector(`[data-u=${k}]`); const t = String(n).padStart(2, "0"); if (el.textContent !== t) el.textContent = t; }
}
tic(); setInterval(tic, 1000);

/* ---------- Confeti (sólo si se permite movimiento) ---------- */
$("#festejar").addEventListener("click", () => {
  if (reduce) return;
  const box = $("#confeti");
  const colores = ["#e11d27", "#fff", "#ff6a6f", "#1a1a1f", "#ffd166"];
  box.replaceChildren(...Array.from({ length: 70 }, () => {
    const i = document.createElement("i");
    i.style.cssText = `inset-inline-start:${Math.random() * 100}%;--c:${colores[Math.random() * colores.length | 0]};--d:${1.6 + Math.random() * 1.6}s;--x:${(Math.random() - .5) * 200}px;--r:${Math.random() * 720}deg;animation-delay:${Math.random() * .4}s`;
    return i;
  }));
  setTimeout(() => box.replaceChildren(), 3800);
});

/* ---------- Gráficas ---------- */
function barras(sel, datos, clave, alt) {
  const max = Math.max(...datos.map((d) => d.total));
  $(sel).innerHTML = datos.map((d) => `<li><span>${d[clave]}</span><span class="track"><span class="fill${alt ? " alt" : ""}" style="--v:${Math.round(d.total / max * 100)}"></span></span><b>${d.total}</b></li>`).join("");
}
barras("#g-serv", serviciosPorMarca, "marca");
barras("#g-vent", ventasPorMarca, "marca", true);
barras("#g-tipo", tiposDeServicio, "tipo");
{ const max = Math.max(...serviciosPorMes.map((d) => d.total));
  $("#g-mes").innerHTML = serviciosPorMes.map((d) => `<li><b>${d.total}</b><span class="col" style="--v:${Math.round(d.total / max * 100)}"></span>${d.mes}</li>`).join(""); }

/* ---------- Contadores animados al entrar en pantalla ---------- */
const io = new IntersectionObserver((es) => {
  for (const e of es) {
    if (!e.isIntersecting) continue;
    io.unobserve(e.target);
    const fin = Number(e.target.dataset.count), suf = e.target.dataset.suf || "";
    if (reduce) { e.target.textContent = fin + suf; continue; }
    const t0 = performance.now();
    const paso = (t) => { const p = Math.min((t - t0) / 1400, 1); e.target.textContent = Math.round(fin * (1 - (1 - p) ** 3)) + suf; if (p < 1) requestAnimationFrame(paso); };
    requestAnimationFrame(paso);
  }
}, { threshold: .6 });
document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));

/* ---------- Promociones ---------- */
$("#promos").innerHTML = promos.map((p) => `<li class="promo reveal"><span class="et">${p.etiqueta}</span><h3>${p.titulo}</h3><p>${p.texto}</p></li>`).join("");

/* ---------- Catálogo ---------- */
const form = $("#filtros"), lista = $("#lista"), vacio = $("#vacio"), conteo = $("#conteo"), pills = $("#marcas");
const CLAVE_FAV = "motocity-favoritos";
const favoritos = () => guardado.leer(CLAVE_FAV, []);
let marcaActiva = "";
const marcas = [...new Set(motos.map((m) => m.marca))];
pills.innerHTML = ["Todas", ...marcas].map((m, i) => `<li><button class="pill" type="button" data-marca="${i ? m : ""}" aria-pressed="${i === 0}">${m}</button></li>`).join("");
for (const t of [...new Set(motos.map((m) => m.tipo))].sort()) form.tipo.add(new Option(t, t));

const orden = { vendidas: (a, b) => b.vendidas - a.vendidas, menor: (a, b) => a.promo - b.promo, mayor: (a, b) => b.promo - a.promo, cc: (a, b) => b.cc - a.cc };
const corazon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 10.6 19.2C5.4 14.5 2 11.4 2 7.6 2 4.5 4.4 2 7.5 2 9.2 2 10.9 2.8 12 4.1 13.1 2.8 14.8 2 16.5 2 19.6 2 22 4.5 22 7.6 22 11.4 18.6 14.5 13.4 19.2Z"/></svg>`;

function html(m, favs) {
  return `<li class="moto" data-id="${m.id}" style="view-transition-name:m-${m.id}">
    <span class="tag${m.estado === "Seminueva" ? " semi" : ""}">${m.estado === "Nueva" ? "Buen Mes" : "Seminueva"}</span>
    <button class="fav" type="button" data-fav="${m.id}" aria-pressed="${favs.includes(m.id)}" aria-label="Guardar ${escapar(m.marca)} ${escapar(m.modelo)} en favoritas">${corazon}</button>
    <a class="photo" href="#" data-abrir="${m.id}" tabindex="-1" aria-hidden="true">${imagen(m)}</a>
    <div class="body"><p class="marca">${escapar(m.marca)}</p><h3>${escapar(m.modelo)}</h3>
      <p class="meta">${m.anio} · ${m.cc} cc · ${m.tipo} · ${fmtKm(m.km)}</p>
      <div class="precios"><span class="price">${fmtPrecio(m.promo)}</span><span class="old" aria-label="Precio anterior">${fmtPrecio(m.precio)}</span></div>
      <button class="btn small" type="button" data-abrir="${m.id}">Ver detalles<span class="visually-hidden"> de ${escapar(m.marca)} ${escapar(m.modelo)}</span></button></div></li>`;
}

function dibujar() {
  const max = Number(form.precio.value) || Infinity, favs = favoritos(), soloFav = form.favs.checked;
  const res = motos.filter((m) => (!marcaActiva || m.marca === marcaActiva) && (!form.tipo.value || m.tipo === form.tipo.value) && (!form.estado.value || m.estado === form.estado.value) && m.promo <= max && (!soloFav || favs.includes(m.id))).sort(orden[form.orden.value]);
  lista.innerHTML = res.map((m) => html(m, favs)).join("");
  vacio.hidden = res.length > 0;
  conteo.textContent = (res.length === 1 ? "1 moto disponible" : `${res.length} motos disponibles`) + (favs.length ? ` · ${favs.length} en favoritas` : "");
}
// Las tarjetas se reacomodan con una transición de vista cuando el navegador la soporta.
function actualizar() {
  if (!document.startViewTransition || reduce) return dibujar();
  document.startViewTransition(dibujar);
}
form.addEventListener("input", actualizar);
form.addEventListener("reset", () => setTimeout(() => { marcaActiva = ""; sincronizarPills(); actualizar(); }));
function sincronizarPills() { pills.querySelectorAll(".pill").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.marca === marcaActiva))); }
pills.addEventListener("click", (e) => { const b = e.target.closest(".pill"); if (!b) return; marcaActiva = b.dataset.marca; sincronizarPills(); actualizar(); });

lista.addEventListener("click", (e) => {
  const f = e.target.closest("[data-fav]");
  if (f) {
    const l = favoritos(), i = l.indexOf(f.dataset.fav);
    if (i >= 0) l.splice(i, 1); else l.push(f.dataset.fav);
    guardado.escribir(CLAVE_FAV, l);
    f.setAttribute("aria-pressed", String(i < 0));
    if (form.favs.checked) return dibujar();
    conteo.textContent = conteo.textContent.replace(/ · \d+ en favoritas/, "") + (l.length ? ` · ${l.length} en favoritas` : "");
    return;
  }
  const a = e.target.closest("[data-abrir]");
  if (a) { e.preventDefault(); abrir(a.dataset.abrir); }
});

/* ---------- Ficha en <dialog> ---------- */
const dlg = $("#ficha");
function abrir(id) {
  const m = motos.find((x) => x.id === id); if (!m) return;
  $("#ficha-foto").innerHTML = imagen(m, { lazy: false });
  $("#ficha-marca").textContent = m.marca;
  $("#ficha-t").textContent = `${m.modelo} ${m.anio}`;
  $("#ficha-precio").textContent = fmtPrecio(m.promo);
  $("#ficha-old").textContent = `Precio de lista ${fmtPrecio(m.precio)} · ahorras ${fmtPrecio(m.precio - m.promo)}`;
  const specs = [["Cilindrada", m.cc + " cc"], ["Potencia", m.potencia], ["Transmisión", m.transmision], ["ABS", m.abs ? "Sí" : "No"], ["Tipo", m.tipo], ["Color", m.color], ["Kilometraje", fmtKm(m.km)], ["Estado", m.estado]];
  $("#ficha-specs").innerHTML = specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${escapar(v)}</dd></div>`).join("");
  $("#ficha-equipo").innerHTML = m.equipo.map((x) => `<li>${escapar(x)}</li>`).join("");
  $("#ficha-msg").textContent = "";
  dlg.dataset.moto = `${m.marca} ${m.modelo}`;
  dlg.showModal();
}
dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-cerrar]")) dlg.close(); });
dlg.addEventListener("close", () => { document.documentElement.style.overflow = ""; });
dlg.addEventListener("toggle", () => { document.documentElement.style.overflow = dlg.open ? "hidden" : ""; });
$("#ficha-wa").addEventListener("click", () => {
  $("#ficha-msg").textContent = `¡Listo! Un asesor te contactaría para apartar tu ${dlg.dataset.moto}. (Es una demo: no se envió nada.)`;
});

dibujar();

/* ---------- Simulador de crédito ---------- */
const sim = $("#sim");
const motoSel = sim.moto;
for (const m of [...motos].sort((a, b) => a.promo - b.promo)) motoSel.add(new Option(`${m.marca} ${m.modelo} · ${fmtPrecio(m.promo)}`, m.id));
motoSel.value = "vento-rocketman-250";

// Los números cambian con un contador corto; sin movimiento se ponen directo.
const animados = new WeakMap();
function contar(el, valor) {
  const desde = animados.get(el) ?? valor;
  animados.set(el, valor);
  if (reduce || desde === valor) { el.textContent = fmtPrecio(valor); return; }
  const t0 = performance.now(), dur = 450;
  const paso = (t) => {
    if (animados.get(el) !== valor) return;
    const p = Math.min((t - t0) / dur, 1), e = 1 - (1 - p) ** 3;
    el.textContent = fmtPrecio(Math.round(desde + (valor - desde) * e));
    if (p < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

let fotoActual = "";
function simular() {
  const m = motos.find((x) => x.id === motoSel.value);
  const pct = Number(sim.eng.value), meses = Number(sim.plazo.value);
  const enganche = Math.round(m.promo * pct / 100), monto = m.promo - enganche;
  const mes = Math.round(pagoMensual(monto, meses)), total = enganche + mes * meses, interes = total - m.promo;
  $("#sim-eng-out").textContent = pct + "%";
  sim.eng.style.setProperty("--p", ((pct - 10) / 40 * 100) + "%");
  contar($("#sim-mes"), mes);
  contar($("#sim-sem"), Math.round(mes * 12 / 52));
  $("#sim-precio").textContent = fmtPrecio(m.promo);
  $("#sim-enganche").textContent = fmtPrecio(enganche);
  $("#sim-monto").textContent = fmtPrecio(monto);
  $("#sim-total").textContent = fmtPrecio(total);
  const barra = $(".sim-barra");
  barra.style.setProperty("--eng", enganche / total);
  barra.style.setProperty("--cap", monto / total);
  barra.style.setProperty("--int", interes / total);
  if (fotoActual !== m.id) { fotoActual = m.id; $("#sim-foto").innerHTML = imagen(m); }
  $("#sim-msg").textContent = "";
}
sim.addEventListener("input", simular);
sim.addEventListener("submit", (e) => e.preventDefault());
$("#sim-cta").addEventListener("click", () => {
  const m = motos.find((x) => x.id === motoSel.value);
  $("#sim-msg").textContent = `Listo: un asesor te contactaría con el plan de ${sim.plazo.value} meses para tu ${m.marca} ${m.modelo}. (Demo: no se envió nada.)`;
});
$("#ficha-credito").addEventListener("click", () => {
  const m = motos.find((x) => `${x.marca} ${x.modelo}` === dlg.dataset.moto);
  if (m) motoSel.value = m.id;
  dlg.close(); simular();
  navegar("#credito");
});
simular();

/* ---------- Refacciones ---------- */
const iconos = {
  Frenos: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/>',
  Mantenimiento: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
  "Eléctrico": '<path d="M13 2 5 13h6l-1 9 8-11h-6z"/>',
  Llantas: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>',
  "Transmisión": '<circle cx="7" cy="12" r="3.5"/><circle cx="17" cy="12" r="3.5"/><path d="M7 8.5h10M7 15.5h10"/>',
  Accesorios: '<ellipse cx="9" cy="9" rx="6" ry="4.5"/><path d="M13 12l6 8"/>',
  Equipo: '<path d="M4 15a8 8 0 0 1 16 0v2H4z"/><path d="M12 7v4h8"/>',
};
const rfForm = $("#rf-filtros"), rfLista = $("#rf-lista"), rfCats = $("#rf-cats"), rfConteo = $("#rf-conteo"), rfVacio = $("#rf-vacio");
const CLAVE_AP = "motocity-apartados";
let catActiva = "";
const cats = [...new Set(refacciones.map((r) => r.cat))];
rfCats.innerHTML = ["Todas", ...cats].map((c, i) => `<li><button class="pill" type="button" data-cat="${i ? c : ""}" aria-pressed="${i === 0}">${c}</button></li>`).join("");

const sinAcentos = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function pintarRefacciones() {
  const q = sinAcentos(rfForm.q.value.trim()), marca = rfForm.marca.value, soloStock = rfForm.stock.checked, ap = guardado.leer(CLAVE_AP, []);
  const res = refacciones.filter((r) => (!catActiva || r.cat === catActiva) && (!marca || r.marca === marca || r.marca === "Todas") && (!soloStock || r.stock > 0) && (!q || sinAcentos(`${r.nombre} ${r.cat} ${r.modelo} ${r.marca}`).includes(q)));
  rfLista.innerHTML = res.map((r) => {
    const apartado = ap.includes(r.id), agotado = r.stock === 0;
    return `<li class="parte${agotado ? " agotado" : ""}" style="view-transition-name:p-${r.id}">
      <div class="icono" aria-hidden="true"><svg viewBox="0 0 24 24">${iconos[r.cat] || iconos.Accesorios}</svg></div>
      ${r.promo ? '<span class="tag">Buen Mes</span>' : ""}
      <p class="cat">${r.cat}</p><h3>${escapar(r.nombre)}</h3>
      <p class="meta">Compatible: ${r.marca === "Todas" ? "todas las marcas" : escapar(r.marca)} · ${escapar(r.modelo)}</p>
      <div class="precios"><span class="price">${fmtPrecio(r.promo ?? r.precio)}</span>${r.promo ? `<span class="old">${fmtPrecio(r.precio)}</span>` : ""}</div>
      <p class="stock ${agotado ? "no" : r.stock <= 5 ? "poco" : "si"}">${agotado ? "Agotado" : r.stock <= 5 ? `Últimas ${r.stock} piezas` : `${r.stock} en existencia`}</p>
      <button class="btn small${apartado ? " alt" : ""}" type="button" data-apartar="${r.id}" aria-pressed="${apartado}"${agotado ? " disabled" : ""}>${agotado ? "Sin existencia" : apartado ? "✓ Apartada" : "Apartar"}<span class="visually-hidden"> ${escapar(r.nombre)}</span></button>
    </li>`;
  }).join("");
  rfVacio.hidden = res.length > 0;
  rfConteo.textContent = `${res.length} ${res.length === 1 ? "pieza" : "piezas"}` + (ap.length ? ` · ${ap.length} apartada${ap.length > 1 ? "s" : ""} para recoger en el taller (demo)` : "");
}
function refrescarRf() { if (!document.startViewTransition || reduce) return pintarRefacciones(); document.startViewTransition(pintarRefacciones); }
rfForm.addEventListener("input", refrescarRf);
rfForm.addEventListener("submit", (e) => e.preventDefault());
rfCats.addEventListener("click", (e) => {
  const b = e.target.closest(".pill"); if (!b) return;
  catActiva = b.dataset.cat;
  rfCats.querySelectorAll(".pill").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  refrescarRf();
});
rfLista.addEventListener("click", (e) => {
  const b = e.target.closest("[data-apartar]"); if (!b) return;
  const ap = guardado.leer(CLAVE_AP, []), i = ap.indexOf(b.dataset.apartar);
  if (i >= 0) ap.splice(i, 1); else ap.push(b.dataset.apartar);
  guardado.escribir(CLAVE_AP, ap);
  pintarRefacciones();
  rfLista.querySelector(`[data-apartar="${b.dataset.apartar}"]`)?.focus();
});
pintarRefacciones();

/* ---------- Pestañas: una vista por sección, con transición y foco ---------- */
const vistas = [...document.querySelectorAll(".vista")];
const pestanas = [...document.querySelectorAll(".pestanas a")];
let vistaActual = vistas.find((v) => !v.inert) ?? vistas[0];
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function destino(hash) {
  const el = (hash && hash.length > 1 && document.getElementById(decodeURIComponent(hash.slice(1)))) || vistas[0];
  return { el, vista: el.closest(".vista") ?? vistas[0] };
}

function mostrar(vista, el) {
  for (const v of vistas) {
    const activa = v === vista;
    v.classList.toggle("oculta", !activa);
    v.inert = !activa;
  }
  vistaActual = vista;
  for (const a of pestanas) {
    const actual = destino(a.hash).vista === vista;
    if (actual) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  }
  document.title = `${vista.dataset.titulo === "Inicio" ? "" : vista.dataset.titulo + " · "}Motocity Mazatlán · Motos, taller y garantía`;
  // Ir al inicio de la vista, o a la sección pedida si está más abajo dentro de ella
  if (el === vista || el === vista.firstElementChild) window.scrollTo({ top: 0, behavior: "instant" });
  else el.scrollIntoView({ block: "start", behavior: "instant" });
}

function ir(hash, { animar = true, enfocar = true } = {}) {
  const { el, vista } = destino(hash);
  const cambia = vista !== vistaActual;
  const enfocarVista = () => { if (enfocar && cambia) vista.focus({ preventScroll: true }); };
  if (!cambia) {
    const behavior = reduce || !animar ? "instant" : "smooth";
    if (el === vista || el === vista.firstElementChild) window.scrollTo({ top: 0, behavior });
    else el.scrollIntoView({ block: "start", behavior });
    return;
  }
  if (animar && !reduce && document.startViewTransition) {
    document.startViewTransition(() => mostrar(vista, el)).finished.finally(enfocarVista);
  } else { mostrar(vista, el); enfocarVista(); }
  pestanas.find((a) => a.getAttribute("aria-current"))?.scrollIntoView({ block: "nearest", inline: "nearest", container: "nearest" });
}

function navegar(hash) {
  if (location.hash !== hash) history.pushState(null, "", hash);
  ir(hash);
}

document.addEventListener("click", (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute("href") === "#" || a.closest("dialog")) return;
  e.preventDefault();
  navegar(a.hash);
});
addEventListener("popstate", () => ir(location.hash));
ir(location.hash, { animar: false, enfocar: false });
