// Creador de menús con QR — AGIS Web Studio
const WA_AGIS = "526693823318";
const CLAVE = "agis-menus-v1";
const CLAVE_MODO = "agis-menus-modo";
const ANCHOS = { carta: [816, 1056, "8.5in 11in"], horizontal: [1056, 816, "11in 8.5in"], cuadrado: [1080, 1080, "11.25in 11.25in"], historia: [1080, 1920, "11.25in 20in"] };
const FUENTE_MUESTRA = {
  cocina: 'italic 800 1.3rem "Fraunces",serif', botanas: '900 1.45rem "Big Shoulders Display",sans-serif',
  sushi: '500 1.45rem "Cormorant Garamond",serif', tacos: '800 1.5rem "Barlow Condensed",sans-serif',
  italiana: 'italic 600 1.3rem "Bodoni Moda",serif', mariscos: '400 1.35rem "Gloock",serif', dulces: '800 1.3rem "Bricolage Grotesque",sans-serif',
};
const QR_BASE = { activo: true, tipo: "wa", waTel: "", waMsg: "Hola, vi su menú y quiero hacer un pedido", url: "", wifiRed: "", wifiPass: "", texto: "", leyenda: "", color: "#15161B", ojos: "#15161B", fondo: "#FFFFFF", estilo: "suave", forma: "redondo", centro: "nada" };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (t = "") => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const hoja = $("#hoja"), edSec = $("#ed-secciones"), avisoEstado = $("#estado");

function deEjemplo(tema) {
  const p = PLANTILLAS[tema];
  return {
    tema, editado: false, nombre: p.nombre, lema: p.lema, pie: { ...p.pie }, colores: { ...p.colores },
    columnas: p.columnas, formato: "carta", escala: 1, diseno: "lista", sinSigno: false, logo: null, textura: p.textura || "", franja: false,
    portada: p.portada || null, promo: p.promo || "", nota: p.nota || "", redes: p.redes || "",
    secciones: p.secciones.map((s) => ({ titulo: s.titulo, paquete: !!s.paquete, items: s.items.map(([n, d, pr, o = {}]) => ({ n, d, p: pr, f: o.f || (o.x ? `img/estrella-${tema}.png` : null), r: !!o.x, e: o.e || "", x: !!o.x })) })),
    qr: { ...QR_BASE, leyenda: p.leyenda },
  };
}

function leer() {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE));
    if (g && PLANTILLAS[g.tema] && Array.isArray(g.secciones)) {
      const base = deEjemplo(g.tema);
      return { ...base, ...g, pie: { ...base.pie, ...g.pie }, colores: { ...base.colores, ...g.colores }, qr: { ...base.qr, ...g.qr } };
    }
  } catch {}
  return deEjemplo("tacos");
}
let estado = leer();
let modo = "sencillo";
try { modo = localStorage.getItem(CLAVE_MODO) || "sencillo"; } catch {}
if (!["sencillo", "basico", "avanzado"].includes(modo)) modo = "sencillo";

let avisoMemoria = false;
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(estado)); avisoMemoria = false; return; } catch {}
  try {
    const ligero = { ...estado, secciones: estado.secciones.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i, f: i.f && !i.f.startsWith("data:") ? i.f : null })) })) };
    localStorage.setItem(CLAVE, JSON.stringify(ligero));
    if (!avisoMemoria) mostrar("Tus fotos ya no caben en la memoria de este navegador: se guardan los textos y precios, pero las fotos se perderán si cierras la página. Descarga la imagen antes de salir.");
  } catch { if (!avisoMemoria) mostrar("Este navegador no deja guardar el menú. Descarga la imagen o el PDF antes de cerrar la página."); }
  avisoMemoria = true;
}
function mostrar(t) { avisoEstado.textContent = t; }

/* ---------- Rutas tipo "qr.color" ---------- */
const obtener = (ruta) => ruta.split(".").reduce((o, k) => o?.[k], estado);
function asignar(ruta, v) {
  const ks = ruta.split("."); let o = estado;
  ks.slice(0, -1).forEach((k) => (o = o[k]));
  o[ks.at(-1)] = v;
}

/* ---------- Ajustes efectivos según el modo ---------- */
function efectivo() {
  const sen = modo === "sencillo", ava = modo === "avanzado";
  return {
    diseno: sen ? "cuadricula" : ava ? estado.diseno : "lista",
    desc: !sen,
    signo: !(ava && estado.sinSigno),
    cols: sen ? Math.max(2, estado.columnas) : estado.columnas,
    formato: ava ? estado.formato : "carta",
    escala: ava ? estado.escala : 1,
    colores: estado.colores,
  };
}

/* ---------- Utilidades de color ---------- */
function lum(hex) {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

/* ---------- Texto que guarda el QR ---------- */
function textoQR() {
  const q = estado.qr;
  let tipo = modo === "sencillo" ? "wa" : q.tipo;
  if (modo !== "avanzado" && (tipo === "wifi" || tipo === "texto")) tipo = "wa";
  if (tipo === "wa") {
    let num = (modo === "sencillo" ? "" : q.waTel || "").replace(/\D/g, "") || (estado.pie.telefono || "").replace(/\D/g, "");
    if (num.length === 10) num = "52" + num;
    if (num.length < 10) return null;
    return `https://wa.me/${num}` + (q.waMsg ? `?text=${encodeURIComponent(q.waMsg)}` : "");
  }
  if (tipo === "url") {
    let u = q.url.trim(); if (!u) return null;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = "https://" + u;
    return u;
  }
  if (tipo === "wifi") {
    if (!q.wifiRed.trim()) return null;
    const e = (v) => v.replace(/([\\;,:"])/g, "\\$1");
    return q.wifiPass ? `WIFI:T:WPA;S:${e(q.wifiRed)};P:${e(q.wifiPass)};;` : `WIFI:T:nopass;S:${e(q.wifiRed)};;`;
  }
  return q.texto.trim() || null;
}

function estiloQR() {
  const q = estado.qr;
  if (modo === "avanzado") return { color: q.color, ojos: q.ojos, fondo: q.fondo, estilo: q.estilo, forma: q.forma, centro: q.centro };
  const f = estado.colores.fondo, t = estado.colores.tinta;
  const claro = lum(f) > 0.45 && contraste(f, t) >= 4.5;
  return { color: claro ? t : "#15161B", ojos: claro ? t : "#15161B", fondo: claro ? f : "#FFFFFF", estilo: "suave", forma: "redondo", centro: "nada" };
}

/* ---------- Dibujo del QR en SVG ---------- */
function rr(x, y, w, h, [a, b, c, d]) {
  return `M${x + a} ${y}H${x + w - b}${b ? `A${b} ${b} 0 0 1 ${x + w} ${y + b}` : ""}V${y + h - c}${c ? `A${c} ${c} 0 0 1 ${x + w - c} ${y + h}` : ""}H${x + d}${d ? `A${d} ${d} 0 0 1 ${x} ${y + h - d}` : ""}V${y + a}${a ? `A${a} ${a} 0 0 1 ${x + a} ${y}` : ""}Z`;
}
function qrSVG(texto, o) {
  if (typeof qrcode !== "function") return { error: "No se pudo cargar el generador de QR. Revisa tu conexión a internet y recarga la página." };
  if (qrcode.stringToBytesFuncs?.["UTF-8"]) qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
  const logo = o.centro === "logo" && estado.logo;
  const centro = o.centro === "inicial" || logo;
  let q;
  try { q = qrcode(0, centro ? "H" : "M"); q.addData(texto); q.make(); }
  catch { return { error: "El texto es demasiado largo para un QR. Acórtalo." }; }
  const n = q.getModuleCount(), m = 4, T = n + m * 2;
  let k = Math.floor(n * 0.24); if (k % 2 === 0) k++;
  const c0 = (n - k) / 2;
  const ojo = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const tapado = (r, c) => centro && r >= c0 - 1 && r < c0 + k + 1 && c >= c0 - 1 && c < c0 + k + 1;
  const osc = (r, c) => r >= 0 && c >= 0 && r < n && c < n && q.isDark(r, c) && !ojo(r, c) && !tapado(r, c);
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!osc(r, c)) continue;
    const x = c + m, y = r + m;
    if (o.estilo === "cuadro") d += `M${x} ${y}h1v1h-1z`;
    else if (o.estilo === "punto") d += `M${x + 0.08} ${y + 0.5}a.42 .42 0 1 0 .84 0a.42 .42 0 1 0 -.84 0`;
    else if (o.estilo === "suave") d += rr(x + 0.06, y + 0.06, 0.88, 0.88, [0.28, 0.28, 0.28, 0.28]);
    else {
      const u = osc(r - 1, c), b = osc(r + 1, c), l = osc(r, c - 1), dd = osc(r, c + 1), R = 0.5;
      d += rr(x, y, 1, 1, [!u && !l ? R : 0, !u && !dd ? R : 0, !b && !dd ? R : 0, !b && !l ? R : 0]);
    }
  }
  const radios = { cuadro: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], redondo: [[2, 2, 2, 2], [1.3, 1.3, 1.3, 1.3], [0.9, 0.9, 0.9, 0.9]], circulo: [[3.5, 3.5, 3.5, 3.5], [2.5, 2.5, 2.5, 2.5], [1.5, 1.5, 1.5, 1.5]], hoja: [[3, 0, 3, 0], [2, 0, 2, 0], [1.3, 0, 1.3, 0]] }[o.forma] || [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  let anillos = "", pupilas = "";
  for (const [r, c] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
    const x = c + m, y = r + m;
    anillos += rr(x, y, 7, 7, radios[0]) + rr(x + 1, y + 1, 5, 5, radios[1]);
    pupilas += rr(x + 2, y + 2, 3, 3, radios[2]);
  }
  let medio = "";
  if (centro) {
    const x = c0 + m, y = c0 + m;
    medio = `<rect x="${x - 0.5}" y="${y - 0.5}" width="${k + 1}" height="${k + 1}" rx="${(k + 1) * 0.22}" fill="${o.fondo}"/>`;
    if (logo) medio += `<image href="${logo}" x="${x}" y="${y}" width="${k}" height="${k}" preserveAspectRatio="xMidYMid meet"/>`;
    else {
      const ini = esc((estado.nombre.trim()[0] || "A").toUpperCase());
      medio += `<rect x="${x}" y="${y}" width="${k}" height="${k}" rx="${k * 0.22}" fill="${o.ojos}"/><text x="${x + k / 2}" y="${y + k / 2}" fill="${o.fondo}" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="${k * 0.66}" text-anchor="middle" dominant-baseline="central">${ini}</text>`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${T} ${T}" width="${T * 10}" height="${T * 10}" role="img" aria-label="Código QR"${o.estilo === "cuadro" ? ' shape-rendering="crispEdges"' : ""}><rect width="${T}" height="${T}" fill="${o.fondo}"/><path d="${d}" fill="${o.color}"/><path d="${anillos}" fill="${o.ojos}" fill-rule="evenodd"/><path d="${pupilas}" fill="${o.ojos}"/>${medio}</svg>`;
  return { svg };
}

/* ---------- Precio: "95", "Chico 120 / Grande 160", "Por kilo 380" ---------- */
const ETIQUETAS = { picante: "Picante", nuevo: "Nuevo", favorito: "Favorito", veg: "Vegetariano" };
function cifra(t, signo) {
  const v = Number(t.replace(",", "."));
  return (signo ? "$" : "") + v.toLocaleString("es-MX", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
}
function precioHTML(p, signo) {
  const partes = String(p ?? "").split("/").map((x) => x.trim()).filter(Boolean);
  return partes.map((t) => {
    if (/^\d+([.,]\d{1,2})?$/.test(t)) return `<span class="m-var">${cifra(t, signo)}</span>`;
    const m = t.match(/^(.*?)\s*\$?\s*(\d+(?:[.,]\d{1,2})?)$/);
    if (m && m[1]) return `<span class="m-var"><small>${esc(m[1])}</small> ${cifra(m[2], signo)}</span>`;
    return `<span class="m-var">${esc(t)}</span>`;
  }).join("");
}

/* ---------- Tabla de tamaños: si todos los productos de una sección tienen los mismos tamaños ---------- */
function partesPrecio(p) {
  return String(p ?? "").split("/").map((x) => x.trim()).filter(Boolean).map((t) => {
    const m = t.match(/^(.*?)\s*\$?\s*(\d+(?:[.,]\d{1,2})?)$/);
    return m ? { et: m[1].trim(), v: m[2] } : { et: "", v: t };
  });
}
function tamanosComunes(items) {
  if (items.length < 2) return null;
  const firmas = items.map((i) => partesPrecio(i.p).map((x) => x.et.toLowerCase()).join("|"));
  const ets = partesPrecio(items[0].p).map((x) => x.et);
  return ets.length >= 2 && ets.every(Boolean) && firmas.every((f) => f === firmas[0]) ? ets : null;
}

/* ---------- Hoja del menú ---------- */
let qrActual = null;
const conTexto = (i) => i.n.trim() || i.p.trim();
function fotoHTML(i, clase = "m-foto") { return i.f ? `<img class="${clase}${i.r ? " recorte" : ""}" src="${esc(i.f)}" alt="">` : ""; }
function itemMenu(i, e) {
  const conFoto = e.diseno !== "lista" && i.f;
  return `<li class="m-item${conFoto ? " con-foto" : ""}">${conFoto ? fotoHTML(i) : ""}
    <div class="m-txt"><div class="m-fila"><span class="m-n">${esc(i.n)}${i.e && ETIQUETAS[i.e] ? ` <em class="m-et m-et-${i.e}">${ETIQUETAS[i.e]}</em>` : ""}</span><span class="m-guia"></span><span class="m-p">${precioHTML(i.p, e.signo)}</span></div>
    ${e.desc && i.d.trim() ? `<p class="m-d">${esc(i.d)}</p>` : ""}</div></li>`;
}
function renderHoja() {
  const e = efectivo(), c = e.colores;
  hoja.dataset.tema = estado.tema;
  hoja.dataset.formato = e.formato;
  hoja.dataset.fotos = e.diseno;
  hoja.dataset.textura = modo === "avanzado" || estado.textura ? estado.textura : "";
  hoja.dataset.franja = modo === "avanzado" && estado.franja && estado.portada ? "si" : "no";
  hoja.style.cssText = `--m-fondo:${c.fondo};--m-tinta:${c.tinta};--m-acento:${c.acento};--m-precio:${c.precio};--m-cols:${e.cols};--m-escala:${e.escala};--zoom:${hoja.style.getPropertyValue("--zoom") || 1}`;

  const destacados = modo === "sencillo" ? [] : estado.secciones.flatMap((s) => s.items.filter((i) => i.x && conTexto(i)));
  const estrella = destacados.find((i) => i.f && i.r) || destacados.find((i) => i.f);
  const resto = destacados.filter((i) => i !== estrella);
  const estrellaHTML = estrella ? `<section class="m-estrella"><div class="m-estrella-txt"><p class="m-estrella-et">Lo más pedido</p><p class="m-estrella-n">${esc(estrella.n)}</p>${estrella.d.trim() ? `<p class="m-d">${esc(estrella.d)}</p>` : ""}</div>
    <div class="m-estrella-foto${estrella.r ? "" : " foto-entera"}"><img src="${esc(estrella.f)}" alt=""><span class="m-sello">${precioHTML(estrella.p, e.signo)}</span></div></section>` : "";
  const destHTML = estrellaHTML + (resto.length ? `<section class="m-destacado"><h3 class="m-dest-t">Lo más pedido</h3><ul class="m-dest-items">${resto.map((i) => `
    <li class="m-dest${i.f ? " con-foto" : ""}">${fotoHTML(i, "m-dest-foto")}<div class="m-dest-txt"><p class="m-dest-n">${esc(i.n)}</p>${i.d.trim() ? `<p class="m-d">${esc(i.d)}</p>` : ""}<p class="m-p">${precioHTML(i.p, e.signo)}</p></div></li>`).join("")}</ul></section>` : "");

  const secs = estado.secciones.map((s) => ({ ...s, items: s.items.filter((i) => conTexto(i) && !(i.x && modo !== "sencillo")) })).filter((s) => s.items.length);
  const cuerpo = secs.length || destacados.length ? secs.map((s) => `
    <section class="m-sec${s.paquete && modo !== "sencillo" ? " m-paquetes" : ""}">
      ${s.titulo.trim() ? `<h3 class="m-sec-t">${esc(s.titulo)}</h3>` : ""}
      ${(() => {
        const tam = e.diseno === "lista" ? tamanosComunes(s.items) : null;
        if (!tam) return `<ul class="m-items">${s.items.map((i) => itemMenu(i, e)).join("")}</ul>`;
        return `<div class="m-tabla" style="--n:${tam.length}"><div class="m-tabla-cab"><span></span>${tam.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
          <ul class="m-items">${s.items.map((i) => `<li class="m-item m-tabla-fila"><div class="m-txt"><span class="m-n">${esc(i.n)}${i.e && ETIQUETAS[i.e] ? ` <em class="m-et m-et-${i.e}">${ETIQUETAS[i.e]}</em>` : ""}</span>${e.desc && i.d.trim() ? `<p class="m-d">${esc(i.d)}</p>` : ""}</div>${partesPrecio(i.p).map((x) => `<span class="m-p">${cifra(x.v, e.signo)}</span>`).join("")}</li>`).join("")}</ul></div>`;
      })()}
    </section>`).join("") : `<p class="m-vacio">Agrega tus productos en el paso 3 y aparecerán aquí.</p>`;

  const p = estado.pie, completo = modo !== "sencillo";
  const datos = [completo && p.direccion && `<p>${esc(p.direccion)}</p>`, p.telefono && `<p class="tel">${esc(p.telefono)}</p>`, completo && p.horario && `<p>${esc(p.horario)}</p>`, completo && estado.redes.trim() && `<p class="redes">${esc(estado.redes)}</p>`].filter(Boolean).join("");

  let qrHTML = "";
  qrActual = null;
  const txt = estado.qr.activo ? textoQR() : null;
  if (txt) {
    const r = qrSVG(txt, estiloQR());
    if (r.svg) { qrActual = r.svg; qrHTML = `<figure class="m-qr">${r.svg}${estado.qr.leyenda.trim() ? `<figcaption>${esc(estado.qr.leyenda)}</figcaption>` : ""}</figure>`; }
  }

  hoja.innerHTML = `
    ${estado.textura ? '<div class="m-textura" aria-hidden="true"></div>' : ""}
    ${estado.portada ? `<div class="m-portada"><img src="${esc(estado.portada)}" alt=""></div>` : ""}
    <header class="m-cab" data-inicial="${esc((estado.nombre.trim()[0] || "").toUpperCase())}">
      ${estado.logo ? `<img class="m-logo" src="${esc(estado.logo)}" alt="">` : ""}
      <h2 class="m-nombre">${esc(estado.nombre)}</h2>
      ${estado.lema.trim() ? `<p class="m-lema">${esc(estado.lema)}</p>` : ""}
    </header>
    ${completo && estado.promo.trim() ? `<p class="m-promo">${esc(estado.promo)}</p>` : ""}
    ${destHTML}
    <div class="m-secciones">${cuerpo}</div>
    ${completo && estado.nota.trim() ? `<p class="m-nota">${esc(estado.nota)}</p>` : ""}
    ${datos || qrHTML ? `<footer class="m-pie"><div class="m-datos">${datos}</div>${qrHTML}</footer>` : ""}`;
  ajustarZoom();
  renderQRPanel(txt);
}

/* ---------- Vista del QR en el panel ---------- */
function renderQRPanel(txt) {
  const vista = $("#qr-vista"), aviso = $("#qr-aviso"), q = estado.qr;
  $$("[data-qr]").forEach((el) => (el.hidden = el.dataset.qr !== (modo !== "avanzado" && ["wifi", "texto"].includes(q.tipo) ? "wa" : q.tipo)));
  const msgs = [];
  if (!q.activo) { vista.innerHTML = ""; if (modo !== "sencillo") msgs.push("El QR está apagado. Actívalo arriba para ponerlo en el menú y descargarlo."); }
  else if (!txt) {
    vista.innerHTML = "";
    msgs.push(modo === "sencillo" || q.tipo === "wa" || (modo !== "avanzado" && ["wifi", "texto"].includes(q.tipo)) ? "Escribe un teléfono de 10 dígitos para crear el QR." : "Llena el dato de arriba para crear el QR.");
  } else {
    const o = estiloQR(), r = qrSVG(txt, o);
    vista.innerHTML = r.svg || "";
    if (r.error) msgs.push(r.error);
    if (modo === "avanzado") {
      if (contraste(o.color, o.fondo) < 4 || contraste(o.ojos, o.fondo) < 4) msgs.push("Los colores del QR se parecen mucho al fondo y puede que no se escanee. Usa un color más oscuro para los cuadritos.");
      else if (lum(o.color) > lum(o.fondo)) msgs.push("Cuadritos claros sobre fondo oscuro: algunos celulares no lo leen. Lo más seguro es oscuro sobre claro.");
    }
  }
  aviso.textContent = msgs.join(" ");
}

/* ---------- Zoom de la vista previa ---------- */
const tapete = $(".tapete");
function ajustarZoom() {
  const [w] = ANCHOS[efectivo().formato];
  const cs = getComputedStyle(tapete);
  const disp = tapete.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  if (disp <= 0) return;
  hoja.style.setProperty("--zoom", Math.min(1, disp / w).toFixed(4));
}
new ResizeObserver(ajustarZoom).observe(tapete);

/* ---------- Selector de tipo ---------- */
$("#tipos").innerHTML = Object.entries(PLANTILLAS).map(([k, p]) => `
  <label class="tipo" style="--t-fondo:${p.colores.fondo};--t-acento:${p.colores.acento};--t-fuente:${esc(FUENTE_MUESTRA[k])}">
    <input type="radio" name="tipo" value="${k}">
    <span class="muestra" aria-hidden="true">${esc(p.muestra)}</span>
    <span class="nombre-t">${esc(p.etiqueta)}</span>
  </label>`).join("");

/* ---------- Editor de secciones ---------- */
function itemHTML(si, ii, it, total) {
  const id = `${si}-${ii}`, nom = it.n.trim() || "producto";
  return `<div class="item">
    <label class="foto-btn">${it.f ? `<img src="${it.f}" alt="">` : ""}<span${it.f ? ' class="sr"' : ""}>${it.f ? "Cambiar foto" : "Poner foto"}</span>
      <input type="file" accept="image/*" data-foto data-s="${si}" data-i="${ii}" aria-label="${it.f ? "Cambiar" : "Poner"} foto de ${esc(nom)}"></label>
    <div class="campo"><label for="n-${id}">Nombre</label><input id="n-${id}" data-s="${si}" data-i="${ii}" data-k="n" value="${esc(it.n)}" maxlength="60"></div>
    <div class="campo"><label for="p-${id}">Precio</label><input id="p-${id}" data-s="${si}" data-i="${ii}" data-k="p" value="${esc(it.p)}" inputmode="decimal" maxlength="20"></div>
    <div class="campo desc no-sencillo"><label for="d-${id}">Descripción (opcional)</label><textarea id="d-${id}" data-s="${si}" data-i="${ii}" data-k="d" rows="1" maxlength="140">${esc(it.d)}</textarea></div>
    <div class="campo no-sencillo"><label for="e-${id}">Etiqueta</label><select id="e-${id}" data-s="${si}" data-i="${ii}" data-k="e"><option value="">Ninguna</option>${Object.entries(ETIQUETAS).map(([k, v]) => `<option value="${k}"${it.e === k ? " selected" : ""}>${v}</option>`).join("")}</select></div>
    <label class="interruptor chico no-sencillo"><input type="checkbox" role="switch" data-s="${si}" data-i="${ii}" data-k="x"${it.x ? " checked" : ""}> Destacar arriba</label>
    <div class="acc">
      ${ii > 0 ? `<button type="button" class="mini" data-acc="item-subir" data-s="${si}" data-i="${ii}" aria-label="Mover arriba ${esc(nom)}">Mover arriba</button>` : ""}
      ${it.f && !it.r ? `<button type="button" class="mini" data-acc="foto-recortar" data-s="${si}" data-i="${ii}" aria-label="Quitar el fondo de la foto de ${esc(nom)}">Quitar fondo</button>` : ""}
      ${it.f ? `<button type="button" class="mini" data-acc="foto-quitar" data-s="${si}" data-i="${ii}" aria-label="Quitar foto de ${esc(nom)}">Quitar foto</button>` : ""}
      <button type="button" class="mini quitar" data-acc="item-quitar" data-s="${si}" data-i="${ii}" aria-label="Quitar ${esc(nom)}">Quitar</button>
    </div>
  </div>`;
}
function renderEditor() {
  const pal = modo === "sencillo" ? "producto" : "platillo";
  edSec.innerHTML = estado.secciones.map((s, si) => `
    <fieldset class="sec">
      <legend>${modo === "sencillo" ? esc(s.titulo || `Sección ${si + 1}`) : `Sección ${si + 1}`}</legend>
      <div class="sec-cab no-sencillo">
        <div class="campo"><label for="s-${si}">Nombre de la sección</label><input id="s-${si}" data-s="${si}" data-k="titulo" value="${esc(s.titulo)}" maxlength="40"></div>
        ${si > 0 ? `<button type="button" class="mini" data-acc="sec-subir" data-s="${si}" aria-label="Mover arriba la sección ${esc(s.titulo)}">Mover arriba</button>` : ""}
        <button type="button" class="mini quitar" data-acc="sec-quitar" data-s="${si}" aria-label="Quitar sección ${esc(s.titulo)}">Quitar</button>
      </div>
      <label class="interruptor chico no-sencillo"><input type="checkbox" role="switch" data-s="${si}" data-k="paquete"${s.paquete ? " checked" : ""}> Es sección de paquetes o combos</label>
      ${s.items.map((it, ii) => itemHTML(si, ii, it, s.items.length)).join("")}
      <button type="button" class="btn btn-linea add-item" data-acc="item-add" data-s="${si}">Agregar ${pal}</button>
    </fieldset>`).join("");
}

/* ---------- Llenar el formulario con el estado ---------- */
function llenarCampos() {
  $$("[data-ruta]").forEach((el) => {
    const v = obtener(el.dataset.ruta);
    if (el.type === "radio") el.checked = el.value === v;
    else if (el.type === "checkbox") el.checked = !!v;
    else el.value = v ?? "";
  });
  $$('input[name="tipo"]').forEach((r) => (r.checked = r.value === estado.tema));
  $$('input[name="modo"]').forEach((r) => (r.checked = r.value === modo));
  $("#o-escala").textContent = Math.round(estado.escala * 100) + "%";
  $("#quitar-logo").hidden = !estado.logo;
  $("#quitar-portada").hidden = !estado.portada;
  $$("option[data-nivel-op]").forEach((op) => (op.hidden = op.disabled = modo !== "avanzado"));
  if (modo !== "avanzado" && ["wifi", "texto"].includes(estado.qr.tipo)) $("#qr-tipo").value = "wa";
}

let pendiente = 0;
function programar() { cancelAnimationFrame(pendiente); pendiente = requestAnimationFrame(renderHoja); }
function todo() { document.body.dataset.modo = modo; llenarCampos(); renderEditor(); renderHoja(); actualizarPromo(); }

/* ---------- Eventos del formulario ---------- */
const form = $("#editor");
form.addEventListener("submit", (ev) => ev.preventDefault());
form.addEventListener("input", (ev) => {
  const el = ev.target;
  if (el.type === "file") return;
  if (el.name === "tipo") return;
  if (el.dataset.ruta) {
    let v = el.type === "checkbox" ? el.checked : el.value;
    if (el.type === "range") v = Number(v);
    if (el.dataset.ruta === "columnas") v = Number(v);
    if (el.type === "radio" && !el.checked) return;
    asignar(el.dataset.ruta, v);
    if (["nombre", "lema", "pie.telefono", "pie.direccion", "pie.horario"].includes(el.dataset.ruta)) estado.editado = true;
    if (el.dataset.ruta === "escala") $("#o-escala").textContent = Math.round(v * 100) + "%";
        if (el.dataset.ruta === "nombre") actualizarPromo();
  } else if (el.dataset.k) {
    const s = estado.secciones[el.dataset.s];
    const v = el.type === "checkbox" ? el.checked : el.value;
    if (el.dataset.i !== undefined) s.items[el.dataset.i][el.dataset.k] = v; else s[el.dataset.k] = v;
    estado.editado = true;
  } else return;
  guardar(); programar();
});

form.addEventListener("change", async (ev) => {
  const el = ev.target;
  if (el.name === "tipo") return cambiarTipo(el.value);
  if (el.type !== "file" || !el.files[0]) return;
  const archivo = el.files[0];
  try {
    if (el.id === "f-logo") { estado.logo = await procesarImagen(archivo, 500, false); }
    else if (el.id === "f-portada") { estado.portada = await procesarImagen(archivo, 1400, false, true); }
    else {
      const s = el.dataset.s, i = el.dataset.i;
      const original = await procesarImagen(archivo, 1024, false, true);
      el.value = "";
      abrirRecortador(original, s, i);
      return;
    }
    mostrar("");
  } catch {
    mostrar("No se pudo abrir esa imagen. Prueba con una foto JPG o PNG.");
  }
  el.value = "";
  llenarCampos(); guardar(); renderHoja();
});

form.addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-acc]");
  if (!b) return;
  const si = Number(b.dataset.s), ii = Number(b.dataset.i), secs = estado.secciones;
  let foco = null;
  switch (b.dataset.acc) {
    case "item-add": secs[si].items.push({ n: "", d: "", p: "", f: null, e: "", x: false }); foco = `#n-${si}-${secs[si].items.length - 1}`; break;
    case "item-quitar": secs[si].items.splice(ii, 1); foco = `[data-acc="item-add"][data-s="${si}"]`; break;
    case "item-subir": [secs[si].items[ii - 1], secs[si].items[ii]] = [secs[si].items[ii], secs[si].items[ii - 1]]; foco = `#n-${si}-${ii - 1}`; break;
    case "foto-recortar": abrirRecortador(secs[si].items[ii].f, si, ii); return;
    case "foto-quitar": secs[si].items[ii].f = null; secs[si].items[ii].r = false; foco = `[data-foto][data-s="${si}"][data-i="${ii}"]`; break;
    case "sec-quitar":
      if (secs[si].items.some((i) => i.n.trim()) && !confirm(`¿Quitar la sección «${secs[si].titulo}» con todos sus productos?`)) return;
      secs.splice(si, 1); foco = "#add-sec"; break;
    case "sec-subir": [secs[si - 1], secs[si]] = [secs[si], secs[si - 1]]; foco = `#s-${si - 1}`; break;
  }
  estado.editado = true;
  renderEditor(); guardar(); renderHoja();
  if (foco) ($(foco) || $(`[data-acc="item-add"][data-s="${si}"]`))?.focus();
});

$("#add-sec").addEventListener("click", () => {
  estado.secciones.push({ titulo: "Nueva sección", items: [{ n: "", d: "", p: "", f: null, e: "", x: false }] });
  estado.editado = true;
  renderEditor(); guardar(); renderHoja();
  const i = estado.secciones.length - 1; $(`#s-${i}`)?.select();
});

function cambiarTipo(tema) {
  if (!estado.editado) {
    const { logo, qr, formato, escala, diseno, sinSigno, franja } = estado;
    estado = Object.assign(deEjemplo(tema), { logo, formato, escala, diseno, sinSigno, franja });
    estado.qr = { ...qr, leyenda: PLANTILLAS[tema].leyenda };
  } else {
    estado.tema = tema;
    estado.colores = { ...PLANTILLAS[tema].colores };
    estado.textura = PLANTILLAS[tema].textura || "";
  }
  guardar(); todo();
}

$$('input[name="modo"]').forEach((r) => r.addEventListener("change", () => {
  modo = r.value;
  try { localStorage.setItem(CLAVE_MODO, modo); } catch {}
  const abierto = $(".paneles details[open]");
  if (abierto && getComputedStyle(abierto).display === "none") { abierto.open = false; $(".paneles details").open = true; }
  todo();
}));

$("#restaurar-colores").addEventListener("click", () => { estado.colores = { ...PLANTILLAS[estado.tema].colores }; guardar(); llenarCampos(); renderHoja(); });
$("#quitar-portada").addEventListener("click", () => { estado.portada = null; guardar(); llenarCampos(); renderHoja(); $("#f-portada").focus(); });
$("#quitar-logo").addEventListener("click", () => { estado.logo = null; guardar(); llenarCampos(); renderHoja(); $("#f-logo").focus(); });
$("#reiniciar").addEventListener("click", () => {
  if (!confirm("Se borrarán tus productos, fotos y logo, y volverá el menú de ejemplo. ¿Continuar?")) return;
  estado = deEjemplo(estado.tema); guardar(); todo(); mostrar("Listo, empezaste de nuevo con el ejemplo.");
});

/* ---------- Imágenes: recorte y reducción para que quepan en memoria ---------- */
async function procesarImagen(archivo, max, recortar, jpg) {
  const bmp = await createImageBitmap(archivo);
  let sx = 0, sy = 0, sw = bmp.width, sh = bmp.height;
  if (recortar) {
    const r = 4 / 3;
    if (sw / sh > r) { const nw = sh * r; sx = (sw - nw) / 2; sw = nw; } else { const nh = sw / r; sy = (sh - nh) / 2; sh = nh; }
  }
  const k = Math.min(1, max / Math.max(sw, sh));
  const c = document.createElement("canvas");
  c.width = Math.round(sw * k); c.height = Math.round(sh * k);
  c.getContext("2d").drawImage(bmp, sx, sy, sw, sh, 0, 0, c.width, c.height);
  bmp.close?.();
  return recortar || jpg ? c.toDataURL("image/jpeg", 0.82) : c.toDataURL("image/png");
}

/* ---------- Descargas ---------- */
const nombreArchivo = () => (estado.nombre || "menu").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "menu";
function descargar(blob, nombre) {
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = nombre; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
function svgAPng(svg, lado) {
  return new Promise((ok, mal) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = c.height = lado;
      c.getContext("2d").drawImage(img, 0, 0, lado, lado);
      c.toBlob((b) => (b ? ok(b) : mal()), "image/png");
    };
    img.onerror = mal;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}
function svgQRParaBajar() {
  const txt = textoQR();
  return txt ? qrSVG(txt, estiloQR()).svg : null;
}
$("#qr-png").addEventListener("click", async () => {
  const svg = svgQRParaBajar();
  if (!svg) return ($("#qr-aviso").textContent = "Primero llena el dato del QR.");
  try { descargar(await svgAPng(svg, 1200), `qr-${nombreArchivo()}.png`); } catch { $("#qr-aviso").textContent = "No se pudo crear la imagen del QR. Intenta de nuevo."; }
});
$("#qr-svg").addEventListener("click", () => {
  const svg = svgQRParaBajar();
  if (!svg) return ($("#qr-aviso").textContent = "Primero llena el dato del QR.");
  descargar(new Blob([svg], { type: "image/svg+xml" }), `qr-${nombreArchivo()}.svg`);
});

let libImagen = null;
function cargarLib() {
  if (window.htmlToImage) return Promise.resolve(window.htmlToImage);
  return (libImagen ||= new Promise((ok, mal) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js";
    s.onload = () => ok(window.htmlToImage);
    s.onerror = () => { libImagen = null; mal(); };
    document.head.append(s);
  }));
}
cargarLib().catch(() => {});

$("#bajar-png").addEventListener("click", async (ev) => {
  const btn = ev.currentTarget, z = hoja.style.getPropertyValue("--zoom");
  btn.disabled = true; mostrar("Preparando tu imagen…");
  try {
    const lib = await cargarLib();
    await document.fonts.ready;
    const vista = document.body.dataset.vista;
    document.body.dataset.vista = "ver";
    hoja.style.setProperty("--zoom", 1);
    const formato = efectivo().formato;
    const blob = await lib.toBlob(hoja, { width: hoja.offsetWidth, height: hoja.offsetHeight, pixelRatio: formato === "carta" || formato === "horizontal" ? 2 : 1, style: { boxShadow: "none" } });
    document.body.dataset.vista = vista;
    hoja.style.setProperty("--zoom", z);
    if (!blob) throw new Error("vacía");
    const archivo = new File([blob], `menu-${nombreArchivo()}.png`, { type: "image/png" });
    if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [archivo] })) {
      try { await navigator.share({ files: [archivo], title: estado.nombre }); mostrar("Listo."); return; }
      catch (e) { if (e.name === "AbortError") { mostrar(""); return; } }
    }
    descargar(blob, archivo.name);
    mostrar("Imagen descargada. Búscala en tu carpeta de descargas.");
  } catch {
    document.body.dataset.vista = document.querySelector(".cambiar-vista [aria-pressed=true]")?.dataset.vista || "editar";
    hoja.style.setProperty("--zoom", z);
    mostrar("No se pudo crear la imagen. Revisa tu conexión e intenta otra vez, o usa «Imprimir o guardar PDF».");
  } finally { btn.disabled = false; }
});

$("#imprimir").addEventListener("click", () => {
  let st = $("#estilo-pagina");
  if (!st) { st = document.createElement("style"); st.id = "estilo-pagina"; document.head.append(st); }
  st.textContent = `@page{size:${ANCHOS[efectivo().formato][2]};margin:0}`;
  window.print();
});

/* ---------- Cambiar vista en celular ---------- */
$$(".cambiar-vista button").forEach((b) => b.addEventListener("click", () => {
  document.body.dataset.vista = b.dataset.vista;
  $$(".cambiar-vista button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  scrollTo({ top: 0 });
  ajustarZoom();
}));

function actualizarPromo() {
  $("#promo").href = `https://wa.me/${WA_AGIS}?text=${encodeURIComponent(`Hola, armé el menú de ${estado.nombre || "mi negocio"} en su herramienta y me interesa una página web con pedidos por WhatsApp`)}`;
}

/* Arranque: si el script de QR tarda, se vuelve a dibujar al terminar de cargar */
todo();
addEventListener("load", renderHoja);

/* ---------- Recortador de fotos: toca el platillo y se quita el fondo (MediaPipe, en el navegador) ---------- */
const MP = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
const MODELO = "https://storage.googleapis.com/mediapipe-models/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite";
let segmentador = null;
async function cargarSegmentador() {
  if (segmentador) return segmentador;
  const { FilesetResolver, InteractiveSegmenter } = await import(MP + "/vision_bundle.mjs");
  const vision = await FilesetResolver.forVisionTasks(MP + "/wasm");
  segmentador = await InteractiveSegmenter.createFromOptions(vision, { baseOptions: { modelAssetPath: MODELO }, outputCategoryMask: true, outputConfidenceMasks: false });
  return segmentador;
}
const dlg = $("#recortador"), dlgImg = $("#rec-foto"), dlgRes = $("#rec-resultado"), dlgAviso = $("#rec-aviso");
let rec = null;
function cargarImg(src) { return new Promise((ok, mal) => { const im = new Image(); im.onload = () => ok(im); im.onerror = mal; im.src = src; }); }
function abrirRecortador(src, si, ii) {
  rec = { src, si: Number(si), ii: Number(ii), salida: null };
  dlgImg.src = src; dlgRes.hidden = true; dlgImg.hidden = false; $("#rec-usar").disabled = true;
  dlgAviso.textContent = "Toca el platillo en la foto para quitarle el fondo.";
  dlg.showModal();
  cargarSegmentador().catch(() => { dlgAviso.textContent = "No se pudo cargar el recorte automático. Revisa tu conexión, o usa «Recortar en círculo»."; });
}
function recortarAlContenido(c) {
  const ctx = c.getContext("2d"), { width: w, height: h } = c, d = ctx.getImageData(0, 0, w, h).data;
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 <= x0 || y1 <= y0) return null;
  const pad = 8, sx = Math.max(0, x0 - pad), sy = Math.max(0, y0 - pad), sw = Math.min(w, x1 + pad) - sx, sh = Math.min(h, y1 + pad) - sy;
  const k = Math.min(1, 720 / Math.max(sw, sh)), o = document.createElement("canvas");
  o.width = Math.round(sw * k); o.height = Math.round(sh * k);
  o.getContext("2d").drawImage(c, sx, sy, sw, sh, 0, 0, o.width, o.height);
  return o.toDataURL("image/png");
}
function mostrarResultado(url, texto) {
  rec.salida = url; dlgRes.src = url; dlgRes.hidden = false; dlgImg.hidden = true;
  $("#rec-usar").disabled = false; dlgAviso.textContent = texto;
}
dlgImg.addEventListener("click", async (ev) => {
  if (!rec) return;
  const r = dlgImg.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
  dlgAviso.textContent = "Recortando…";
  try {
    const seg = await cargarSegmentador(), im = await cargarImg(rec.src);
    const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight;
    const ctx = c.getContext("2d"); ctx.drawImage(im, 0, 0);
    const res = seg.segment(c, { keypoint: { x: px, y: py } });
    const m = res.categoryMask, datos = m.getAsUint8Array(), mw = m.width, mh = m.height;
    const elegido = datos[Math.min(mh - 1, Math.floor(py * mh)) * mw + Math.min(mw - 1, Math.floor(px * mw))];
    const mc = document.createElement("canvas"); mc.width = mw; mc.height = mh;
    const mctx = mc.getContext("2d"), md = mctx.createImageData(mw, mh);
    let cuenta = 0;
    for (let i = 0; i < datos.length; i++) if (datos[i] === elegido) { md.data[i * 4 + 3] = 255; cuenta++; }
    m.close(); res.close?.();
    if (cuenta < datos.length * 0.02) { dlgAviso.textContent = "No encontré el platillo ahí. Toca justo en el centro de la comida."; return; }
    mctx.putImageData(md, 0, 0);
    ctx.globalCompositeOperation = "destination-in"; ctx.filter = "blur(1.5px)";
    ctx.drawImage(mc, 0, 0, c.width, c.height);
    const url = recortarAlContenido(c);
    if (!url) { dlgAviso.textContent = "No encontré el platillo ahí. Toca justo en el centro de la comida."; return; }
    mostrarResultado(url, "Así quedó. Si se comió parte del plato, toca «Probar otra vez» y toca otro punto de la comida.");
  } catch {
    dlgAviso.textContent = "No se pudo recortar automáticamente. Usa «Recortar en círculo» o deja la foto completa.";
  }
});
$("#rec-circulo").addEventListener("click", async () => {
  const im = await cargarImg(rec.src), lado = Math.min(im.naturalWidth, im.naturalHeight), out = Math.min(720, lado);
  const c = document.createElement("canvas"); c.width = c.height = out;
  const ctx = c.getContext("2d");
  ctx.beginPath(); ctx.arc(out / 2, out / 2, out / 2 - 2, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(im, (im.naturalWidth - lado) / 2, (im.naturalHeight - lado) / 2, lado, lado, 0, 0, out, out);
  mostrarResultado(c.toDataURL("image/png"), "Recortado en círculo. Funciona mejor si el plato está al centro de la foto.");
});
$("#rec-otra").addEventListener("click", () => { dlgRes.hidden = true; dlgImg.hidden = false; $("#rec-usar").disabled = true; dlgAviso.textContent = "Toca el platillo en la foto para quitarle el fondo."; });
function guardarFotoProducto(url, recortada) {
  const it = estado.secciones[rec.si]?.items[rec.ii];
  if (!it) return;
  it.f = url; it.r = recortada; estado.editado = true;
  renderEditor(); guardar(); renderHoja();
  $(`[data-foto][data-s="${rec.si}"][data-i="${rec.ii}"]`)?.focus();
}
$("#rec-usar").addEventListener("click", () => { guardarFotoProducto(rec.salida, true); dlg.close(); });
$("#rec-completa").addEventListener("click", async () => {
  const it = estado.secciones[rec.si]?.items[rec.ii];
  const yaEsSuya = it && it.f === rec.src;
  if (!yaEsSuya) { const blob = await (await fetch(rec.src)).blob(); guardarFotoProducto(await procesarImagen(blob, 640, true), false); }
  dlg.close();
});
