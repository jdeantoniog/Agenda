/* =============================================================
   APARTADO: SOL Y AIRE
   Índice UV por hora y calidad del aire (Open-Meteo), un bloque por
   lugar del tiempo (incluido el buscado, si la página tiene
   "tiempo-buscador"). Se actualiza cada 30 min.
   ============================================================= */
Inicio.apartado("sol-aire", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx, ago = I.ago, store = I.store, load = I.load, keyOf = I.keyOf,
      todayIn = I.todayIn, localParts = I.localParts, fetchJSON = I.fetchJSON, DETAILS = I.lugares;

  box.innerHTML = '<section class="card" id="uv-card" aria-labelledby="uv-title"><h2 id="uv-title"></h2><div id="uv-wrap"></div></section>';
  $("uv-title").textContent = T.solAire;

  // Las horas se centran solas en el pico de UV de cada lugar (mediodía solar).
  var UV_TXT = T.uvTxt;
  function uvClass(v) { return v < 3 ? 0 : v < 6 ? 1 : v < 8 ? 2 : v < 11 ? 3 : 4; }
  var AQ_TXT = T.aqTxt;
  function aqClass(v) { return v <= 50 ? 0 : v <= 100 ? 1 : v <= 150 ? 2 : v <= 200 ? 3 : v <= 300 ? 4 : 5; }
  (function buildUV() {
    var wrap = $("uv-wrap");
    DETAILS.forEach(function (D) {
      var n = D.key, div = document.createElement("div");
      div.className = "uv-place";
      div.innerHTML = '<div class="uv-head"><strong id="uv-name-' + n + '"></strong>' +
        '<span class="aq" id="aq-' + n + '"><span class="dot" aria-hidden="true"></span><span id="aq-text-' + n + '">' + T.cargandoAire + '</span></span></div>' +
        '<div class="uv-bar" id="uv-bar-' + n + '"><p class="status">' + T.cargandoUV + '</p></div>' +
        '<p class="uv-note small muted" id="uv-note-' + n + '"></p>';
      wrap.appendChild(div);
      $("uv-name-" + n).textContent = D.nombre || T.tiempoOtroLugar;
    });
  })();
  function renderUV(D, n, d, savedAt) {
    var td = todayIn(D.zonaHoraria), todayStr = keyOf(td[0], td[1], td[2]), nowH = +localParts(D.zonaHoraria).hour;
    var rows = [], maxV = -1, maxH = null;
    d.hourly.time.forEach(function (tm, i) {
      if (tm.slice(0, 10) !== todayStr) return;
      var h = +tm.slice(11, 13), v = d.hourly.uv_index[i];
      rows.push({ h: h, v: v });
      if (v != null && v > maxV) { maxV = v; maxH = h; }
    });
    if (!rows.length) return false;
    var c0 = maxH == null ? 13 : maxH, from = Math.max(0, c0 - 3), to = Math.min(23, c0 + 4), html = "";
    rows.forEach(function (x) {
      if (x.h < from || x.h > to) return;
      html += '<div class="uv-cell' + (x.h === nowH ? " now" : "") + '">' +
        '<span class="uv-val uv' + (x.v == null ? 0 : uvClass(x.v)) + '">' + (x.v == null ? "—" : Math.round(x.v)) + "</span>" +
        '<span class="uv-hour">' + x.h + "h</span></div>";
    });
    $("uv-bar-" + n).innerHTML = html;
    $("uv-bar-" + n).setAttribute("aria-label", tx("uvAria", D.nombre));
    $("uv-note-" + n).textContent = (savedAt ? tx("datosGuardados", ago(savedAt)) : "") + (maxV >= 0
      ? tx("uvMax", Math.round(maxV), UV_TXT[uvClass(maxV)], maxH) + (maxV >= 3 ? T.protSi : T.protNo) : "");
    var aq = !savedAt && d.current && d.current.us_aqi;
    if (aq != null && aq !== false) {
      var c = aqClass(aq);
      $("aq-" + n).className = "aq a" + c;
      $("aq-text-" + n).textContent = tx("aire", Math.round(aq), AQ_TXT[c]);
    } else {
      $("aq-" + n).className = "aq";
      $("aq-text-" + n).textContent = T.aireSinDatos;
    }
    return true;
  }
  function loadUVOne(D, n) {
    if (!$("uv-bar-" + n)) return;
    if (D.lat == null) { $("uv-bar-" + n).innerHTML = '<p class="status">' + T.buscaLugar + '</p>'; $("aq-text-" + n).textContent = ""; $("uv-note-" + n).textContent = ""; return; }
    fetchJSON("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + D.lat + "&longitude=" + D.lon +
      "&current=us_aqi&hourly=uv_index&forecast_days=1&timezone=" + encodeURIComponent(D.zonaHoraria))
      .then(function (d) {
        if (!renderUV(D, n, d, null)) throw new Error("sin datos de hoy");
        store("uv:" + D.key, { t: Date.now(), d: d, lat: D.lat, lon: D.lon });
      })
      .catch(function () {
        var c = load("uv:" + D.key);
        if (c && c.d && (!D.buscador || (c.lat === D.lat && c.lon === D.lon)) && renderUV(D, n, c.d, c.t)) return;
        $("uv-bar-" + n).innerHTML = '<p class="status warn">' + T.errUV + '</p>';
        $("aq-text-" + n).textContent = T.aireSinDatos;
      });
  }
  function loadUV() { DETAILS.forEach(function (D) { loadUVOne(D, D.key); }); }

  I.on("actualizar", loadUV);
  setInterval(loadUV, 30 * 60 * 1000);
  // Lugar buscado: el nombre cambia al momento; los datos, cuando ya se sabe su zona horaria
  I.on("lugar", function (D) { var el = $("uv-name-" + D.key); if (el) el.textContent = D.nombre || T.tiempoOtroLugar; });
  I.on("lugar-listo", function (D) { loadUVOne(D, D.key); });
});
