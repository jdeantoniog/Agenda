/* =============================================================
   PRUEBAS AUTOMÁTICAS DEL LABORATORIO
   Se ejecutan solas al abrir laboratorio/index.html y muestran el
   resultado arriba. Comprueban:
     1. Carga: todos los archivos han llegado.
     2. Apartados: cada uno se registra, se monta y pinta algo.
     3. Errores: ninguno de JavaScript ni dentro de un apartado.
     4. Núcleo: fechas, Pascua, zonas horarias, banderas, textos.
     5. Marcas: festivos y cumpleaños llegan al calendario.
     6. Claves del navegador: solo las conocidas (no se pierde nada al migrar).
     7. Actualizar: "Actualizar ahora" no rompe nada.
     8. Independencia: cada apartado funciona solo en su página (?solo=nombre).
   ============================================================= */
(function () {
  "use strict";
  var SOLO = (/[?&]solo=([\w-]+)/.exec(location.search) || [])[1];
  var ESPERA = 3000;                 // margen para que lleguen datos online o caché
  var res = [];
  function ok(grupo, nombre, cond, detalle) { res.push({ g: grupo, n: nombre, ok: !!cond, d: cond ? "" : (detalle || "") }); }
  function igual(grupo, nombre, a, b) { ok(grupo, nombre, JSON.stringify(a) === JSON.stringify(b), "esperado " + JSON.stringify(b) + ", obtenido " + JSON.stringify(a)); }

  var t0 = Date.now();
  (function esperar() {
    if (window.Inicio && Inicio.montados) return setTimeout(probar, ESPERA);
    if (Date.now() - t0 > 15000) return probar();
    setTimeout(esperar, 100);
  })();

  function probar() {
    var C = window.InicioCarga || { archivos: [], errores: [], apartados: [] }, I = window.Inicio || {};

    // 1. Carga
    var malos = C.archivos.filter(function (a) { return !a.ok; }).map(function (a) { return a.archivo; });
    ok("Carga", C.archivos.length + " archivos cargados", !malos.length, "faltan: " + malos.join(", "));
    ok("Carga", "Núcleo disponible", !!I.montar, "nucleo.js no se ha ejecutado");

    // 2. Apartados
    C.apartados.forEach(function (k) {
      var el = document.querySelector('[data-apartado="' + k + '"]');
      ok("Apartados", k + ": registrado", I.registrados && I.registrados().indexOf(k) !== -1, "su archivo no llama a Inicio.apartado(\"" + k + "\")");
      ok("Apartados", k + ": montado y con contenido", el && el.getAttribute("data-montado") === "1" && el.innerHTML.length > 20, "contenedor vacío o con error");
    });

    // 3. Errores
    var ej = C.errores.filter(function (e) { return e.tipo !== "carga"; });
    ok("Errores", "Sin errores de JavaScript", !ej.length, ej.map(function (e) { return e.texto; }).join(" | "));
    ok("Errores", "Sin errores dentro de los apartados", !(I.errores || []).length, (I.errores || []).map(function (e) { return e.donde + ": " + e.texto; }).join(" | "));

    // 4. Núcleo (solo con la página completa: con ?solo= basta con los grupos anteriores)
    if (I.easterSunday && !SOLO) {
      igual("Núcleo", "Pascua 2026", I.easterSunday(2026), [2026, 4, 5]);
      igual("Núcleo", "Pascua 2027", I.easterSunday(2027), [2027, 3, 28]);
      igual("Núcleo", "Acción de Gracias 2026 (4.º jueves de noviembre)", I.nthWeekday(2026, { mes: 11, diaSemana: 4, orden: 4 }), 26);
      igual("Núcleo", "Último lunes de mayo de 2026", I.nthWeekday(2026, { mes: 5, diaSemana: 1, orden: -1 }), 25);
      igual("Núcleo", "Viernes Santo 2026 (pascua: -2)", I.ymdOfRule({ pascua: -2 }, 2026), [2026, 4, 3]);
      igual("Núcleo", "29 de febrero en año no bisiesto", I.ymdOfRule({ fecha: "02-29" }, 2027), null);
      igual("Núcleo", "Fecha de un solo año fuera de su año", I.ymdOfRule({ fecha: "2026-06-20" }, 2027), null);
      igual("Núcleo", "keyOf", I.keyOf(2026, 1, 5), "2026-01-05");
      igual("Núcleo", "Madrid tras el cambio de hora (29/03/2026 12:00 = 10:00 UTC)", I.zonedTime("Europe/Madrid", 2026, 3, 29, 12, 0), Date.UTC(2026, 2, 29, 10, 0));
      igual("Núcleo", "Michigan tras el cambio de hora (01/11/2026 12:00 = 17:00 UTC)", I.zonedTime("America/Detroit", 2026, 11, 1, 12, 0), Date.UTC(2026, 10, 1, 17, 0));
      igual("Núcleo", "Bandera desconocida: gris", I.flagOf("ZZ").color, "#5c5c60");
      igual("Núcleo", "Bandera partida ES+CB: confeti de las dos", I.flagOf("ES+CB").confeti.length, 4);
      igual("Núcleo", "Textos con huecos", I.tx("haceMin", 5), "hace 5 min");
      igual("Núcleo", "Quitar acentos", I.stripAcc("Árbol Ñandú"), "arbol nandu");
      ok("Núcleo", "Lugares del tiempo definidos", (I.lugares || []).length >= 1, "config.js sin lugares");
    }

    // 5. Marcas
    if (I.marcas && !SOLO) {
      var y = I.todayYMD()[0], M = I.marcas.marksForYear(y), todas = [];
      Object.keys(M).forEach(function (k) { todas = todas.concat(M[k]); });
      ok("Marcas", "Hay festivos del país en " + y, todas.some(function (m) { return m.tipo === "fest" && m.pais === "pais"; }), "revisar pais.festivos / festivosHabituales");
      var c0 = (window.CUMPLES || [])[0];
      if (c0) ok("Marcas", "Cumpleaños de cumples.js en el calendario (" + c0[1] + ")", (M[y + "-" + c0[0]] || []).some(function (m) { return m.tipo === "fam"; }), "no aparece el " + c0[0]);
      ok("Marcas", "Cambios de hora calculados", todas.some(function (m) { return m.tipo === "sen" && /hora/i.test(m.nombre); }), "no hay cambios de hora en el año");
    }

    // 6. Claves del navegador: solo las conocidas
    var CONOCIDAS = /^inicio:(v1:(repaso|ultima|aprendidas(:\w+)?)|[\w-]+:v1:(tiempo:\w+|uv:\w+|cambio:\w+|festivos:\w+:\d{4}|deportes|equipo:.+|lugar|avisos|noticias:\d+))$/;
    var raras = [];
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf("inicio:") === 0 && !CONOCIDAS.test(k)) raras.push(k); } } catch (e) {}
    ok("Navegador", "Solo claves conocidas (inicio:…)", !raras.length, "desconocidas: " + raras.join(", "));
    try {
      var u = JSON.parse(localStorage.getItem("inicio:v1:ultima") || "null");
      ok("Navegador", "El laboratorio no se apunta como última versión vista", !u || !/laboratorio/.test(u.url), "la página de entrada redirigiría al laboratorio");
    } catch (e) {}

    // 7. Actualizar ahora
    var antes = (I.errores || []).length + C.errores.length;
    if (I.actualizar) I.actualizar(true);
    setTimeout(function () {
      ok("Actualizar", "\"Actualizar ahora\" sin errores", (I.errores || []).length + C.errores.length === antes, "ver consola");
      if (SOLO) { avisarPadre(); pintar(); return; }
      independencia(C.apartados, function () { pintar(); });
    }, 1500);
  }

  // 8. Independencia: cada apartado solo, en un marco oculto (?solo=nombre). Cada marco devuelve su resultado.
  function independencia(lista, fin) {
    var i = 0;
    function siguiente() {
      if (i >= lista.length) return fin();
      var k = lista[i++], f = document.createElement("iframe"), hecho = false;
      f.style.cssText = "position:absolute;width:390px;height:600px;left:-9999px;top:0;border:0";
      f.src = location.pathname.split("/").pop() + "?solo=" + k;
      function cierra(r) {
        if (hecho) return; hecho = true;
        window.removeEventListener("message", oye);
        ok("Independencia", k + " funciona solo", r && r.ok, r ? r.fallos.join(" | ") : "sin respuesta en 20 s");
        f.parentNode.removeChild(f); siguiente();
      }
      function oye(e) { if (e.data && e.data.laboratorio && e.data.solo === k) cierra(e.data); }
      window.addEventListener("message", oye);
      setTimeout(function () { cierra(null); }, 20000);
      document.body.appendChild(f);
    }
    siguiente();
  }
  function avisarPadre() {
    if (window.parent === window) return;
    var f = res.filter(function (r) { return !r.ok; });
    window.parent.postMessage({ laboratorio: true, solo: SOLO, ok: !f.length, fallos: f.map(function (r) { return r.n + (r.d ? ": " + r.d : ""); }) }, "*");
  }

  function pintar() {
    var bien = res.filter(function (r) { return r.ok; }).length, mal = res.length - bien;
    window.InicioPruebas = { total: res.length, bien: bien, mal: mal, resultados: res };
    var box = document.getElementById("lab-panel");
    if (!box) return;
    var html = '<h2>Laboratorio' + (SOLO ? ": solo «" + SOLO + "»" : "") + '</h2>' +
      '<p class="lab-res ' + (mal ? "lab-mal" : "lab-bien") + '">' + (mal ? mal + " pruebas fallan de " + res.length : "Las " + res.length + " pruebas pasan") + "</p>";
    var grupos = [];
    res.forEach(function (r) { if (grupos.indexOf(r.g) === -1) grupos.push(r.g); });
    grupos.forEach(function (g) {
      var rs = res.filter(function (r) { return r.g === g; }), m = rs.filter(function (r) { return !r.ok; }).length;
      html += '<details' + (m ? " open" : "") + '><summary>' + Inicio.esc(g) + " · " + (rs.length - m) + "/" + rs.length + "</summary><ul>";
      rs.forEach(function (r) {
        html += '<li class="' + (r.ok ? "lab-bien" : "lab-mal") + '">' + (r.ok ? "Bien" : "Falla") + " · " + Inicio.esc(r.n) + (r.d ? " <span class='muted'>(" + Inicio.esc(r.d) + ")</span>" : "") + "</li>";
      });
      html += "</ul></details>";
    });
    if (!SOLO) {
      html += '<p class="small muted">Probar uno solo: ' + (window.InicioCarga.apartados || []).map(function (k) {
        return '<a href="?solo=' + k + '">' + k + "</a>";
      }).join(" · ") + "</p>";
    } else {
      html += '<p class="small"><a href="' + location.pathname.split("/").pop() + '">Volver a la página completa</a></p>';
    }
    box.innerHTML = html;
    box.hidden = false;
  }
})();
