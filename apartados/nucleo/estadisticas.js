/* =============================================================
   ESTADÍSTICAS DE ACCESO (GoatCounter)
   Cuenta cada entrada en cualquier página, sin tocar los index.html:
   página, fecha y hora, país y región, de qué enlace viene, navegador.
   Sin cookies. Los datos se ven en https://<SITIO>.goatcounter.com
   ---------------------------------------------------------------
   Cuenta al abrir la página y al volver a ella tras más de 10 min
   (como cuando se reabre desde la pantalla de inicio del móvil).
   No cuenta "Actualizar ahora", el laboratorio ni el archivo abierto en local.
   Para que ESTE móvil no cuente: abre cualquier página con #no-contar
   al final de la dirección. Para volver a contar: #contar.
   ============================================================= */
Inicio.libreria("estadisticas", function (I) {
  "use strict";

  var SITIO = "";                       // ← código de tu cuenta de GoatCounter (lo que va antes de .goatcounter.com). Vacío = no cuenta nada.

  // Este móvil no cuenta / vuelve a contar (lo respeta el propio script de GoatCounter).
  // Al abrir con #no-contar o #contar, y también si se añade a la dirección sin recargar.
  function marca() {
    try {
      if (location.hash === "#no-contar") { localStorage.setItem("skipgc", "t"); alert("Este dispositivo ya no cuenta en las estadísticas."); }
      if (location.hash === "#contar") { localStorage.removeItem("skipgc"); alert("Este dispositivo vuelve a contar en las estadísticas."); }
    } catch (e) {}
  }
  marca();
  window.addEventListener("hashchange", marca);

  var prueba = window.INICIO_CONTAR_LOCAL === true;  // solo para las pruebas automáticas
  var diag = location.hash === "#estadisticas";
  function aviso(t) { if (diag) alert("Estadísticas\n\n" + t); }
  var excluido = false;
  try { excluido = localStorage.getItem("skipgc") === "t"; } catch (e) {}

  // Página = su carpeta (/inicio-usa-espana), igual se entre por .../ o por .../index.html
  var partes = location.pathname.split("/").filter(Boolean);
  if (partes.length && /\.html?$/i.test(partes[partes.length - 1])) partes.pop();
  var ruta = "/" + (partes.length ? partes[partes.length - 1] : "");
  var titulo = (I.CFG.titulo || "Inicio") + " · " + (I.CFG.version || ruta.slice(1));

  // Motivos para no contar, en el orden en que se comprueban
  if (!SITIO) return aviso("No cuenta: falta el código de GoatCounter en apartados/nucleo/estadisticas.js (línea 16).");
  if (/[.\/:\s]/.test(SITIO)) return aviso("No cuenta: en la línea 16 va solo el código (p. ej. \"familia\"), no la dirección completa. Ahora pone: " + SITIO);
  if (document.documentElement.hasAttribute("data-laboratorio") && !prueba) return aviso("No cuenta: el laboratorio no cuenta a propósito.");
  if (!prueba && (location.protocol === "file:" || /^(localhost|127\.)/.test(location.hostname))) return aviso("No cuenta: archivo abierto en local, no desde la web publicada.");
  if (excluido) aviso("No cuenta: ESTE dispositivo está excluido (#no-contar).\nPara que cuente, abre la página con #contar al final.");

  var listo = false, pendiente = 0;
  function enviar() {
    if (!window.goatcounter || !window.goatcounter.count) return;
    var f = window.goatcounter.filter ? window.goatcounter.filter() : false;
    for (; pendiente > 0; pendiente--) window.goatcounter.count({ path: ruta, title: titulo });
    if (!excluido) aviso(f ? "No cuenta. GoatCounter dice: " + f
      : "Cuenta. Visita enviada a " + SITIO + ".goatcounter.com como " + ruta + ".\nEn el panel aparece en uno o dos minutos.");
  }
  function contar() {
    pendiente++;
    if (listo) return enviar();
    if (document.getElementById("gc-script")) return;
    window.goatcounter = { no_onload: true, allow_local: prueba };
    var s = document.createElement("script");
    s.id = "gc-script"; s.async = true; s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + SITIO + ".goatcounter.com/count");
    s.onload = function () { listo = true; enviar(); };
    s.onerror = function () { aviso("No cuenta: el navegador no ha dejado cargar GoatCounter (gc.zgo.at).\nSuele ser un bloqueador de anuncios, la protección de rastreo del navegador o una VPN con filtro."); };
    document.head.appendChild(s);
  }
  I.estadisticas = { ruta: ruta, titulo: titulo };
  // "actualizar" sin forzar = al abrir y al volver tras 10 min. Con forzar = botón "Actualizar ahora": no cuenta.
  I.on("actualizar", function (o) { if (!o.forzar) contar(); });
});
