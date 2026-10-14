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
  if (!SITIO) return;
  if (document.documentElement.hasAttribute("data-laboratorio") && !prueba) return;
  if (!prueba && (location.protocol === "file:" || /^(localhost|127\.)/.test(location.hostname))) return;

  // Página = su carpeta (/inicio-usa-espana), igual se entre por .../ o por .../index.html
  var partes = location.pathname.split("/").filter(Boolean);
  if (partes.length && /\.html?$/i.test(partes[partes.length - 1])) partes.pop();
  var ruta = "/" + (partes.length ? partes[partes.length - 1] : "");
  var titulo = (I.CFG.titulo || "Inicio") + " · " + (I.CFG.version || ruta.slice(1));

  var listo = false, pendiente = 0;
  function enviar() {
    if (!window.goatcounter || !window.goatcounter.count) return;
    for (; pendiente > 0; pendiente--) window.goatcounter.count({ path: ruta, title: titulo });
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
    document.head.appendChild(s);
  }
  I.estadisticas = { ruta: ruta, titulo: titulo };
  // "actualizar" sin forzar = al abrir y al volver tras 10 min. Con forzar = botón "Actualizar ahora": no cuenta.
  I.on("actualizar", function (o) { if (!o.forzar) contar(); });
});
