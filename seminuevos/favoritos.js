// Favoritos guardados en el navegador de quien visita. Si el almacenamiento no está disponible, la página sigue funcionando sin guardarlos.
const CLAVE = "ruta-segura-favoritos";
let memoria = [];

export function favoritos() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch { return memoria; }
}
function guardar(lista) {
  memoria = lista;
  try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch { /* sin almacenamiento */ }
}
export function alternarFavorito(id) {
  const lista = favoritos();
  const i = lista.indexOf(id);
  if (i >= 0) lista.splice(i, 1); else lista.push(id);
  guardar(lista);
  return i < 0;
}
