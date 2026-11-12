// Catálogo de ejemplo. Para agregar un auto, copia un bloque, cambia los datos y pon su foto en img/.
// Si "foto" es null se muestra una ilustración con el color del auto.
export const autos = [
  { id: "aurora-suv-2021", marca: "Aurora", modelo: "Trail 4x4", version: "Advance", anio: 2021, tipo: "SUV", precio: 489000, km: 42000,
    transmision: "Automática", combustible: "Gasolina", motor: "2.0 L turbo", potencia: "250 hp", color: "Negro", colorHex: "#1b1f27", puertas: 5, asientos: 7,
    duenos: 1, ciudad: "Monterrey", foto: "img/auto-suv.jpg",
    equipo: ["Techo panorámico", "Cámara 360°", "Asientos de piel", "Apple CarPlay y Android Auto", "Asistente de carril", "Llantas de 20 pulgadas"] },
  { id: "kora-hatch-2022", marca: "Kora", modelo: "Spin", version: "Comfort", anio: 2022, tipo: "Hatchback", precio: 239000, km: 28000,
    transmision: "Manual", combustible: "Gasolina", motor: "1.5 L", potencia: "114 hp", color: "Blanco", colorHex: "#f3f4f6", puertas: 5, asientos: 5,
    duenos: 1, ciudad: "Guadalajara", foto: "img/auto-hatch.jpg",
    equipo: ["Pantalla de 8 pulgadas", "Cámara de reversa", "Aire acondicionado", "Control de crucero", "Bluetooth"] },
  { id: "norte-sedan-2020", marca: "Norte", modelo: "Vento", version: "Executive", anio: 2020, tipo: "Sedán", precio: 319000, km: 61000,
    transmision: "Automática", combustible: "Gasolina", motor: "2.0 L", potencia: "170 hp", color: "Gris", colorHex: "#6b6f76", puertas: 4, asientos: 5,
    duenos: 2, ciudad: "Ciudad de México", foto: "img/auto-sedan.jpg",
    equipo: ["Sensores de estacionamiento", "Asientos calefactables", "Piel sintética", "Sistema de sonido premium", "Frenado de emergencia"] },
  { id: "robusta-pickup-2019", marca: "Robusta", modelo: "Titán", version: "Doble cabina", anio: 2019, tipo: "Pickup", precio: 459000, km: 78000,
    transmision: "Automática", combustible: "Diésel", motor: "2.8 L turbodiésel", potencia: "200 hp", color: "Negro", colorHex: "#16181d", puertas: 4, asientos: 5,
    duenos: 1, ciudad: "Querétaro", foto: null,
    equipo: ["Tracción 4x4", "Caja con cubierta", "Estribos laterales", "Cámara de reversa", "Capacidad de remolque de 3 toneladas"] },
  { id: "kora-crossover-2023", marca: "Kora", modelo: "Rumbo", version: "Sport", anio: 2023, tipo: "SUV", precio: 379000, km: 15000,
    transmision: "Automática", combustible: "Gasolina", motor: "1.6 L turbo", potencia: "180 hp", color: "Rojo", colorHex: "#b3262d", puertas: 5, asientos: 5,
    duenos: 1, ciudad: "Guadalajara", foto: null,
    equipo: ["Garantía de fábrica vigente", "Pantalla de 10 pulgadas", "Arranque sin llave", "Alerta de punto ciego", "Cargador inalámbrico"] },
  { id: "aurora-van-2021", marca: "Aurora", modelo: "Familia", version: "Plus", anio: 2021, tipo: "Minivan", precio: 355000, km: 53000,
    transmision: "Automática", combustible: "Gasolina", motor: "2.4 L", potencia: "175 hp", color: "Plata", colorHex: "#b8bcc4", puertas: 5, asientos: 7,
    duenos: 1, ciudad: "Monterrey", foto: null,
    equipo: ["Puertas laterales eléctricas", "Tres filas de asientos", "Pantalla trasera para pasajeros", "Cámara de reversa", "Aire acondicionado de tres zonas"] },
];

export const fmtPrecio = (n) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
export const fmtKm = (n) => n.toLocaleString("es-MX") + " km";

// Ilustración sencilla de un auto de lado, para los que aún no tienen foto.
export function ilustracion(auto) {
  const c = auto.colorHex;
  const cuerpos = {
    "Pickup": `<path d="M30 140 L30 110 Q30 100 42 98 L150 96 L175 62 Q180 56 190 56 L250 56 Q262 56 268 66 L285 96 L360 98 Q372 100 372 112 L372 140 Z" fill="${c}"/><path d="M180 66 L172 94 L262 94 L252 66 Z M268 70 L282 94 L268 94 Z" fill="#cfe8e1" opacity=".8"/>`,
    "Minivan": `<path d="M28 142 L28 104 Q28 88 46 80 L120 56 Q128 54 138 54 L300 54 Q314 54 322 64 L360 100 Q372 108 372 120 L372 142 Z" fill="${c}"/><path d="M130 62 L118 94 L220 94 L220 62 Z M228 62 L228 94 L296 94 L318 94 L296 62 Z" fill="#cfe8e1" opacity=".8"/>`,
    "SUV": `<path d="M26 142 L26 108 Q26 94 44 90 L110 82 L140 58 Q148 52 160 52 L270 52 Q284 52 292 62 L322 94 L360 100 Q374 104 374 118 L374 142 Z" fill="${c}"/><path d="M150 62 L130 88 L226 88 L226 62 Z M234 62 L234 88 L300 88 L276 62 Z" fill="#cfe8e1" opacity=".8"/>`,
    "default": `<path d="M26 142 L26 112 Q26 100 42 96 L112 88 L150 62 Q158 56 172 56 L252 56 Q266 56 276 66 L304 92 L358 100 Q374 104 374 118 L374 142 Z" fill="${c}"/><path d="M160 66 L134 90 L224 90 L224 66 Z M232 66 L232 90 L296 90 L268 66 Z" fill="#cfe8e1" opacity=".8"/>`,
  };
  const cuerpo = cuerpos[auto.tipo] || cuerpos.default;
  return `<svg viewBox="0 0 400 200" role="img" aria-label="Ilustración de ${auto.marca} ${auto.modelo} color ${auto.color.toLowerCase()}" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="200" fill="#e6f3ef"/><ellipse cx="200" cy="162" rx="170" ry="10" fill="#002941" opacity=".12"/>
    ${cuerpo}
    <circle cx="96" cy="142" r="24" fill="#12181f"/><circle cx="96" cy="142" r="11" fill="#cfd5dc"/>
    <circle cx="304" cy="142" r="24" fill="#12181f"/><circle cx="304" cy="142" r="11" fill="#cfd5dc"/></svg>`;
}

export function imagen(auto, { lazy = true } = {}) {
  return auto.foto
    ? `<img src="${auto.foto}" width="1280" height="720" alt="${auto.marca} ${auto.modelo} ${auto.version} ${auto.anio}, color ${auto.color.toLowerCase()}"${lazy ? ' loading="lazy"' : ""}>`
    : ilustracion(auto);
}
