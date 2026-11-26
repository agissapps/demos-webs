// Modo edición de textos: se activa con ?editar en la dirección.
// Cualquier texto (menos botones y enlaces) se puede cambiar con un clic,
// los cambios se guardan en este navegador y se descargan en un PDF.
{
  const CLAVE = 'presidio-cambios-v1';
  document.documentElement.classList.add('editando');

  const hoja = document.createElement('link');
  hoja.rel = 'stylesheet';
  hoja.href = 'editar.css';
  document.head.append(hoja);

  // Lee el texto como se ve: saltos de línea por <br> y espacios colapsados
  const leer = (el) => {
    let t = '';
    const recorrer = (nodo) => {
      for (const c of nodo.childNodes) {
        if (c.nodeType === 3) t += c.data;
        else if (c.nodeName === 'BR') t += '\n';
        else if (c.nodeType === 1) {
          if (/^(DIV|P|LI)$/.test(c.nodeName) && t && !t.endsWith('\n')) t += '\n';
          recorrer(c);
        }
      }
    };
    recorrer(el);
    return t.replace(/ /g, ' ').replace(/[ \t\r]*\n[ \t\r]*/g, '\n').replace(/[ \t\r]+/g, ' ').trim();
  };
  const escribir = (el, texto) => {
    el.textContent = '';
    texto.split('\n').forEach((linea, i) => {
      if (i) el.append(document.createElement('br'));
      el.append(linea);
    });
  };

  // Textos editables: títulos, párrafos, listas y datos; nunca botones, enlaces ni el formulario
  const editables = [...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main dt, main dd, footer p')]
    .filter((el) => !el.closest('a, button, form, select, [aria-hidden="true"], .portada-control'))
    .filter((el) => !el.querySelector('a, button, input, select, textarea, img, h1, h2, h3, p, li'))
    .filter((el) => leer(el));

  const originales = editables.map(leer);

  const SECCIONES = {
    inicio: 'Portada', casa: 'Recorre la casa', celebraciones: '¿Qué vamos a celebrar?',
    servicio: 'La cocina', contacto: 'Agenda una visita',
  };
  const TIPOS = { H1: 'título principal', H2: 'título', H3: 'subtítulo', DT: 'etiqueta', DD: 'dato', LI: 'punto de lista' };
  const ubicacion = (el) => {
    const seccion = el.closest('section[id], footer');
    const partes = [seccion?.tagName === 'FOOTER' ? 'Pie de página' : SECCIONES[seccion?.id] || 'Página'];
    const panel = el.closest('.panel');
    if (panel) partes.push(document.getElementById(panel.getAttribute('aria-labelledby'))?.textContent.trim());
    const item = el.closest('.acordeon li');
    if (item) partes.push(item.querySelector('button span')?.textContent.trim());
    return `${partes.filter(Boolean).join(' › ')} (${TIPOS[el.tagName] || 'texto'})`;
  };

  // ---------- Barra de edición ----------
  const barra = document.createElement('div');
  barra.className = 'editor';
  barra.setAttribute('role', 'region');
  barra.setAttribute('aria-label', 'Edición de textos');
  barra.innerHTML = `
    <p class="editor-titulo">Modo edición</p>
    <p class="editor-ayuda">Haz clic en cualquier texto para cambiarlo. Cuando termines, descarga el PDF y envíalo.</p>
    <p class="editor-cuenta" aria-live="polite"></p>
    <div class="editor-acciones">
      <button type="button" class="editor-pdf">Descargar cambios en PDF</button>
      <button type="button" class="editor-descartar">Descartar</button>
    </div>`;
  document.body.append(barra);
  const cuenta = barra.querySelector('.editor-cuenta');

  // ---------- Cambios: se guardan en este navegador ----------
  let cambios = {};
  try { cambios = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch { cambios = {}; }

  const contar = () => {
    const n = Object.keys(cambios).length;
    cuenta.textContent = n === 0 ? 'Sin cambios todavía' : n === 1 ? '1 texto cambiado' : `${n} textos cambiados`;
  };
  const guardar = () => {
    try { localStorage.setItem(CLAVE, JSON.stringify(cambios)); } catch { /* sin espacio: el PDF sigue funcionando */ }
    contar();
  };

  const soportaTextoPlano = (() => {
    const prueba = document.createElement('div');
    try { prueba.contentEditable = 'plaintext-only'; } catch { return false; }
    return prueba.contentEditable === 'plaintext-only';
  })();

  editables.forEach((el, i) => {
    // Restaura lo editado antes, solo si el texto original sigue siendo el mismo
    const previo = cambios[i];
    if (previo && previo.antes === originales[i]) {
      escribir(el, previo.ahora);
      el.classList.add('editado');
    } else if (previo) {
      delete cambios[i];
    }

    el.contentEditable = soportaTextoPlano ? 'plaintext-only' : 'true';
    el.spellcheck = true;
    if (!soportaTextoPlano) {
      el.addEventListener('paste', (e) => {
        e.preventDefault();
        document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
      });
    }
    el.addEventListener('input', () => {
      const ahora = leer(el);
      if (ahora === originales[i]) delete cambios[i];
      else cambios[i] = { donde: ubicacion(el), antes: originales[i], ahora };
      el.classList.toggle('editado', i in cambios);
      guardar();
    });
  });
  guardar();

  barra.querySelector('.editor-descartar').addEventListener('click', () => {
    if (!Object.keys(cambios).length) return;
    if (!confirm('¿Borrar todos los cambios y volver a los textos originales?')) return;
    Object.keys(cambios).forEach((i) => {
      escribir(editables[i], originales[i]);
      editables[i].classList.remove('editado');
    });
    cambios = {};
    guardar();
  });

  barra.querySelector('.editor-pdf').addEventListener('click', () => {
    const lista = Object.keys(cambios).map(Number).sort((a, b) => a - b).map((i) => cambios[i]);
    if (!lista.length) {
      cuenta.textContent = 'Cambia al menos un texto para descargar el PDF.';
      return;
    }
    const hoy = new Date();
    const archivo = `cambios-presidio-${hoy.toISOString().slice(0, 10)}.pdf`;
    const url = URL.createObjectURL(crearPDF(lista, hoy));
    const enlace = Object.assign(document.createElement('a'), { href: url, download: archivo });
    document.body.append(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  });

  // ---------- PDF sin librerías: Helvetica con acentos (WinAnsi) ----------
  function crearPDF(lista, fecha) {
    const ANCHO = 595.28, ALTO = 841.89, MARGEN = 56;
    const CP1252 = {
      0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87,
      0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91,
      0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x02DC: 0x98,
      0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F,
    };
    const cadena = (s) => {
      let out = '';
      for (const ch of s.replace(/[\t\r\n\f\v]/g, ' ')) {
        let c = ch.codePointAt(0);
        if (CP1252[c]) c = CP1252[c];
        else if (c > 255 || (c >= 0x80 && c < 0xA0)) c = 0x3F;
        if (c === 0x28 || c === 0x29 || c === 0x5C) out += '\\' + String.fromCharCode(c);
        else if (c < 32 || c > 126) out += '\\' + c.toString(8).padStart(3, '0');
        else out += String.fromCharCode(c);
      }
      return out;
    };

    const lienzo = document.createElement('canvas').getContext('2d');
    const partir = (texto, tam, negrita, ancho) => {
      lienzo.font = `${negrita ? '700 ' : ''}${tam}px Arial, Helvetica, sans-serif`;
      const lineas = [];
      for (const parrafo of texto.split('\n')) {
        let linea = '';
        for (const palabra of parrafo.split(/ +/)) {
          const prueba = linea ? `${linea} ${palabra}` : palabra;
          if (!linea || lienzo.measureText(prueba).width <= ancho * 0.97) linea = prueba;
          else { lineas.push(linea); linea = palabra; }
        }
        lineas.push(linea);
      }
      return lineas;
    };

    const OLIVO = '0.294 0.325 0.231', CAFE = '0.204 0.169 0.145', GRIS = '0.42 0.39 0.36', ROSA = '0.6 0.38 0.41';
    const paginas = [[]];
    let y = ALTO - MARGEN;
    const linea = (texto, { tam = 11, negrita = false, color = CAFE, x = MARGEN }) => {
      const alto = tam * 1.45;
      if (y - alto < MARGEN) { paginas.push([]); y = ALTO - MARGEN; }
      y -= alto;
      paginas.at(-1).push(`BT /${negrita ? 'F2' : 'F1'} ${tam} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${cadena(texto)}) Tj ET`);
    };
    const bloque = (texto, opciones = {}) => {
      const x = opciones.x ?? MARGEN;
      partir(texto, opciones.tam ?? 11, opciones.negrita, ANCHO - MARGEN - x).forEach((l) => linea(l, { ...opciones, x }));
    };

    bloque('Cambios de texto · Presidio Eventos', { tam: 20, negrita: true, color: OLIVO });
    bloque(`${fecha.toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })} · ${location.origin}${location.pathname}`, { tam: 9, color: GRIS });
    y -= 6;
    paginas.at(-1).push(`0.843 0.631 0.651 RG 1 w ${MARGEN} ${y.toFixed(2)} m ${ANCHO - MARGEN} ${y.toFixed(2)} l S`);
    y -= 10;
    bloque(lista.length === 1 ? '1 texto cambiado.' : `${lista.length} textos cambiados.`, { tam: 11, color: GRIS });
    y -= 8;

    lista.forEach((c, n) => {
      y -= 8;
      bloque(`${n + 1}. ${c.donde}`, { tam: 11.5, negrita: true, color: OLIVO });
      y -= 2;
      bloque('Antes', { tam: 8.5, negrita: true, color: GRIS, x: MARGEN + 14 });
      bloque(c.antes, { tam: 10, color: GRIS, x: MARGEN + 14 });
      y -= 3;
      bloque('Ahora', { tam: 8.5, negrita: true, color: ROSA, x: MARGEN + 14 });
      bloque(c.ahora, { tam: 11, color: CAFE, x: MARGEN + 14 });
    });

    const objetos = [null, null];
    const agregar = (s) => objetos.push(s);
    const f1 = agregar('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const f2 = agregar('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const hijas = paginas.map((ops) => {
      const flujo = ops.join('\n');
      const contenido = agregar(`<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`);
      return agregar(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ANCHO} ${ALTO}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${contenido} 0 R >>`);
    });
    objetos[0] = '<< /Type /Catalog /Pages 2 0 R >>';
    objetos[1] = `<< /Type /Pages /Kids [${hijas.map((h) => `${h} 0 R`).join(' ')}] /Count ${hijas.length} >>`;

    let pdf = '%PDF-1.4\n';
    const posiciones = objetos.map((o, i) => {
      const pos = pdf.length;
      pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
      return pos;
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
    pdf += posiciones.map((p) => `${String(p).padStart(10, '0')} 00000 n \n`).join('');
    pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return new Blob([pdf], { type: 'application/pdf' });
  }
}
