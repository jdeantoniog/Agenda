/* =============================================================
   CARGADOR
   Cada página solo tiene:
     <div data-apartado="frase"></div>  … uno por apartado, en el orden de pantalla
     <script src="config.js"></script>
     <script src="../apartados/cargador.js"></script>
   Este archivo mira qué apartados hay en la página y carga solo lo que necesitan:
   textos, datos, núcleo, librerías del núcleo, CSS y el código de cada apartado.
   Scripts clásicos (no módulos ES): funciona igual en GitHub Pages que abriendo
   el archivo en local (file://).

   Para añadir un apartado nuevo: su archivo en modulos/ y una línea en MANIFIESTO.
   ============================================================= */
(function () {
  "use strict";

  // Sube este número al publicar cambios en apartados/: obliga al navegador a no usar copias viejas.
  var VERSION = "6";

  /* Qué necesita cada apartado.
     libs: librerías del núcleo (nucleo/<lib>.js y, si existe, nucleo/<lib>.css)
     datos: archivos de datos (datos/<archivo>.js; el nombre se puede cambiar en config.js > datos)
     css: tiene modulos/<nombre>.css
     El orden de las claves es el orden en que se aplican los CSS (igual que en el index.html original). */
  var MANIFIESTO = {
    "relojes":         { css: true },
    "tiempo":          { libs: ["tiempo"] },
    "tiempo-buscador": { libs: ["tiempo"], css: true },
    "mapa":            { css: true },
    "avisos":          { css: true },
    "noticias":        { css: true },
    "conversor":       { css: true },
    "calculadora":     { css: true },
    "sol-aire":        { css: true },
    "calendario":      { libs: ["marcas"], datos: ["cumples", "santoral"], css: true },
    "aviso-dia":       { libs: ["marcas"], datos: ["cumples"], css: true },
    "frase":           { libs: ["marcas"], datos: ["cumples", "palabras"], css: true },
    "expresiones":     { datos: ["palabras"], css: true },
    "proximas-fechas": { libs: ["marcas"], datos: ["cumples"], css: true },
    "acceso-resto":    { datos: ["paginas"], css: true },
    "pie":             { css: true }
  };
  var LIBS_CSS = { tiempo: true };       // librerías con CSS propio

  var me = document.currentScript;
  var BASE = me.src.replace(/[^\/]*$/, "");          // carpeta apartados/ (termina en /)
  var CFG = window.CONFIG || {};
  var carga = window.InicioCarga = { inicio: Date.now(), archivos: [], errores: [], apartados: [] };

  // Errores de cualquier script (para el laboratorio y para no perderlos de vista)
  window.addEventListener("error", function (e) {
    carga.errores.push({ tipo: "js", texto: e.message + (e.filename ? " (" + e.filename.split("/").pop() + ":" + e.lineno + ")" : "") });
  });

  // Apartados presentes en la página. En el laboratorio, ?solo=nombre deja solo uno (prueba de independencia).
  var nodos = Array.prototype.slice.call(document.querySelectorAll("[data-apartado]"));
  var solo = /[?&]solo=([\w-]+)/.exec(location.search);
  if (solo && document.documentElement.hasAttribute("data-laboratorio")) {
    nodos.forEach(function (n) { if (n.getAttribute("data-apartado") !== solo[1]) n.parentNode.removeChild(n); });
    nodos = nodos.filter(function (n) { return n.getAttribute("data-apartado") === solo[1]; });
  }
  var nombres = [];
  nodos.forEach(function (n) {
    var k = n.getAttribute("data-apartado");
    if (!MANIFIESTO[k]) { carga.errores.push({ tipo: "pagina", texto: "Apartado desconocido: " + k }); return; }
    if (nombres.indexOf(k) === -1) nombres.push(k);
  });
  carga.apartados = nombres.slice();

  // Qué hay que cargar
  var libs = [], datos = [], css = [];
  Object.keys(MANIFIESTO).forEach(function (k) {
    if (nombres.indexOf(k) === -1) return;
    var M = MANIFIESTO[k];
    (M.libs || []).forEach(function (l) {
      if (libs.indexOf(l) !== -1) return;
      libs.push(l);
      if (LIBS_CSS[l]) css.push("nucleo/" + l + ".css");
    });
    (M.datos || []).forEach(function (d) { if (datos.indexOf(d) === -1) datos.push(d); });
    if (M.css) css.push("modulos/" + k + ".css");
  });
  var D = CFG.datos || {};                 // config.js > datos: { cumples: "cumples", palabras: "palabras", santoral: "santoral" }
  var idioma = String(CFG.idioma || "es").toLowerCase();
  var scripts = ["textos/es.js"]
    .concat(idioma !== "es" ? ["textos/" + idioma + ".js"] : [])
    .concat(datos.map(function (d) { return "datos/" + (D[d] || d) + ".js"; }))
    .concat(["nucleo/nucleo.js", "nucleo/estadisticas.js"])     // estadísticas: en todas las páginas
    .concat(libs.map(function (l) { return "nucleo/" + l + ".js"; }))
    .concat(nombres.map(function (k) { return "modulos/" + k + ".js"; }));

  function url(p) { return BASE + p + "?v=" + VERSION; }
  var pendientes = scripts.length + css.length;
  function hecho(p, ok) {
    carga.archivos.push({ archivo: p, ok: ok });
    if (!ok) carga.errores.push({ tipo: "carga", texto: "No se ha podido cargar " + p });
    if (--pendientes === 0) arrancar();
  }

  // CSS en paralelo (base.css ya va en el <head> de cada página). Se espera a que lleguen
  // para no pintar sin estilos (máximo 4 s por archivo).
  css.forEach(function (p) {
    var l = document.createElement("link"), fin = false;
    l.rel = "stylesheet"; l.href = url(p);
    function cierra(ok) { if (fin) return; fin = true; hecho(p, ok); }
    l.onload = function () { cierra(true); };
    l.onerror = function () { cierra(false); };
    setTimeout(function () { cierra(true); }, 4000);
    document.head.appendChild(l);
  });
  // Scripts: se descargan en paralelo y se ejecutan en este orden (async = false)
  scripts.forEach(function (p) {
    var s = document.createElement("script");
    s.src = url(p); s.async = false;
    s.onload = function () { hecho(p, true); };
    s.onerror = function () { hecho(p, false); };
    document.body.appendChild(s);
  });
  function arrancar() {
    var I = window.Inicio;
    if (!I || !I.montar) {
      document.body.insertAdjacentHTML("afterbegin", "<p style='padding:16px'>No se ha podido cargar apartados/nucleo/nucleo.js.</p>");
      return;
    }
    I.montar(nodos, nombres);
  }
})();
