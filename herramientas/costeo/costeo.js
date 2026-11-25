// Costeo de platillos e ingeniería de menú — AGIS Web Studio
const CLAVE = "agis-costeo-v1", CLAVE_MENU = "agis-menus-v1";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (t = "") => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nuevoId = () => Math.random().toString(36).slice(2, 9);
const num = (v) => { const x = parseFloat(String(v ?? "").replace(/[$\s]/g, "").replace(/,(?=\d{3}\b)/g, "").replace(",", ".")); return Number.isFinite(x) ? x : null; };
const dinero = (v) => "$" + v.toLocaleString("es-MX", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
const GRUPOS = { estrella: "Estrella", enigma: "Enigma", vaca: "Vaca", perro: "Perro" };
const HACER = { estrella: "Destácalo con foto", enigma: "Promuévelo más", vaca: "Cuida su costo", perro: "Cámbialo o quítalo" };
const tbody = $("#filas");

let filas = (() => { try { const g = JSON.parse(localStorage.getItem(CLAVE)); if (Array.isArray(g?.filas)) return g.filas; } catch {} return []; })();
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify({ filas })); } catch { aviso("Este navegador no deja guardar. Descarga para Excel antes de cerrar la página."); } }
function aviso(t) { $("#aviso").textContent = t; }

/* ---------- Cálculos ---------- */
function calcular() {
  const res = new Map();
  const listos = filas.map((f) => ({ f, c: num(f.c), p: num(f.p), v: num(f.v) })).filter((x) => x.c !== null && x.p > 0);
  const vendidos = listos.filter((x) => x.v !== null && x.v >= 0);
  const totV = vendidos.reduce((a, x) => a + x.v, 0);
  // Umbrales de la matriz: 70% de lo que vende un platillo promedio, y la ganancia promedio ponderada por ventas
  const popMin = vendidos.length ? (totV / vendidos.length) * 0.7 : 0;
  const margenProm = totV ? vendidos.reduce((a, x) => a + (x.p - x.c) * x.v, 0) / totV : 0;
  for (const f of filas) {
    const c = num(f.c), p = num(f.p), v = num(f.v), r = {};
    if (c !== null && p > 0) { r.pct = (c / p) * 100; r.m = p - c; }
    if (r.m !== undefined && v !== null && totV > 0) r.g = v >= popMin ? (r.m >= margenProm ? "estrella" : "vaca") : r.m >= margenProm ? "enigma" : "perro";
    else r.falta = !(p > 0) ? "Falta a cuánto lo vendes" : c === null ? "Falta cuánto te cuesta" : "Falta cuántos vendes";
    res.set(f.id, r);
  }
  const venta = vendidos.reduce((a, x) => a + x.p * x.v, 0);
  return {
    res, totV, nVend: vendidos.length,
    mezcla: venta ? (vendidos.reduce((a, x) => a + x.c * x.v, 0) / venta) * 100 : null,
    ganancia: vendidos.length ? vendidos.reduce((a, x) => a + (x.p - x.c) * x.v, 0) : null,
    altos: [...res.values()].filter((r) => r.pct > 35).length,
  };
}
const sugerido = (c) => Math.ceil(c / 0.3 / 5) * 5;

/* ---------- Pintar ---------- */
function renderTabla() {
  const campo = (f, k, t, modo, pesos) => `<td class="c-${k}" data-t="${t}"><span class="caja${pesos ? " pesos" : ""}"><input class="num" data-k="${k}" value="${esc(f[k] ?? "")}" inputmode="${modo}" placeholder="0" aria-label="${t}: ${esc(f.n || "este platillo")}"></span></td>`;
  tbody.innerHTML = filas.map((f) => `<tr data-id="${f.id}">
    <td class="c-n"><input data-k="n" value="${esc(f.n)}" placeholder="Nombre del platillo" aria-label="Nombre del platillo" maxlength="60"></td>
    ${campo(f, "c", "Te cuesta hacerlo", "decimal", true)}${campo(f, "p", "Lo vendes en", "decimal", true)}${campo(f, "v", "Vendes por semana", "numeric", false)}
    <td class="calc c-pct" data-t="Costo" data-o="pct"></td><td class="calc c-m" data-t="Ganas en cada uno" data-o="m"></td><td class="c-g" data-t="Qué hacer" data-o="g"></td>
    <td class="c-x"><button type="button" class="quitar" data-quitar aria-label="Quitar ${esc(f.n || "platillo")}" title="Quitar platillo">×</button></td></tr>`).join("");
  $("#vacio").hidden = filas.length > 0;
  actualizar();
}
function actualizar() {
  const k = calcular();
  for (const tr of tbody.rows) {
    const f = filas.find((x) => x.id === tr.dataset.id), r = k.res.get(tr.dataset.id) || {};
    const nivel = r.pct === undefined ? "" : r.pct <= 30 ? "bajo" : r.pct <= 35 ? "medio" : "alto";
    const nota = { bajo: "Bien", medio: "Aceptable", alto: `Te deja poco. Súbelo a ${r.pct > 35 ? dinero(sugerido(num(f.c))) : ""}` }[nivel];
    $("[data-o=pct]", tr).innerHTML = nivel ? `<span class="pct ${nivel}">${Math.round(r.pct)}%</span><small class="${nivel}">${nota}</small>` : `<span class="vacio">—</span>`;
    $("[data-o=m]", tr).innerHTML = r.m !== undefined ? `<span class="${r.m < 0 ? "pct alto" : ""}">${dinero(Math.round(r.m * 100) / 100)}</span>` : `<span class="vacio">—</span>`;
    $("[data-o=g]", tr).innerHTML = r.g ? `<span class="grupo ${r.g}">${GRUPOS[r.g]}</span><small>${HACER[r.g]}</small>` : `<span class="grupo falta">${r.falta}</span>`;
  }
  // Resumen
  const dato = (id, txt, clase = "") => { const d = $(id); $(".dato-n", d).textContent = txt; d.classList.remove("bien", "mal"); if (clase) d.classList.add(clase); };
  dato("#r-costo", k.mezcla === null ? "—" : dinero(Math.round(k.mezcla)), k.mezcla === null ? "" : k.mezcla <= 30 ? "bien" : "mal");
  $("#r-costo").style.setProperty("--ing", k.mezcla === null ? "0%" : `${Math.min(100, k.mezcla)}%`);
  $("#r-costo-s").textContent = k.mezcla === null ? "Lo ideal es $30 o menos" : k.mezcla <= 30 ? "Vas bien: lo ideal es $30 o menos" : "Lo ideal es $30 o menos. Revisa los platillos en rojo.";
  $("#r-alto-s").textContent = k.altos ? "Su costo pasa de 35%. Están marcados en rojo." : "Su costo pasa de 35%";
  dato("#r-ganancia", k.ganancia === null ? "—" : dinero(Math.round(k.ganancia)));
  dato("#r-ventas", k.nVend ? k.totV.toLocaleString("es-MX") : "—");
  $("#r-ventas-s").textContent = filas.length ? `${k.nVend} de ${filas.length} platillos con todos sus datos` : "Pon cuántos vendes de cada uno";
  dato("#r-alto", String(k.altos), k.altos ? "mal" : filas.length ? "bien" : "");
  // Matriz
  for (const g of Object.keys(GRUPOS)) {
    const nombres = filas.filter((f) => k.res.get(f.id)?.g === g).map((f) => f.n.trim() || "Sin nombre");
    $(`.cuad.${g}`).dataset.n = nombres.length;
    $(`.cuad.${g} ul`).innerHTML = nombres.length ? nombres.map((n) => `<li>${esc(n)}</li>`).join("") : `<li class="nada">Ninguno todavía</li>`;
  }
}

/* ---------- Editar ---------- */
tbody.addEventListener("input", (e) => {
  const tr = e.target.closest("tr"), f = filas.find((x) => x.id === tr?.dataset.id);
  if (!f || !e.target.dataset.k) return;
  f[e.target.dataset.k] = e.target.value;
  guardar(); actualizar();
});
tbody.addEventListener("click", (e) => {
  if (!e.target.closest("[data-quitar]")) return;
  const tr = e.target.closest("tr"), i = filas.findIndex((x) => x.id === tr.dataset.id);
  filas.splice(i, 1); guardar(); renderTabla();
  ($$("[data-quitar]", tbody)[Math.min(i, filas.length - 1)] || $("#agregar")).focus();
});
$("#agregar").addEventListener("click", () => {
  filas.push({ id: nuevoId(), n: "", c: "", p: "", v: "" });
  guardar(); renderTabla();
  $$("[data-k=n]", tbody).at(-1)?.focus();
});

/* ---------- Traer del menú ---------- */
const NUMRE = String.raw`\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\d+(?:[.,]\d{1,2})?`;
function partesPrecio(p) {
  return String(p ?? "").split("/").map((t) => t.trim()).filter(Boolean).map((t) => {
    const m = t.match(new RegExp(`^(.*?)\\s*\\$?\\s*(${NUMRE})$`));
    return m ? { et: m[1].trim(), v: m[2] } : null;
  }).filter(Boolean);
}
function leerMenu() { try { const g = JSON.parse(localStorage.getItem(CLAVE_MENU)); return g && Array.isArray(g.secciones) ? g : null; } catch { return null; } }
$("#traer").addEventListener("click", () => {
  const menu = leerMenu();
  if (!menu) { aviso("No encontramos un menú guardado en este equipo. Ármalo primero en «Menú con QR», o agrega tus platillos aquí."); return; }
  let nuevos = 0, actualizados = 0;
  for (const s of menu.secciones) for (const it of s.items) {
    if (!it.n?.trim()) continue;
    const partes = partesPrecio(it.p);
    const lista = partes.length > 1 ? partes.map((x) => ({ n: `${it.n.trim()} (${x.et || "tamaño"})`, p: x.v })) : [{ n: it.n.trim(), p: partes[0]?.v ?? "" }];
    for (const x of lista) {
      const ya = filas.find((f) => f.n.trim().toLowerCase() === x.n.toLowerCase());
      if (ya) { ya.p = x.p; ya.base = it.n.trim(); actualizados++; }
      else { filas.push({ id: nuevoId(), n: x.n, base: it.n.trim(), c: "", p: x.p, v: "" }); nuevos++; }
    }
  }
  guardar(); renderTabla();
  aviso(nuevos || actualizados ? `Listo: ${nuevos} platillos nuevos de «${menu.nombre}»${actualizados ? ` y ${actualizados} precios actualizados` : ""}. Ahora pon cuánto te cuesta cada uno y cuántos vendes por semana.` : "Tu menú no tiene platillos con nombre todavía.");
});

/* ---------- Destacar en el menú ---------- */
$("#destacar").addEventListener("click", () => {
  const menu = leerMenu();
  if (!menu) { aviso("No encontramos un menú guardado en este equipo. Ármalo primero en «Menú con QR»."); return; }
  const k = calcular(), grupoDe = new Map();
  for (const f of filas) {
    const g = k.res.get(f.id)?.g, base = (f.base || f.n.replace(/\s*\(.*\)$/, "")).trim().toLowerCase();
    if (!g) continue;
    const bueno = g === "estrella" || g === "enigma";
    grupoDe.set(base, grupoDe.get(base) || bueno);
  }
  if (!grupoDe.size) { aviso("Primero pon costo, precio y ventas de tus platillos para saber cuáles destacar."); return; }
  const items = menu.secciones.flatMap((s) => s.items).filter((it) => grupoDe.has(it.n?.trim().toLowerCase()));
  const si = items.filter((it) => grupoDe.get(it.n.trim().toLowerCase()));
  if (!si.length) { aviso("Ninguno de los platillos de tu menú es estrella o enigma todavía."); return; }
  if (!confirm(`Se destacarán en tu menú: ${si.map((i) => i.n).join(", ")}.\nLos demás platillos que costeaste dejarán de estar destacados. ¿Continuar?`)) return;
  for (const it of items) it.x = grupoDe.get(it.n.trim().toLowerCase());
  menu.editado = true;
  try { localStorage.setItem(CLAVE_MENU, JSON.stringify(menu)); } catch { aviso("No se pudo guardar el cambio en tu menú."); return; }
  const sinFoto = si.filter((i) => !i.f).length;
  aviso(`Listo: ${si.length} platillos destacados en tu menú.${sinFoto ? ` Ponles foto a ${sinFoto === 1 ? "uno que no tiene" : `los ${sinFoto} que no tienen`} para que salgan en grande.` : ""} Ábrelo en «Ir a mi menú».`);
});

/* ---------- Ejemplo y Excel ---------- */
$("#ejemplo").addEventListener("click", () => {
  filas = [["Al pastor", 7, 22, 420], ["Suadero", 8, 24, 260], ["Tripa", 13, 28, 60], ["Campechano", 9, 26, 90], ["Volcán", 11, 35, 140], ["Gringa", 22, 65, 70], ["Quesadilla", 15, 40, 35], ["Orden de 5 al pastor", 33, 100, 80], ["Horchata (Medio)", 6, 30, 200], ["Refresco de vidrio", 14, 30, 150]]
    .map(([n, c, p, v]) => ({ id: nuevoId(), n, c: String(c), p: String(p), v: String(v) }));
  guardar(); renderTabla();
  aviso("Este es un ejemplo de taquería. Cambia los números por los tuyos o trae los platillos de tu menú.");
});
$("#csv").addEventListener("click", () => {
  if (!filas.length) { aviso("Todavía no hay platillos para descargar."); return; }
  const k = calcular(), q = (t) => `"${String(t ?? "").replace(/"/g, '""')}"`;
  const lineas = [["Platillo", "Costo", "Precio", "Vendidos por semana", "% de costo", "Ganancia por platillo", "Ganancia por semana", "Grupo"].map(q).join(",")];
  for (const f of filas) {
    const r = k.res.get(f.id) || {}, v = num(f.v);
    lineas.push([f.n, num(f.c) ?? "", num(f.p) ?? "", v ?? "", r.pct !== undefined ? r.pct.toFixed(1) : "", r.m !== undefined ? r.m.toFixed(2) : "", r.m !== undefined && v !== null ? (r.m * v).toFixed(2) : "", r.g ? GRUPOS[r.g] : r.falta].map(q).join(","));
  }
  const url = URL.createObjectURL(new Blob(["﻿" + lineas.join("\r\n")], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "costeo-de-platillos.csv"; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  aviso("Archivo descargado. Ábrelo con Excel o Google Sheets.");
});

renderTabla();
