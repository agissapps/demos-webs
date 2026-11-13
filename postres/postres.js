import "../assets/extras.js";
import "../assets/vistas.js";

// Menú de ejemplo. Para agregar un postre: copia una línea y cambia los datos.
// forma: pastel | vaso | pay | flan | galleta  ·  c1 = color principal, c2 = color de acento, bg = fondo de la ilustración
const postres = [
  { id: "tres-leches", nombre: "Pastel de tres leches", cat: "pastel", forma: "pastel", precio: 65, unidad: "rebanada", desc: "Bizcocho húmedo con crema batida y fresas.", c1: "#F6E3C6", c2: "#D9415E", bg: "#FBE6D2" },
  { id: "chocolate", nombre: "Pastel de chocolate", cat: "pastel", forma: "pastel", precio: 70, unidad: "rebanada", desc: "Tres capas de chocolate con ganache.", c1: "#6B3E26", c2: "#F4A3B2", bg: "#F3DCCB" },
  { id: "zanahoria", nombre: "Pastel de zanahoria", cat: "pastel", forma: "pastel", precio: 68, unidad: "rebanada", desc: "Con nuez y betún de queso crema.", c1: "#D98A3D", c2: "#8CC7A5", bg: "#FCEBD6" },
  { id: "fresas-crema", nombre: "Fresas con crema", cat: "vaso", forma: "vaso", precio: 55, unidad: "vaso", desc: "Fresas frescas con crema dulce y granola.", c1: "#FFF1F3", c2: "#D9415E", bg: "#FDE2E7" },
  { id: "mousse", nombre: "Mousse de maracuyá", cat: "vaso", forma: "vaso", precio: 58, unidad: "vaso", desc: "Ligero, ácido y dulce a la vez.", c1: "#FFE08A", c2: "#E8A33C", bg: "#FFF1CC" },
  { id: "pay-queso", nombre: "Pay de queso", cat: "pay", forma: "pay", precio: 60, unidad: "rebanada", desc: "Base de galleta y mermelada de zarzamora.", c1: "#FFF3D6", c2: "#6E2A57", bg: "#F3E3EE" },
  { id: "pay-limon", nombre: "Pay de limón", cat: "pay", forma: "pay", precio: 55, unidad: "rebanada", desc: "Relleno cremoso de limón con merengue.", c1: "#F2F6B8", c2: "#8CC7A5", bg: "#EAF4D9" },
  { id: "flan", nombre: "Flan napolitano", cat: "pay", forma: "flan", precio: 45, unidad: "pieza", desc: "Receta de la abuela con caramelo.", c1: "#F7C873", c2: "#8A4A1C", bg: "#FCEBD6" },
  { id: "chocoflan", nombre: "Chocoflan", cat: "pay", forma: "flan", precio: 60, unidad: "rebanada", desc: "Mitad pastel de chocolate, mitad flan.", c1: "#F7C873", c2: "#4A2A1A", bg: "#F3DCCB" },
  { id: "avena", nombre: "Galletas de avena", cat: "galleta", forma: "galleta", precio: 90, unidad: "6 piezas", desc: "Con pasas y canela, suaves por dentro.", c1: "#D9A566", c2: "#6B3E26", bg: "#FCEBD6" },
  { id: "chispas", nombre: "Galletas con chispas", cat: "galleta", forma: "galleta", precio: 95, unidad: "6 piezas", desc: "Crujientes con chispas de chocolate.", c1: "#E8B878", c2: "#3B2416", bg: "#FBE6D2" },
];

const dibujos = {
  pastel: (p) => `<ellipse cx="100" cy="128" rx="70" ry="10" fill="#0002"/>
    <path d="M40 118 L40 72 L160 52 L160 118 Z" fill="${p.c1}"/>
    <path d="M40 92 L160 74 L160 84 L40 102Z" fill="${p.c2}" opacity=".85"/>
    <path d="M40 72 L160 52 L160 60 L40 80Z" fill="#fff" opacity=".9"/>
    <path d="M36 72c10-14 26-20 44-23l84-15c4 6 2 14-4 18L40 72z" fill="#fff"/>
    <circle cx="128" cy="34" r="11" fill="${p.c2}"/><path d="M128 23c2-6 8-8 12-6" stroke="#4E8A5F" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  vaso: (p) => `<ellipse cx="100" cy="132" rx="46" ry="7" fill="#0002"/>
    <path d="M58 30 L142 30 L132 128 L68 128 Z" fill="#ffffff" opacity=".7" stroke="#3B241633" stroke-width="2"/>
    <path d="M66 100 L134 100 L132 126 L68 126 Z" fill="${p.c2}" opacity=".9"/>
    <path d="M62 66 L138 66 L134 100 L66 100 Z" fill="${p.c1}"/>
    <path d="M62 66c8-8 16-8 24 0s16 8 26 0 18-8 26 0l1-10H61z" fill="#fff"/>
    <circle cx="86" cy="50" r="10" fill="${p.c2}"/><circle cx="112" cy="46" r="9" fill="${p.c2}"/><circle cx="100" cy="56" r="4" fill="#E8B878"/>`,
  pay: (p) => `<ellipse cx="100" cy="128" rx="74" ry="10" fill="#0002"/>
    <path d="M30 112 L100 40 L170 112 Z" fill="${p.c1}"/>
    <path d="M30 112 L170 112 L166 124 L34 124 Z" fill="#D9A566"/>
    <path d="M58 84 L100 40 L142 84 Z" fill="${p.c2}" opacity=".8"/>
    <path d="M100 40 L106 34" stroke="#D9A566" stroke-width="6" stroke-linecap="round"/>`,
  flan: (p) => `<ellipse cx="100" cy="130" rx="72" ry="10" fill="#0002"/>
    <path d="M48 120 L62 54 Q100 44 138 54 L152 120 Q100 132 48 120Z" fill="${p.c1}"/>
    <path d="M62 54 Q100 44 138 54 Q132 72 124 60 Q114 78 104 58 Q92 76 84 58 Q74 74 62 54Z" fill="${p.c2}"/>
    <ellipse cx="100" cy="50" rx="38" ry="8" fill="${p.c2}"/>`,
  galleta: (p) => `<ellipse cx="100" cy="128" rx="74" ry="9" fill="#0002"/>
    <circle cx="72" cy="88" r="36" fill="${p.c1}"/><circle cx="128" cy="78" r="34" fill="${p.c1}" stroke="#0001" stroke-width="2"/>
    ${[[60, 78], [82, 96], [70, 104], [88, 74], [120, 66], [138, 84], [126, 96], [112, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${p.c2}"/>`).join("")}`,
};

const peso = (n) => "$" + n.toLocaleString("es-MX");
const lista = document.getElementById("lista");
const carrito = new Map();

// Cada tarjeta muestra la foto img/<id>.jpg si existe; si no, queda la ilustración.
function tarjeta(p, pre = "p") {
  return `<li style="view-transition-name:${pre}-${p.id}"><article class="card">
    <div class="foto" style="--ph:${p.bg}">
      <svg viewBox="0 0 200 150" role="img" aria-label="Ilustración de ${p.nombre.toLowerCase()}">${dibujos[p.forma](p)}</svg>
      <img src="img/${p.id}.jpg" width="800" height="600" alt="${p.nombre}" loading="lazy" onerror="this.remove()">
    </div>
    <h3>${p.nombre}</h3>
    <p>${p.desc}</p>
    <footer><span class="price">${peso(p.precio)} <small>${p.unidad}</small></span>
      <button class="add" type="button" data-add="${p.id}">Agregar<span class="visually-hidden"> ${p.nombre}</span></button></footer>
  </article></li>`;
}

function pintar(cat) {
  lista.innerHTML = postres.filter((p) => cat === "todos" || p.cat === cat).map((p) => tarjeta(p)).join("");
}
pintar("todos");
document.getElementById("favoritos").innerHTML = ["tres-leches", "fresas-crema", "pay-queso", "chispas"].map((id) => tarjeta(postres.find((p) => p.id === id), "f")).join("");

// Filtros: la transición de vista reacomoda las tarjetas; sin soporte, se actualiza directo.
const filtros = document.getElementById("filtros");
filtros.addEventListener("click", (e) => {
  const b = e.target.closest("[data-cat]");
  if (!b || b.getAttribute("aria-pressed") === "true") return;
  for (const x of filtros.querySelectorAll("[data-cat]")) x.setAttribute("aria-pressed", String(x === b));
  const update = () => pintar(b.dataset.cat);
  if (document.startViewTransition) document.startViewTransition(update);
  else update();
});

// Carrito
const cartEl = document.getElementById("cart"), totalEl = document.getElementById("total"), badge = document.getElementById("badge");
function pintarCarrito() {
  let total = 0, piezas = 0;
  cartEl.innerHTML = carrito.size ? [...carrito].map(([id, n]) => {
    const p = postres.find((x) => x.id === id);
    total += p.precio * n; piezas += n;
    return `<li><span>${p.nombre}</span><span class="qty">
      <button type="button" data-menos="${id}" aria-label="Quitar uno de ${p.nombre}">−</button>
      <b aria-label="${n} en el pedido">${n}</b>
      <button type="button" data-add="${id}" aria-label="Agregar otro ${p.nombre}">+</button></span></li>`;
  }).join("") : `<li class="empty">Tu pedido está vacío.<a class="btn soft" href="#menu">Elegir postres</a></li>`;
  totalEl.textContent = peso(total);
  badge.textContent = piezas;
  badge.hidden = !piezas;
  badge.setAttribute("aria-label", `${piezas} postres en tu pedido`);
}
pintarCarrito();

const status = document.querySelector("#pedido-form [role=status]");
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]"), menos = e.target.closest("[data-menos]");
  if (add) {
    const id = add.dataset.add;
    carrito.set(id, (carrito.get(id) || 0) + 1);
    pintarCarrito();
    badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop");
    if (add.classList.contains("add")) { add.firstChild.textContent = "Agregado ✓"; setTimeout(() => (add.firstChild.textContent = "Agregar"), 1200); }
  } else if (menos) {
    const id = menos.dataset.menos, n = (carrito.get(id) || 0) - 1;
    n > 0 ? carrito.set(id, n) : carrito.delete(id);
    pintarCarrito();
  }
});

// Fecha mínima: mañana.
const dia = document.getElementById("dia");
const manana = new Date(); manana.setDate(manana.getDate() + 1);
dia.min = manana.toISOString().slice(0, 10);

// Enviar: arma el mensaje y abre WhatsApp. Cambia el número por el del negocio.
const TEL = "520000000000";
document.getElementById("pedido-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!carrito.size) { status.textContent = "Tu pedido está vacío. Agrega al menos un postre desde el menú."; return; }
  const f = e.currentTarget;
  const lineas = [...carrito].map(([id, n]) => `• ${n} × ${postres.find((p) => p.id === id).nombre}`);
  const msg = `Hola, soy ${f.nombre.value}. Quiero pedir:\n${lineas.join("\n")}\nTotal: ${totalEl.textContent}\nEntrega: ${f.entrega.value}, el ${f.dia.value}.`;
  window.open(`https://wa.me/${TEL}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  status.textContent = "Se abrió WhatsApp con tu pedido listo para enviar.";
});
