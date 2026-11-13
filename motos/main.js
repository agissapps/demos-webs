import "../assets/nav.js";
import { motos, promos, serviciosPorMarca, ventasPorMarca, serviciosPorMes, tiposDeServicio, fmtPrecio, fmtKm, escapar, imagen, guardado } from "./motos.js";

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
