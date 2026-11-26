// Eventos Presidio
const WHATSAPP = '526691550358'; // 669 155 0358
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Envuelve un cambio de pantalla en una View Transition si el navegador la soporta
function transicion(cambio) {
  if (!document.startViewTransition || sinMovimiento) { cambio(); return Promise.resolve(); }
  return document.startViewTransition(cambio).finished;
}

// ---------- Barra: se vuelve sólida al salir de la portada ----------
const barra = document.querySelector('.barra');
const portada = document.querySelector('.portada');
const revisarBarra = () => barra.classList.toggle('solida', scrollY > portada.offsetHeight - 90);
addEventListener('scroll', revisarBarra, { passive: true });
revisarBarra();

// ---------- Portada: fotos que cambian solas ----------
{
  const fotos = [...document.querySelectorAll('.portada-fotos img')];
  const puntos = [...document.querySelectorAll('.portada-puntos button')];
  const pie = document.getElementById('pie-foto');
  const boton = document.getElementById('pausa-portada');
  const pies = ['El patio del árbol', 'Arco de flores en el patio', 'La terraza', 'Comida bajo las sombrillas', 'Mesas bajo los árboles'];
  let actual = 0;
  let reloj = null;
  let pausada = sinMovimiento;

  const mostrar = (i) => {
    actual = (i + fotos.length) % fotos.length;
    fotos.forEach((f, n) => f.classList.toggle('activa', n === actual));
    puntos.forEach((p, n) => p.setAttribute('aria-pressed', n === actual));
    pie.textContent = pies[actual];
  };
  const arrancar = () => {
    clearInterval(reloj);
    if (!pausada) reloj = setInterval(() => mostrar(actual + 1), 6500);
  };

  puntos.forEach((p, i) => p.addEventListener('click', () => { mostrar(i); arrancar(); }));
  boton.setAttribute('aria-pressed', pausada);
  boton.addEventListener('click', () => {
    pausada = !pausada;
    boton.setAttribute('aria-pressed', pausada);
    boton.setAttribute('aria-label', pausada ? 'Reanudar fotos' : 'Pausar fotos');
    arrancar();
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(reloj) : arrancar()));
  arrancar();
}

// ---------- Recorre la casa: pestañas ----------
{
  const tabs = [...document.querySelectorAll('.pestanas [role="tab"]')];
  const paneles = [...document.querySelectorAll('.panel')];
  const fondos = [...document.querySelectorAll('.casa-fondo img')];

  const detenerVideos = () => document.querySelectorAll('.escena-video').forEach((v) => v.pause());

  const elegir = (tab, enfocar) => {
    if (tab.getAttribute('aria-selected') === 'true') return;
    detenerVideos();
    fondos.forEach((f, i) => f.classList.toggle('activo', tabs[i] === tab));
    transicion(() => {
      tabs.forEach((t, i) => {
        const si = t === tab;
        t.setAttribute('aria-selected', si);
        t.tabIndex = si ? 0 : -1;
        paneles[i].hidden = !si;
      });
    });
    if (enfocar) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t));
    t.addEventListener('keydown', (e) => {
      const mover = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i }[e.key];
      if (mover === undefined) return;
      e.preventDefault();
      elegir(tabs[(i + mover + tabs.length) % tabs.length], true);
    });
  });

  // Miniaturas: cambian la foto grande (o muestran el video)
  document.querySelectorAll('.miniaturas').forEach((lista) => {
    const panel = lista.closest('.panel');
    const foto = panel.querySelector('.escena-foto');
    const video = panel.querySelector('.escena-video');
    const botones = [...lista.querySelectorAll('button')];

    botones.forEach((b) => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      transicion(() => {
        botones.forEach((o) => o.setAttribute('aria-pressed', o === b));
        if (b.dataset.video && video) {
          if (!video.src) video.src = b.dataset.video;
          foto.hidden = true;
          video.hidden = false;
          video.setAttribute('aria-label', 'Video del patio montado para un evento');
        } else {
          video?.pause();
          if (video) video.hidden = true;
          foto.hidden = false;
          foto.src = b.dataset.src;
          foto.alt = b.dataset.alt;
        }
      }).then(() => {
        if (b.dataset.video && video) {
          if (sinMovimiento) video.controls = true;
          else video.play().catch(() => { video.controls = true; });
        }
      });
    }));
  });
}

// ---------- Celebraciones: paneles que se expanden ----------
{
  const items = [...document.querySelectorAll('.acordeon li')];
  const abrir = (li) => items.forEach((o) => {
    o.classList.toggle('abierto', o === li);
    o.querySelector('button').setAttribute('aria-expanded', o === li);
  });
  const conPuntero = matchMedia('(hover: hover) and (pointer: fine)').matches;
  items.forEach((li) => {
    li.querySelector('button').addEventListener('click', () => abrir(li));
    if (conPuntero) li.addEventListener('mouseenter', () => abrir(li));
  });
}

// ---------- Momentos: tira infinita ----------
{
  const seccion = document.querySelector('.momentos');
  const tira = seccion.querySelector('.momentos-tira');
  if (!sinMovimiento) {
    // Duplicamos las fotos para que la tira dé la vuelta sin cortes
    [...tira.children].forEach((li) => {
      const copia = li.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      copia.querySelector('img').alt = '';
      tira.append(copia);
    });
  }
  const boton = document.getElementById('pausa-tira');
  boton.addEventListener('click', () => {
    const pausada = seccion.classList.toggle('pausada');
    boton.setAttribute('aria-pressed', pausada);
    boton.setAttribute('aria-label', pausada ? 'Reanudar fotos en movimiento' : 'Pausar fotos en movimiento');
  });
}

// ---------- Formulario: arma el mensaje y abre WhatsApp ----------
{
  const form = document.getElementById('formulario');
  const error = document.getElementById('error');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const d = new FormData(form);
    const nombre = d.get('nombre').trim();
    const tipo = d.get('tipo');

    if (!nombre || !tipo) {
      error.textContent = !nombre
        ? 'Escribe tu nombre para que sepamos a quién responder.'
        : 'Elige qué vas a celebrar.';
      error.hidden = false;
      form.querySelector(!nombre ? '[name=nombre]' : '[name=tipo]').focus();
      return;
    }
    error.hidden = true;

    const fecha = d.get('fecha')
      ? new Date(d.get('fecha') + 'T12:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const lineas = [
      `Hola, soy ${nombre}. Quiero informes para un evento en Presidio.`,
      `Evento: ${tipo}`,
      fecha && `Fecha tentativa: ${fecha}`,
      d.get('invitados') && `Invitados: ${d.get('invitados')}`,
      d.get('mensaje').trim() && `Notas: ${d.get('mensaje').trim()}`,
      'Me gustaría agendar una visita.',
    ].filter(Boolean);

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
  });
}
