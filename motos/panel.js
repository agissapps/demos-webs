import "../assets/nav.js";
import { motos, promos, serviciosPorMarca, ventasPorMarca, serviciosPorMes, tiposDeServicio, fmtPrecio, escapar, guardado, tarifas } from "./motos.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Sesión de demostración ---------- */
const USUARIO = "demo@motocity.mx", CLAVE = "demo1234";
const leerSesion = () => { try { return sessionStorage.getItem("motocity-sesion") === "1"; } catch { return window.__s === true; } };
const escribirSesion = (v) => { window.__s = v; try { v ? sessionStorage.setItem("motocity-sesion", "1") : sessionStorage.removeItem("motocity-sesion"); } catch { /* sin almacenamiento */ } };

const vLogin = $("#vista-login"), vApp = $("#vista-app"), salir = $("#salir");
function mostrar() {
  const on = leerSesion();
  vLogin.hidden = on; vApp.hidden = !on; salir.hidden = !on;
  if (on) { $("#saludo").textContent = "Hola, Demo · Motocity Mazatlán"; ir(location.hash.slice(1) || "resumen", false); }
}
$("#demo-fill").addEventListener("click", () => { $("#u").value = USUARIO; $("#p").value = CLAVE; });
$("#form-login").addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = $("#u").value.trim().toLowerCase() === USUARIO && $("#p").value === CLAVE;
  $("#login-error").hidden = ok;
  if (!ok) return $("#u").focus();
  escribirSesion(true); mostrar(); $("#contenido").focus();
});
salir.addEventListener("click", () => { escribirSesion(false); $("#form-login").reset(); mostrar(); });

/* ---------- Navegación del panel ---------- */
function ir(id, foco = true) {
  if (!$("#s-" + id)) id = "resumen";
  $$("#vista-app .main > section").forEach((s) => s.classList.toggle("on", s.id === "s-" + id));
  $$("#menu-panel button").forEach((b) => b.toggleAttribute("aria-current", b.dataset.ir === id));
  $$("#menu-panel button[aria-current]").forEach((b) => b.setAttribute("aria-current", "page"));
  history.replaceState(null, "", "#" + id);
  if (foco) $("#contenido").focus({ preventScroll: true });
  scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
document.addEventListener("click", (e) => { const b = e.target.closest("[data-ir]"); if (b) ir(b.dataset.ir); });

function aviso(texto) {
  const t = $("#toast"); t.textContent = texto; t.hidden = false;
  clearTimeout(aviso.id); aviso.id = setTimeout(() => (t.hidden = true), 3600);
}

/* ---------- Fotos: se muestra la opción pero no se sube nada ---------- */
for (const drop of $$(".drop")) {
  const input = $("input", drop), msg = $("[data-drop-msg]", drop);
  const nota = (n) => { msg.textContent = n ? `${n} archivo${n > 1 ? "s" : ""} elegido${n > 1 ? "s" : ""}. Es una demo: no se sube ni se guarda nada.` : "Demo: las fotos no se suben ni se guardan."; };
  input.addEventListener("change", () => { nota(input.files.length); input.value = ""; });
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => { e.preventDefault(); drop.classList.remove("over"); nota(e.dataTransfer?.files.length || 0); });
}

/* ---------- Gráficas ---------- */
function barras(sel, datos, clave, alt) {
  const max = Math.max(...datos.map((d) => d.total));
  $(sel).innerHTML = datos.map((d) => `<li><span>${d[clave]}</span><span class="track"><span class="fill${alt ? " alt" : ""}" style="--v:${Math.round(d.total / max * 100)}"></span></span><b>${d.total}</b></li>`).join("");
}
barras("#g-serv", serviciosPorMarca, "marca"); barras("#g-vent", ventasPorMarca, "marca", true); barras("#g-tipo", tiposDeServicio, "tipo");
{ const max = Math.max(...serviciosPorMes.map((d) => d.total));
  $("#g-mes").innerHTML = serviciosPorMes.map((d) => `<li><b>${d.total}</b><span class="col" style="--v:${Math.round(d.total / max * 100)}"></span>${d.mes}</li>`).join(""); }

/* ---------- Datos guardados en el navegador (sólo para la demo) ---------- */
const K = { motos: "motocity-motos-extra", serv: "motocity-servicios", gar: "motocity-garantias", promo: "motocity-promos-off" };
const sembrarServ = [
  { id: 1, moto: "Vento Rocketman 250", placas: "VNT-218-B", tipo: "Servicio de 5,000 km", precio: 1190, paso: 2 },
  { id: 2, moto: "CFMOTO 450SR", placas: "CFM-904-A", tipo: "Frenos", precio: 890, paso: 1 },
  { id: 3, moto: "Triumph Speed 400", placas: "TRI-552-C", tipo: "Servicio de 1,000 km", precio: 0, paso: 3 },
];
const fmtServicio = (p) => (p === 0 ? "Sin costo" : fmtPrecio(p));
const sembrarGar = [
  { id: 1, moto: "Vento Nitrox 200", falla: "Falla intermitente del tablero", estado: "En revisión" },
  { id: 2, moto: "CFMOTO 800MT Touring", falla: "Fuga leve en retén de horquilla", estado: "Aprobada" },
];
const PASOS = ["Recibida", "En diagnóstico", "En proceso", "Lista para entrega"], CLS = ["recibida", "diagnostico", "proceso", "listo"];

/* Inventario */
function pintarInventario() {
  const extra = guardado.leer(K.motos, []);
  const filas = [...extra.map((m) => ({ ...m, nueva: true })), ...motos];
  $("#t-inv-body").innerHTML = filas.map((m) => `<tr><th scope="row" style="font-family:var(--sans);font-style:normal;text-transform:none;letter-spacing:0;font-size:1rem;color:var(--tinta,#fff);background:none">${escapar(m.marca)} ${escapar(m.modelo)} ${m.anio}${m.nueva ? ' <span class="badge s-vigente">Nueva en demo</span>' : ""}</th><td>${m.estado}</td><td>${fmtPrecio(m.promo)}</td><td>${m.vendidas ?? 0}</td></tr>`).join("");
  const total = filas.length;
  $("#kpis").innerHTML = [[total, "Motos en inventario"], [guardado.leer(K.serv, sembrarServ).length, "Servicios abiertos"], [guardado.leer(K.gar, sembrarGar).length, "Garantías en trámite"], [promos.length - guardado.leer(K.promo, []).length, "Promociones activas"]]
    .map(([n, t]) => `<li><strong>${n}</strong><span>${t}</span></li>`).join("");
}
$("#f-subir").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  const precio = Number(d.precio), promo = Math.round(precio * .92 / 100) * 100;
  const colores = ["#e11d27", "#1a1a1f", "#e8590c", "#1d4ed8", "#8b8f97"];
  const m = { id: "extra-" + Date.now(), marca: d.marca, modelo: d.modelo.trim(), tipo: d.tipo, cc: Number(d.cc), anio: Number(d.anio), estado: d.estado, precio, promo, km: 0, color: "Rojo", colorHex: colores[Math.random() * colores.length | 0], vendidas: 0 };
  guardado.escribir(K.motos, [m, ...guardado.leer(K.motos, [])]);
  e.target.reset(); pintarInventario(); aviso("Moto guardada en el inventario de la demo.");
  ir("inventario");
});

/* Servicios */
function pintarServicios() {
  const l = guardado.leer(K.serv, sembrarServ);
  $("#t-serv-body").innerHTML = l.map((s) => `<tr><th scope="row" style="font-family:var(--sans);font-style:normal;text-transform:none;letter-spacing:0;font-size:1rem;color:var(--tinta,#fff);background:none">${escapar(s.moto)}<br><small class="note">${escapar(s.placas)}</small></th><td>${escapar(s.tipo)}</td><td>${fmtServicio(s.precio ?? tarifas[s.tipo]?.[1] ?? 0)}</td>
    <td><span class="badge s-${CLS[s.paso]}">${PASOS[s.paso]}</span><ul class="stepper" aria-hidden="true" style="margin-block-start:.4rem">${PASOS.map((_, i) => `<li class="${i <= s.paso ? "on" : ""}"></li>`).join("")}</ul></td>
    <td>${s.paso < 3 ? `<button class="btn ghost small" type="button" data-avanzar="${s.id}">Avanzar</button>` : ""}</td></tr>`).join("");
}
$("#t-serv-body").addEventListener("click", (e) => {
  const b = e.target.closest("[data-avanzar]"); if (!b) return;
  const l = guardado.leer(K.serv, sembrarServ), s = l.find((x) => String(x.id) === b.dataset.avanzar);
  if (s && s.paso < 3) s.paso++;
  guardado.escribir(K.serv, l); pintarServicios(); pintarInventario();
  aviso(s?.paso === 3 ? "¡Tu moto está lista para entrega!" : "Estado del servicio actualizado.");
});
// Precio estimado según tipo de servicio y cilindrada.
const fServ = $("#f-serv");
const estimar = () => tarifas[fServ.tipo.value]?.[Number(fServ.cc.value)] ?? 0;
function pintarEstimado() {
  const p = estimar();
  $("#v-est").textContent = fmtServicio(p);
  $("#v-est-nota").textContent = p === 0 ? "Promoción: primer servicio sin costo" : "Mano de obra y refacciones básicas";
}
fServ.addEventListener("input", (e) => {
  if (e.target.name === "vin" || e.target.name === "motor") {
    const pos = e.target.selectionStart; e.target.value = e.target.value.toUpperCase(); e.target.setSelectionRange(pos, pos);
  }
  pintarEstimado();
});
fServ.vin.addEventListener("input", () => fServ.vin.setCustomValidity(""));
fServ.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(fServ.vin.value)) { fServ.vin.setCustomValidity("El VIN debe tener 17 letras y números, sin I, O ni Q."); fServ.vin.reportValidity(); return; }
  const d = Object.fromEntries(new FormData(e.target));
  guardado.escribir(K.serv, [{ id: Date.now(), moto: `${d.marca} ${d.modelo}`, placas: d.placas.toUpperCase(), tipo: d.tipo, precio: estimar(), paso: 0 }, ...guardado.leer(K.serv, sembrarServ)]);
  e.target.reset(); pintarEstimado(); pintarServicios(); pintarInventario(); aviso("Servicio registrado. Te avisaremos cuando avance.");
});
pintarEstimado();

/* Garantías */
function pintarGarantias() {
  const l = guardado.leer(K.gar, sembrarGar);
  const cls = { "En revisión": "revision", Aprobada: "aprobada", Recibida: "vigente" };
  $("#t-gar-body").innerHTML = l.map((g) => `<tr><th scope="row" style="font-family:var(--sans);font-style:normal;text-transform:none;letter-spacing:0;font-size:1rem;color:var(--tinta,#fff);background:none">${escapar(g.moto)}</th><td>${escapar(g.falla)}</td><td><span class="badge s-${cls[g.estado] || "vigente"}">${g.estado}</span></td></tr>`).join("");
}
$("#f-gar").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  guardado.escribir(K.gar, [{ id: Date.now(), moto: `${d.marca} ${d.modelo}`, falla: d.falla.trim(), estado: "Recibida" }, ...guardado.leer(K.gar, sembrarGar)]);
  e.target.reset(); pintarGarantias(); pintarInventario(); aviso("Garantía enviada. Un asesor la revisará.");
});

/* Promociones */
function pintarPromos() {
  const off = guardado.leer(K.promo, []);
  $("#p-lista").innerHTML = promos.map((p) => `<li class="promo"><span class="et">${p.etiqueta}</span><h3>${p.titulo}</h3><p>${p.texto}</p>
    <p><button class="btn ghost small" type="button" data-promo="${p.id}" aria-pressed="${!off.includes(p.id)}">${off.includes(p.id) ? "Pausada · Activar" : "Activa · Pausar"}</button></p></li>`).join("");
}
$("#p-lista").addEventListener("click", (e) => {
  const b = e.target.closest("[data-promo]"); if (!b) return;
  const off = guardado.leer(K.promo, []), i = off.indexOf(b.dataset.promo);
  if (i >= 0) off.splice(i, 1); else off.push(b.dataset.promo);
  guardado.escribir(K.promo, off); pintarPromos(); pintarInventario();
});

pintarInventario(); pintarServicios(); pintarGarantias(); pintarPromos(); mostrar();
