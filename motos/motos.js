// Datos de ejemplo de la demo. Marcas reales del flyer; modelos, precios y cifras son inventados.
// Para agregar una moto al catálogo: copia un bloque, cambia los datos y pon su foto en img/ (o deja foto: null).
export const motos = [
  { id: "vento-rocketman-250", marca: "Vento", modelo: "Rocketman 250", tipo: "Naked", cc: 250, anio: 2026, estado: "Nueva", precio: 52900, promo: 47900, km: 0, color: "Rojo", colorHex: "#d7191f", potencia: "21 hp", transmision: "6 velocidades", abs: true, foto: "img/rocketman-roja.jpg", vendidas: 38,
    equipo: ["Tablero digital", "Faro LED", "Frenos de disco", "Garantía de fábrica 2 años"] },
  { id: "vento-crossmax-250", marca: "Vento", modelo: "Crossmax 250", tipo: "Doble propósito", cc: 250, anio: 2026, estado: "Nueva", precio: 61900, promo: 56900, km: 0, color: "Naranja", colorHex: "#e8590c", potencia: "23 hp", transmision: "6 velocidades", abs: true, foto: "img/doble-proposito.jpg", vendidas: 29,
    equipo: ["Suspensión de recorrido largo", "Protector de motor", "Faro LED", "Tablero digital"] },
  { id: "vento-nitrox-200", marca: "Vento", modelo: "Nitrox 200", tipo: "Deportiva", cc: 200, anio: 2025, estado: "Nueva", precio: 44900, promo: 39900, km: 0, color: "Negro", colorHex: "#1a1a1f", potencia: "18 hp", transmision: "6 velocidades", abs: false, foto: "img/deportiva-negra.jpg", vendidas: 24,
    equipo: ["Carenado completo", "Escape deportivo", "Frenos de disco", "Luz de día LED"] },
  { id: "vento-urban-150", marca: "Vento", modelo: "Urban 150", tipo: "Scooter", cc: 150, anio: 2026, estado: "Nueva", precio: 32900, promo: 29900, km: 0, color: "Blanco", colorHex: "#eceef1", potencia: "11 hp", transmision: "Automática", abs: false, foto: "img/scooter.jpg", vendidas: 52,
    equipo: ["Cajuela bajo el asiento", "Puerto USB", "Arranque sin llave", "Bajo consumo"] },
  { id: "cfmoto-450sr", marca: "CFMOTO", modelo: "450SR", tipo: "Deportiva", cc: 450, anio: 2026, estado: "Nueva", precio: 119900, promo: 109900, km: 0, color: "Rojo", colorHex: "#c8102e", potencia: "50 hp", transmision: "6 velocidades", abs: true, foto: "img/hero.jpg", vendidas: 17,
    equipo: ["ABS de doble canal", "Pantalla TFT", "Quickshifter", "Control de tracción"] },
  { id: "cfmoto-800mt", marca: "CFMOTO", modelo: "800MT Touring", tipo: "Touring", cc: 800, anio: 2026, estado: "Nueva", precio: 219900, promo: 204900, km: 0, color: "Gris y rojo", colorHex: "#8b8f97", potencia: "94 hp", transmision: "6 velocidades", abs: true, foto: "img/touring.jpg", vendidas: 9,
    equipo: ["Maletas laterales", "Pantalla TFT conectada", "Suspensión ajustable", "Control de crucero"] },
  { id: "cfmoto-300cl-x", marca: "CFMOTO", modelo: "300CL-X", tipo: "Naked", cc: 300, anio: 2025, estado: "Nueva", precio: 78900, promo: 72900, km: 0, color: "Negro", colorHex: "#222228", potencia: "29 hp", transmision: "6 velocidades", abs: true, foto: "img/retro.jpg", vendidas: 21,
    equipo: ["Estilo neo-retro", "Faro redondo LED", "ABS", "Embrague deslizante"] },
  { id: "cfmoto-papio-125", marca: "CFMOTO", modelo: "Papio 125", tipo: "Miniatura", cc: 125, anio: 2025, estado: "Nueva", precio: 36900, promo: 33900, km: 0, color: "Verde", colorHex: "#2f8f5b", potencia: "9 hp", transmision: "4 velocidades", abs: false, foto: "img/mini-verde.jpg", vendidas: 14,
    equipo: ["Ligera y fácil de manejar", "Ideal para primera moto", "Tablero LCD"] },
  { id: "triumph-speed-400", marca: "Triumph", modelo: "Speed 400", tipo: "Naked", cc: 400, anio: 2026, estado: "Nueva", precio: 114900, promo: 106900, km: 0, color: "Negro", colorHex: "#111114", potencia: "40 hp", transmision: "6 velocidades", abs: true, foto: "img/naked.jpg", vendidas: 15,
    equipo: ["Control de tracción", "ABS", "Faro LED", "Acelerador electrónico"] },
  { id: "triumph-trident-660", marca: "Triumph", modelo: "Trident 660", tipo: "Naked", cc: 660, anio: 2026, estado: "Nueva", precio: 189900, promo: 179900, km: 0, color: "Plata", colorHex: "#aeb2ba", potencia: "81 hp", transmision: "6 velocidades", abs: true, foto: "img/tricilindrica.jpg", vendidas: 8,
    equipo: ["Tres cilindros", "Modos de manejo", "Pantalla TFT", "Quickshifter opcional"] },
  { id: "triumph-bonneville-t120", marca: "Triumph", modelo: "Bonneville T120", tipo: "Crucero", cc: 1200, anio: 2024, estado: "Seminueva", precio: 238000, promo: 224000, km: 6800, color: "Negro", colorHex: "#16161a", potencia: "79 hp", transmision: "6 velocidades", abs: true, foto: "img/crucero.jpg", vendidas: 3,
    equipo: ["Revisada en 80 puntos", "Un solo dueño", "Garantía de 6 meses", "Escapes cromados"] },
  { id: "vento-rocketman-2023", marca: "Vento", modelo: "Rocketman 250", tipo: "Naked", cc: 250, anio: 2023, estado: "Seminueva", precio: 39900, promo: 36900, km: 14200, color: "Azul", colorHex: "#1d4ed8", potencia: "21 hp", transmision: "6 velocidades", abs: true, foto: "img/rocketman-azul.jpg", vendidas: 5,
    equipo: ["Servicios al corriente", "Factura original", "Garantía de 6 meses"] },
];

// Estadísticas de ejemplo: marcas que más entran a servicio y las que más se venden.
export const serviciosPorMarca = [
  { marca: "Vento", total: 142 }, { marca: "CFMOTO", total: 76 }, { marca: "Triumph", total: 41 }, { marca: "Otras", total: 23 },
];
export const ventasPorMarca = [
  { marca: "Vento", total: 143 }, { marca: "CFMOTO", total: 61 }, { marca: "Triumph", total: 26 },
];
export const serviciosPorMes = [
  { mes: "Jun", total: 38 }, { mes: "Jul", total: 44 }, { mes: "Ago", total: 41 }, { mes: "Sep", total: 52 }, { mes: "Oct", total: 63 }, { mes: "Nov", total: 44 },
];
export const tiposDeServicio = [
  { tipo: "Servicio de 5,000 km", total: 96 }, { tipo: "Frenos", total: 58 }, { tipo: "Cadena y piñones", total: 47 }, { tipo: "Garantía", total: 39 }, { tipo: "Llantas", total: 29 }, { tipo: "Eléctrico", total: 13 },
];

export const promos = [
  { id: "p1", titulo: "Hasta $10,000 de descuento", texto: "En motos nuevas Vento y CFMOTO seleccionadas durante todo noviembre.", etiqueta: "Descuento" },
  { id: "p2", titulo: "Casco y chamarra de regalo", texto: "Llévate equipo de protección al comprar cualquier moto de más de 250 cc.", etiqueta: "Regalo" },
  { id: "p3", titulo: "Primer servicio sin costo", texto: "Tu servicio de 1,000 km va por la casa, con mano de obra y aceite incluidos.", etiqueta: "Taller" },
  { id: "p4", titulo: "Enganche desde 10%", texto: "Mensualidades fijas hasta 36 meses con la financiera de tu preferencia.", etiqueta: "Financiamiento" },
  { id: "p5", titulo: "Garantía extendida a 3 años", texto: "Triumph y CFMOTO con un año más de cobertura al precio del Buen Fin.", etiqueta: "Garantía" },
  { id: "p6", titulo: "Tu moto usada a cuenta", texto: "Valuación en el momento y bono extra de $3,000 en noviembre.", etiqueta: "Retoma" },
];

export const fmtPrecio = (n) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
export const fmtKm = (n) => (n === 0 ? "0 km" : n.toLocaleString("es-MX") + " km");
export const escapar = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Ilustración de moto de lado para los modelos que aún no tienen foto.
export function ilustracion(m) {
  const c = m.colorHex;
  return `<svg viewBox="0 0 400 225" role="img" aria-label="Ilustración de ${escapar(m.marca)} ${escapar(m.modelo)} color ${escapar(m.color.toLowerCase())}" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="g-${m.id}" cx="50%" cy="85%" r="70%"><stop offset="0" stop-color="#d7191f" stop-opacity=".55"/><stop offset="1" stop-color="#111114"/></radialGradient></defs>
  <rect width="400" height="225" fill="url(#g-${m.id})"/>
  <ellipse cx="200" cy="190" rx="165" ry="7" fill="#000" opacity=".5"/>
  <g fill="none"><circle cx="92" cy="152" r="37" stroke="#09090b" stroke-width="12"/><circle cx="312" cy="152" r="37" stroke="#09090b" stroke-width="12"/>
  <circle cx="92" cy="152" r="23" stroke="#9a9aa3" stroke-width="3"/><circle cx="312" cy="152" r="23" stroke="#9a9aa3" stroke-width="3"/></g>
  <path d="M92 152 L142 104 L222 104 L312 152 M142 104 L190 152 L222 104" stroke="#c4c4cc" stroke-width="5" fill="none" stroke-linejoin="round"/>
  <path d="M312 152 L282 82 L270 76" stroke="#c4c4cc" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M146 106 Q158 76 208 80 L246 94 L232 110 Z" fill="${c}"/>
  <path d="M120 96 L152 88 L158 100 L124 108 Z" fill="#0b0b0d"/>
  <path d="M258 74 L292 66 L296 74 L262 82 Z" fill="${c}"/>
  <circle cx="296" cy="84" r="8" fill="#fff4c2"/>
  <path d="M262 70 L276 62" stroke="#ddd" stroke-width="5" stroke-linecap="round"/>
  <path d="M170 150 L232 156 L238 164 L176 160 Z" fill="#6b6b74"/>
  </svg>`;
}

export function imagen(m, { lazy = true } = {}) {
  return m.foto
    ? `<img src="${m.foto}" width="1024" height="576" alt="${escapar(m.marca)} ${escapar(m.modelo)} ${m.anio}, color ${escapar(m.color.toLowerCase())}"${lazy ? ' loading="lazy"' : ""}>`
    : ilustracion(m);
}

// Almacenamiento seguro: si el navegador lo bloquea, la demo sigue funcionando en memoria.
const memoria = new Map();
export const guardado = {
  leer(clave, defecto) { try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : (memoria.get(clave) ?? defecto); } catch { return memoria.get(clave) ?? defecto; } },
  escribir(clave, valor) { memoria.set(clave, valor); try { localStorage.setItem(clave, JSON.stringify(valor)); } catch { /* sin almacenamiento */ } },
};

// Refacciones de ejemplo. "marca" es con qué motos es compatible ("Todas" = universal).
export const refacciones = [
  { id: "r1", nombre: "Kit de arrastre (cadena y piñones)", cat: "Transmisión", marca: "Vento", modelo: "Rocketman 250", precio: 1890, promo: 1690, stock: 6 },
  { id: "r2", nombre: "Balatas delanteras", cat: "Frenos", marca: "CFMOTO", modelo: "450SR", precio: 690, promo: null, stock: 14 },
  { id: "r3", nombre: "Filtro de aceite", cat: "Mantenimiento", marca: "Triumph", modelo: "Speed 400 / Trident 660", precio: 420, promo: null, stock: 22 },
  { id: "r4", nombre: "Aceite sintético 10W-40 (1 L)", cat: "Mantenimiento", marca: "Todas", modelo: "Universal", precio: 289, promo: 249, stock: 60 },
  { id: "r5", nombre: "Bujía de iridio", cat: "Eléctrico", marca: "Vento", modelo: "Línea 150 a 250 cc", precio: 210, promo: null, stock: 30 },
  { id: "r6", nombre: "Batería 12 V 9 Ah", cat: "Eléctrico", marca: "Todas", modelo: "Universal", precio: 1590, promo: 1390, stock: 4 },
  { id: "r7", nombre: "Llanta trasera 130/70-17", cat: "Llantas", marca: "Todas", modelo: "Rin 17", precio: 2350, promo: null, stock: 8 },
  { id: "r8", nombre: "Filtro de aire", cat: "Mantenimiento", marca: "CFMOTO", modelo: "800MT Touring", precio: 780, promo: null, stock: 0 },
  { id: "r9", nombre: "Disco de freno delantero", cat: "Frenos", marca: "Triumph", modelo: "Speed 400", precio: 2150, promo: 1950, stock: 3 },
  { id: "r10", nombre: "Juego de espejos", cat: "Accesorios", marca: "Vento", modelo: "Nitrox 200 / Rocketman 250", precio: 390, promo: null, stock: 18 },
  { id: "r11", nombre: "Casco abatible certificado DOT", cat: "Equipo", marca: "Todas", modelo: "Tallas S a XL", precio: 1990, promo: 1590, stock: 9 },
  { id: "r12", nombre: "Guantes con protección", cat: "Equipo", marca: "Todas", modelo: "Tallas S a XL", precio: 590, promo: null, stock: 0 },
];

// Tarifas de ejemplo para el precio estimado del servicio, según cilindrada.
export const rangosCC = ["Hasta 250 cc", "De 251 a 500 cc", "Más de 500 cc"];
export const tarifas = {
  "Servicio de 1,000 km": [0, 0, 0],
  "Servicio de 5,000 km": [1190, 1690, 2490],
  "Servicio de 10,000 km": [1690, 2290, 3290],
  "Frenos": [690, 890, 1190],
  "Cadena y piñones": [450, 590, 790],
  "Llantas": [350, 450, 550],
  "Eléctrico": [550, 690, 890],
};

// Pago fijo de un crédito: tasa mensual de ejemplo, sólo para la demo.
export const TASA_MENSUAL = 0.025;
export function pagoMensual(monto, meses, tasa = TASA_MENSUAL) {
  if (monto <= 0) return 0;
  return (monto * tasa) / (1 - (1 + tasa) ** -meses);
}
