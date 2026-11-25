// Herramientas AGIS: botón de WhatsApp, aviso del checador y oferta de página web
(() => {
  const TEL = "526693823318";
  const wa = (msg) => `https://wa.me/${TEL}?text=${encodeURIComponent(msg)}`;
  const ICONO = `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.6c-2 0-4-.5-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.9 5.2 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg>`;

  // Botón flotante de WhatsApp
  const boton = document.createElement("a");
  boton.className = "wa-flota";
  boton.href = wa("Hola, vengo de las herramientas de AGIS y quiero más información");
  boton.target = "_blank"; boton.rel = "noopener";
  boton.setAttribute("aria-label", "Escríbenos por WhatsApp");
  boton.innerHTML = ICONO + "<span>¿Dudas? Escríbenos</span>";
  document.body.append(boton);

  // Aviso del checador al entrar (una vez por visita)
  let visto = false;
  try { visto = sessionStorage.getItem("agis-aviso-checador") === "1"; sessionStorage.setItem("agis-aviso-checador", "1"); } catch {}
  if (!visto) {
    const aviso = document.createElement("aside");
    aviso.className = "aviso-flota";
    aviso.setAttribute("aria-label", "Novedad: checador con huella digital");
    aviso.innerHTML = `<img src="/assets/agis/checador.png" alt="" width="96" height="96">
      <div><b>¿Tienes empleados?</b><p>Instalamos checadores con huella digital. Revisa entradas y salidas desde tu celular.</p>
      <a href="${wa("Hola, me interesa el checador con huella digital")}" target="_blank" rel="noopener">Cotizar checador</a></div>
      <button type="button" class="aviso-cerrar" aria-label="Cerrar aviso">×</button><i class="aviso-tiempo" aria-hidden="true"></i>`;
    document.body.append(aviso);
    let quedan = 4000, desde = performance.now(), reloj;
    const cerrar = () => { clearTimeout(reloj); aviso.classList.add("saliendo"); setTimeout(() => aviso.remove(), 300); };
    const correr = () => { desde = performance.now(); reloj = setTimeout(cerrar, quedan); aviso.classList.remove("pausa"); };
    const pausar = () => { clearTimeout(reloj); quedan -= performance.now() - desde; aviso.classList.add("pausa"); };
    aviso.querySelector(".aviso-cerrar").addEventListener("click", cerrar);
    // Si la persona lo está leyendo o lo está usando con el teclado, no se cierra solo
    aviso.addEventListener("mouseenter", pausar); aviso.addEventListener("mouseleave", correr);
    aviso.addEventListener("focusin", pausar); aviso.addEventListener("focusout", correr);
    requestAnimationFrame(() => { aviso.classList.add("visible"); correr(); });
  }

  // Oferta de página web (se abre al descargar el Excel)
  window.agisOfertaWeb = () => {
    let d = document.getElementById("oferta-web");
    if (!d) {
      d = document.createElement("dialog");
      d.id = "oferta-web"; d.className = "oferta-web";
      d.setAttribute("aria-labelledby", "oferta-titulo");
      d.innerHTML = `<button type="button" class="aviso-cerrar" aria-label="Cerrar">×</button>
        <p class="oferta-chip">Tu Excel ya se descargó</p>
        <h2 id="oferta-titulo">Lleva tu negocio a una página web profesional</h2>
        <p>Tu menú, tus precios y tus fotos en una página que se ve perfecto en el celular, aparece en Google y te manda los pedidos directo a tu WhatsApp.</p>
        <ul><li>Hecha a la medida de tu negocio</li><li>Botón para pedir o reservar por WhatsApp</li><li>Lista para compartir en redes</li></ul>
        <div class="oferta-botones"><a class="btn btn-coral" href="${wa("Hola, quiero cotizar una página web para mi negocio")}" target="_blank" rel="noopener">${ICONO}Cotizar mi página web</a>
        <button type="button" class="btn btn-linea" data-cerrar>Ahora no</button></div>`;
      document.body.append(d);
      d.addEventListener("click", (e) => { if (e.target === d || e.target.closest(".aviso-cerrar,[data-cerrar]")) d.close(); });
    }
    if (!d.open) d.showModal();
  };
})();
