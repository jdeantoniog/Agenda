/* =============================================================
   NÚCLEO
   Lo que comparten todos los apartados: textos, configuración,
   almacenamiento en el navegador, horas y zonas horarias, banderas,
   fechas, peticiones a internet, lugares del tiempo y el ciclo de
   actualización. Ningún apartado depende de otro: solo de esto.

   Para escribir un apartado:
     Inicio.apartado("nombre", function (contenedor, I) { … });
   y escuchar Inicio.on("actualizar", function (o) { … o.forzar … }).
   ============================================================= */
(function () {
  "use strict";
  var I = window.Inicio = window.Inicio || {};

  /* ---------- Registro de apartados y librerías, avisos entre ellos ---------- */
  var REG = {}, LIBS = [], OYENTES = {};
  I.errores = [];
  I.apartado = function (nombre, fn) { REG[nombre] = fn; };
  I.libreria = function (nombre, fn) { LIBS.push({ nombre: nombre, fn: fn }); };
  I.registrados = function () { return Object.keys(REG); };
  I.on = function (ev, fn) { (OYENTES[ev] = OYENTES[ev] || []).push(fn); };
  I.emit = function (ev, dato) {
    (OYENTES[ev] || []).slice().forEach(function (fn) {
      try { fn(dato); } catch (e) { fallo("evento " + ev, e); }
    });
  };
  function fallo(donde, e) {
    I.errores.push({ donde: donde, texto: String(e && e.message || e) });
    if (window.console) console.error("[Inicio] " + donde, e);
  }
  I.$ = function (id) { return document.getElementById(id); };
  I.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- Arranque: lo llama cargador.js cuando todo ha llegado ---------- */
  I.montar = function (nodos, nombres) {
    I.pagina = { apartados: nombres, tiene: function (k) { return nombres.indexOf(k) !== -1; } };
    if (!iniciar()) return;
    LIBS.forEach(function (L) { try { L.fn(I); } catch (e) { fallo("librería " + L.nombre, e); } });
    I.montados = [];
    nodos.forEach(function (n) {
      var k = n.getAttribute("data-apartado"), fn = REG[k];
      if (!fn) return;
      try { fn(n, I); I.montados.push(k); n.setAttribute("data-montado", "1"); }
      catch (e) {
        fallo("apartado " + k, e);
        n.innerHTML = '<p class="status warn">' + I.esc(I.tx("errApartado", k)) + "</p>";
      }
    });
    I.actualizar();
    I.emit("montado");
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && Date.now() - ultimaCarga > 10 * 60 * 1000) I.actualizar();
    });
  };
  // Recarga general: al abrir, con el botón "Actualizar ahora" y al volver a la pestaña tras 10 min
  var ultimaCarga = Date.now();
  I.actualizar = function (forzar) { ultimaCarga = Date.now(); I.emit("actualizar", { forzar: forzar === true }); };

  function iniciar() {
    /* ---------- Textos: español de base; textos/<idioma>.js (window.TEXTOS) los sustituye ---------- */
    var T = {}, B = window.TEXTOS_BASE || {}, X = window.TEXTOS || {}, k;
    for (k in B) T[k] = B[k];
    for (k in X) T[k] = X[k];
    if (!T.errApartado) T.errApartado = "No se ha podido mostrar el apartado «{0}».";
    // T.x con {0}, {1}… sustituidos
    function tx(key) { var a = arguments; return String(T[key]).replace(/\{(\d)\}/g, function (m, i) { return a[+i + 1]; }); }
    I.T = T; I.tx = tx;
    var LOC = I.LOC = T.locale || "es-ES", LANG = I.LANG = LOC.slice(0, 2);
    var LEARN = I.LEARN = (window.CONFIG && window.CONFIG.idiomaAprender) || "en";      // idioma de frases y expresiones
    I.learnTxt = function (w) { return w[LEARN] != null ? w[LEARN] : w.en; };
    I.LEARNED_KEY = "aprendidas" + (LEARN === "en" ? "" : ":" + LEARN);
    document.documentElement.lang = LANG;

    var CFG = I.CFG = window.CONFIG;
    if (!CFG || !CFG.pais) {
      document.body.insertAdjacentHTML("afterbegin", "<p style='padding:16px'>" + T.errConfig + "</p>");
      return false;
    }

    var U = CFG.usa, P = CFG.pais;
    // Sin bloque "usa": página de un solo país (una bandera, sin diferencia horaria ni festivos de otro país)
    var SOLO = !U;
    if (SOLO) U = { nombre: "", nombreCorto: "", zonaHoraria: P.zonaHoraria, ciudadReloj: P.ciudadReloj, oculto: true };
    var tzU = U.zonaHoraria, tzP = P.zonaHoraria;
    var mainIsPais = CFG.zonaPrincipal === "pais";
    var tzMain = mainIsPais ? tzP : tzU, cityMain = mainIsPais ? P.ciudadReloj : U.ciudadReloj;
    function countryName(which) { return which === "usa" ? (U.nombreCorto || "EE. UU.") : (P.nombreCorto || P.nombre); }
    I.U = U; I.P = P; I.SOLO = SOLO; I.tzU = tzU; I.tzP = tzP; I.tzMain = tzMain; I.cityMain = cityMain; I.countryName = countryName;
    I.src = function (which) { return which === "pais" ? P : U; };

    // Cumpleaños de cumples.js: se convierten en mensajes especiales (calendario, próximas fechas, aviso y confeti).
    // Por defecto zona "ambas": se ven desde que empieza el día en el país hasta que acaba en EE. UU.
    if (!CFG._cumplesUnidos) {
      CFG.mensajesEspeciales = (CFG.mensajesEspeciales || []).concat((window.CUMPLES || []).filter(function (c) {
        return c && /^\d\d-\d\d$/.test(c[0]) && c[1];
      }).map(function (c) {
        var o = c[2] || {};
        return { fecha: c[0], texto: o.texto || tx("felicita", c[1]), lista: o.lista || tx("cumpleDe", c[1]),
                 avisar: o.avisar !== false, confeti: o.confeti !== false, zona: o.zona || "ambas" };
      }));
      CFG._cumplesUnidos = true;
    }

    document.title = CFG.titulo || "Inicio";

    /* ---------- Almacenamiento en el navegador ----------
       Todas las páginas de GitHub Pages de un mismo usuario comparten navegador (mismo dominio).
       La caché lleva el identificador de la versión para que la de EE. UU.-España no pise a la de EE. UU.-Italia.
       Las expresiones aprendidas y el modo repaso se comparten entre versiones. Mismas claves que antes. */
    var STORE = "inicio:" + (CFG.version || "base") + ":v1:", SHARED = "inicio:v1:";
    function store(key, val, shared) { try { localStorage.setItem((shared ? SHARED : STORE) + key, JSON.stringify(val)); } catch (e) {} }
    function load(key, shared) { try { var v = localStorage.getItem((shared ? SHARED : STORE) + key); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
    function ago(t) {
      var m = Math.round((Date.now() - t) / 60000);
      return m < 60 ? tx("haceMin", Math.max(1, m)) : m < 2880 ? tx("haceH", Math.round(m / 60)) : tx("haceDias", Math.round(m / 1440));
    }
    I.store = store; I.load = load; I.ago = ago; I.STORE = STORE; I.SHARED = SHARED;
    var nf1 = I.nf1 = new Intl.NumberFormat(LOC, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

    /* ---------- Utilidades de hora local ---------- */
    var FMTS = {};
    function localParts(tz, d) {
      var f = FMTS[tz] || (FMTS[tz] = new Intl.DateTimeFormat("en-US", {
        timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
      }));
      var p = {};
      f.formatToParts(d || new Date()).forEach(function (x) { p[x.type] = x.value; });
      if (p.hour === "24") p.hour = "00";
      return p;
    }
    // Minutos de diferencia de una zona con UTC en un instante
    function offsetMinutes(tz, d) {
      d = d || new Date();
      var p = localParts(tz, d), base = Math.floor(d.getTime() / 60000) * 60000;
      return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - base) / 60000);
    }
    // Instante absoluto de una fecha y hora expresadas en una zona horaria
    function zonedTime(tz, y, m, d, h, mi) {
      var want = Date.UTC(y, m - 1, d, h || 0, mi || 0), guess = want;
      for (var i = 0; i < 3; i++) guess = want - offsetMinutes(tz, new Date(guess)) * 60000;
      return guess;
    }
    function midnightIn(tz, y, m, d) { return zonedTime(tz, y, m, d, 0, 0); }
    function todayIn(tz) { var p = localParts(tz); return [+p.year, +p.month, +p.day]; }
    function todayYMD() { return todayIn(tzMain); }
  
    function fmtTime(tz, d) {
      return new Intl.DateTimeFormat(LOC, { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(d || new Date());
    }
    function fmtDate(tz) {
      return new Intl.DateTimeFormat(LOC, { weekday: "long", day: "numeric", month: "short", timeZone: tz }).format(new Date());
    }
    // "13:00 en West Branch · 19:00 en España"
    function bothTimes(dt) {
      if (SOLO) return tx("horaEnPais", fmtTime(tzP, dt), countryName("pais"));
      return tx("horaEn", fmtTime(tzU, dt), U.ciudadReloj) + " · " + tx("horaEnPais", fmtTime(tzP, dt), countryName("pais"));
    }
    I.localParts = localParts; I.offsetMinutes = offsetMinutes; I.zonedTime = zonedTime; I.midnightIn = midnightIn;
    I.todayIn = todayIn; I.todayYMD = todayYMD; I.fmtTime = fmtTime; I.fmtDate = fmtDate; I.bothTimes = bothTimes;

    /* ---------- Banderas (3:2, dibujadas sin dependencias) ---------- */
    var FLAGS = {
      ES: { color: "#aa151b", confeti: ["#aa151b", "#f1bf00"], svg: function () {
        return '<rect width="750" height="500" fill="#aa151b"/><rect y="125" width="750" height="250" fill="#f1bf00"/>'; } },
      // Comunidad de Madrid: rojo carmesí con siete estrellas blancas de cinco puntas (4 arriba y 3 abajo)
      MD: { color: "#c8102e", confeti: ["#c8102e", "#d9d9d9"], svg: function (pos) {
        pos = pos || { cx: 375, cy: 252, s: 1 };     // centro y escala de las estrellas (en la diagonal van a su triángulo)
        function star(cx, cy, R) {
          var pts = [];
          for (var k = 0; k < 10; k++) {
            var r = k % 2 === 0 ? R : R * 0.382, a = -Math.PI / 2 + k * Math.PI / 5;
            pts.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1));
          }
          return '<polygon fill="#ffffff" points="' + pts.join(" ") + '"/>';
        }
        var html = '<rect width="750" height="500" fill="#c8102e"/>', R = 42 * pos.s, dx = 110 * pos.s, dy = 47 * pos.s;
        for (var i = 0; i < 4; i++) html += star(pos.cx + (i - 1.5) * dx, pos.cy - dy, R);
        for (var j = 0; j < 3; j++) html += star(pos.cx + (j - 1) * dx, pos.cy + dy, R);
        return html; } },
      // Playa de Somo (diseño propio, no oficial): cielo, sol, mar con olas de surf y arena
      SOMO: { color: "#1f78b4", confeti: ["#1f78b4", "#f4c95d", "#8fd3f4"], svg: function () {
        return '<rect width="750" height="500" fill="#8fd3f4"/>' +
          '<circle cx="590" cy="105" r="62" fill="#ffd23f"/>' +
          '<path d="M0 205 Q95 170 190 205 T380 205 T570 205 T760 205 V500 H0 Z" fill="#1f78b4"/>' +
          '<path d="M0 262 Q95 232 190 262 T380 262 T570 262 T760 262" fill="none" stroke="#ffffff" stroke-width="13" stroke-linecap="round"/>' +
          '<path d="M-20 318 Q75 290 170 318 T360 318 T550 318 T740 318" fill="none" stroke="#bfe6fb" stroke-width="10" stroke-linecap="round"/>' +
          '<path d="M0 372 Q125 345 250 372 T500 372 T760 372 V500 H0 Z" fill="#f4d58d"/>' +
          '<path d="M0 372 Q125 345 250 372 T500 372 T760 372" fill="none" stroke="#ffffff" stroke-width="7"/>'; } },
      // Cantabria (bandera civil, sin escudo): blanco arriba y rojo abajo
      CB: { color: "#d52b1e", confeti: ["#d52b1e", "#d9d9d9"], svg: function () {
        return '<rect width="750" height="250" fill="#ffffff"/><rect y="250" width="750" height="250" fill="#d52b1e"/>'; } },
      FR: { color: "#002654", confeti: ["#002654", "#ce1126"], svg: function () {
        return '<rect width="250" height="500" fill="#002654"/><rect x="250" width="250" height="500" fill="#ffffff"/><rect x="500" width="250" height="500" fill="#ce1126"/>'; } },
      IT: { color: "#008c45", confeti: ["#008c45", "#cd212a"], svg: function () {
        return '<rect width="250" height="500" fill="#008c45"/><rect x="250" width="250" height="500" fill="#f4f5f0"/><rect x="500" width="250" height="500" fill="#cd212a"/>'; } },
      PL: { color: "#dc143c", confeti: ["#dc143c", "#d9d9d9"], svg: function () {
        return '<rect width="750" height="250" fill="#ffffff"/><rect y="250" width="750" height="250" fill="#dc143c"/>'; } },
      BR: { color: "#009c3b", confeti: ["#009c3b", "#ffdf00", "#002776"], svg: function () {
        var stars = [[318, 292, 6], [352, 318, 5], [384, 300, 6], [410, 326, 5], [436, 296, 6], [372, 344, 5], [338, 270, 4], [456, 318, 4]]
          .map(function (s) { return '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="' + s[2] + '" fill="#ffffff"/>'; }).join("");
        return '<rect width="750" height="500" fill="#009c3b"/><polygon points="64,250 375,42 686,250 375,458" fill="#ffdf00"/>' +
          '<defs><clipPath id="br-globe"><circle cx="375" cy="250" r="131"/></clipPath></defs>' +
          '<circle cx="375" cy="250" r="131" fill="#002776"/>' +
          '<path d="M232 226 Q380 176 516 290" fill="none" stroke="#ffffff" stroke-width="24" clip-path="url(#br-globe)"/>' + stars; } },
      US: { color: "#0a3161", confeti: ["#b31942", "#0a3161"], svg: function () {
        var W = 750, H = 500, stripe = H / 13, cw = W * 0.4, ch = stripe * 7, html = "", R = H * 0.0308;
        for (var i = 0; i < 13; i++) html += '<rect y="' + (i * stripe) + '" width="' + W + '" height="' + (stripe + 0.5) + '" fill="' + (i % 2 === 0 ? "#b31942" : "#ffffff") + '"/>';
        html += '<rect width="' + cw + '" height="' + ch + '" fill="#0a3161"/>';
        function star(cx, cy) {
          var pts = [];
          for (var k = 0; k < 10; k++) {
            var r = k % 2 === 0 ? R : R * 0.382, a = -Math.PI / 2 + k * Math.PI / 5;
            pts.push((cx + r * Math.cos(a)).toFixed(2) + "," + (cy + r * Math.sin(a)).toFixed(2));
          }
          return '<polygon fill="#ffffff" points="' + pts.join(" ") + '"/>';
        }
        for (var row = 0; row < 9; row++) {
          var y = (row + 1) * ch / 10, n = row % 2 === 0 ? 6 : 5;
          for (var c = 0; c < n; c++) html += star(row % 2 === 0 ? (2 * c + 1) * cw / 12 : (2 * c + 2) * cw / 12, y);
        }
        return html; } }
    };
    // Bandera partida: "ES+CB" en vertical (mitad izquierda y mitad derecha); "MD/CB" en diagonal
    var flagSeq = 0;
    function flagOf(code) {
      var raw = String(code || "").toUpperCase(), diag = raw.indexOf("/") !== -1, parts = raw.split(diag ? "/" : "+");
      if (parts.length === 2 && FLAGS[parts[0]] && FLAGS[parts[1]]) {
        var A = FLAGS[parts[0]], B = FLAGS[parts[1]];
        return { color: A.color, confeti: A.confeti.concat(B.confeti), svg: function () {
          var id = "fl" + (++flagSeq);
          var ca = diag ? '<polygon points="0,0 750,0 0,500"/>' : '<rect width="375" height="500"/>';
          var cb = diag ? '<polygon points="750,0 750,500 0,500"/>' : '<rect x="375" width="375" height="500"/>';
          return '<defs><clipPath id="' + id + 'a">' + ca + '</clipPath><clipPath id="' + id + 'b">' + cb + '</clipPath></defs>' +
            '<g clip-path="url(#' + id + 'a)">' + A.svg(diag ? { cx: 215, cy: 150, s: 0.62 } : null) + '</g>' +
            '<g clip-path="url(#' + id + 'b)">' + B.svg() + '</g>' +
            (diag ? '<line x1="750" y1="0" x2="0" y2="500" stroke="#ffffff" stroke-width="8"/>' : ''); } };
      }
      return FLAGS[String(code || "").toUpperCase()] || { color: "#5c5c60", confeti: ["#5c5c60", "#a3a3a8"], svg: function () {
        return '<rect width="750" height="500" fill="#e0e0dd"/><text x="375" y="290" text-anchor="middle" font-size="140" font-weight="700" fill="#5c5c60">' +
          String(code || "?").replace(/[<>&"]/g, "") + "</text>"; } };
    }
    var FP = flagOf(P.bandera), FU = SOLO ? FP : flagOf(U.bandera || "US");
    I.FLAGS = FLAGS; I.flagOf = flagOf; I.FP = FP; I.FU = FU;
    document.documentElement.style.setProperty("--c-pais", P.color || FP.color);

    // Última versión vista (la usa la página de entrada para abrir directamente esta)
    if ((CFG.versiones || []).length) try { localStorage.setItem(SHARED + "ultima", JSON.stringify({ id: CFG.version, url: location.href.split("#")[0], t: Date.now() })); } catch (e) {}

    /* ---------- Fechas: utilidades ---------- */
    function pad2(n) { return (n < 10 ? "0" : "") + n; }
    function keyOf(y, m, d) { return y + "-" + pad2(m) + "-" + pad2(d); }
    function shiftDays(y, m, d, k) { var x = new Date(Date.UTC(y, m - 1, d + k)); return [x.getUTCFullYear(), x.getUTCMonth() + 1, x.getUTCDate()]; }
    function dayNum(k) { var p = k.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000; }
    function easterSunday(y) {           // algoritmo gregoriano anónimo (Meeus/Jones/Butcher)
      var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
          f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
          i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
          mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
      return [y, mes, dia];
    }
    function nthWeekday(y, r) {
      var dim = new Date(Date.UTC(y, r.mes, 0)).getUTCDate(), days = [];
      for (var d = 1; d <= dim; d++) if (new Date(Date.UTC(y, r.mes - 1, d)).getUTCDay() === r.diaSemana) days.push(d);
      return r.orden === -1 ? days[days.length - 1] : days[r.orden - 1];
    }
    // fecha "MM-DD" o "AAAA-MM-DD", regla { mes, diaSemana, orden, desplazamiento } o pascua (días respecto al Domingo de Resurrección)
    function ymdOfRule(x, y) {
      if (x.pascua != null) { var e = easterSunday(y); return shiftDays(e[0], e[1], e[2], x.pascua); }
      if (x.regla) {
        var d = nthWeekday(y, x.regla);
        return d ? shiftDays(y, x.regla.mes, d, x.regla.desplazamiento || 0) : null;
      }
      if (x.fecha) {
        var f = x.fecha.replace(/\s/g, "");
        if (f.length === 10) return +f.slice(0, 4) === y ? [y, +f.slice(5, 7), +f.slice(8, 10)] : null;
        var mm = +f.slice(0, 2), dd = +f.slice(3, 5);
        if (mm === 2 && dd === 29 && new Date(Date.UTC(y, 1, 29)).getUTCMonth() !== 1) return null;
        return [y, mm, dd];
      }
      return null;
    }
    function stripAcc(x) { return String(x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
    I.pad2 = pad2; I.keyOf = keyOf; I.shiftDays = shiftDays; I.dayNum = dayNum; I.easterSunday = easterSunday;
    I.nthWeekday = nthWeekday; I.ymdOfRule = ymdOfRule; I.stripAcc = stripAcc;
    // Número de día que cambia a medianoche de la zona principal (frase y expresiones del día)
    I.dayNumber = function () { var td = todayYMD(); return Math.floor(Date.UTC(td[0], td[1] - 1, td[2]) / 86400000); };

    /* ---------- Peticiones a internet ---------- */
    I.fetchJSON = function (url) {
      return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
    };
    I.withTimeout = function (url, ms) {
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); }, ms || 8000);
      return fetch(url, ctl ? { signal: ctl.signal } : {}).then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error(r.status); return r; },
        function (e) { clearTimeout(timer); throw e; });
    };
    // Servicios intermedios para leer RSS/Atom de otras webs. Una sola lista para toda la página:
    // si uno deja de funcionar, se cambia aquí y afecta a avisos y noticias a la vez.
    I.PROXIES = [
      { via: "allorigins", url: "https://api.allorigins.win/raw?url=" },
      { via: "codetabs", url: "https://api.codetabs.com/v1/proxy/?quest=" }
    ];
    // Texto de una URL a través de los servicios intermedios, en orden, hasta que uno devuelva XML
    I.fetchRaw = function (url, ms) {
      var i = 0;
      function next() {
        if (i >= I.PROXIES.length) return Promise.reject(new Error("sin respuesta"));
        var px = I.PROXIES[i++];
        return I.withTimeout(px.url + encodeURIComponent(url), ms || 10000).then(function (r) { return r.text(); })
          .then(function (t) { if (!/<(feed|rss)[\s>]/i.test(t)) throw new Error("no es XML"); return { texto: t, via: px.via }; })
          .catch(next);
      }
      return next();
    };

    /* ---------- Lugares del tiempo (los comparten tiempo, tiempo-buscador y sol-aire) ----------
       En el orden de "ordenTiempo" (por defecto EE. UU. arriba y el país debajo), después lugaresExtra
       y, si la página tiene el apartado tiempo-buscador, el lugar buscado (se recuerda en este navegador). */
    var LUGARES = (CFG.ordenTiempo || (SOLO ? ["pais"] : ["usa", "pais"])).map(function (k) {
      var X = k === "pais" ? P : U, W = X.tiempo || {};
      return { key: k === "pais" ? "p" : "u", nombre: W.nombre || X.ciudadReloj, lat: W.lat, lon: W.lon, zonaHoraria: X.zonaHoraria,
               unidad: W.unidad || "celsius", mostrarAmbasUnidades: !!W.mostrarAmbasUnidades, dias: CFG.diasTiempo || 6 };
    }).concat((CFG.lugaresExtra || []).map(function (L, i) {
      return { key: "x" + i, nombre: L.nombre, lat: L.lat, lon: L.lon, zonaHoraria: L.zonaHoraria || tzMain,
               unidad: L.unidad || "celsius", mostrarAmbasUnidades: !!L.mostrarAmbasUnidades, dias: CFG.diasTiempo || 6 };
    }));
    if (I.pagina.tiene("tiempo-buscador")) {
      var sv = load("lugar") || {};
      LUGARES.push({ key: "s", buscador: true, nombre: sv.nombre || "", lat: sv.lat, lon: sv.lon, zonaHoraria: sv.zonaHoraria || tzMain,
                     unidad: "celsius", mostrarAmbasUnidades: false, dias: CFG.diasTiempo || 6 });
    }
    I.lugares = LUGARES;
    I.guardarLugar = function (D) { store("lugar", D.lat == null ? null : { nombre: D.nombre, lat: D.lat, lon: D.lon, zonaHoraria: D.zonaHoraria }); };
    return true;
  }
})();
