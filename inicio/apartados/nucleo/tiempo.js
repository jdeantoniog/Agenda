/* =============================================================
   LIBRERÍA DEL NÚCLEO: TIEMPO (Open-Meteo)
   Iconos, tarjeta de previsión de un lugar y su carga con copia
   guardada. La usan los apartados "tiempo" y "tiempo-buscador".
   El tiempo actual de cada lugar se anuncia con el aviso
   "tiempo-actual" ({ key, ico, txt }); "relojes" lo pinta debajo
   de cada bandera si está en la página.
   ============================================================= */
Inicio.libreria("tiempo", function (I) {
  "use strict";
  var T = I.T, tx = I.tx, store = I.store, load = I.load, ago = I.ago, nf1 = I.nf1, LOC = I.LOC,
      localParts = I.localParts, todayIn = I.todayIn, keyOf = I.keyOf, fetchJSON = I.fetchJSON, $ = I.$;

  var WMO = T.wmo;
  var CLOUD = '<path d="M9 25h15a6 6 0 0 0 0-12a8 8 0 0 0-15 2a5 5 0 0 0 0 10z" fill="var(--cloud)"/>';
  var CLOUD_UP = '<g transform="translate(0,-5)">' + CLOUD + "</g>";
  function sunSvg(cx, cy, r) {
    var rays = "";
    for (var k = 0; k < 8; k++) {
      var a = k * Math.PI / 4, x1 = cx + Math.cos(a) * (r + 2.5), y1 = cy + Math.sin(a) * (r + 2.5),
          x2 = cx + Math.cos(a) * (r + 5.5), y2 = cy + Math.sin(a) * (r + 5.5);
      rays += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
    }
    return '<g stroke="var(--sun)" stroke-width="2" stroke-linecap="round">' + rays + "</g>" +
           '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="var(--sun)"/>';
  }
  function moonSvg(cx, cy, s) {
    return '<path transform="translate(' + cx + "," + cy + ") scale(" + s + ')" d="M2-9a10 10 0 1 0 8 15A8 8 0 0 1 2-9z" fill="#c4cbe0"/>';
  }
  function icon(code, isDay) {
    var day = isDay !== 0, b = "";
    if (code === 0 || code === 1) b = day ? sunSvg(16, 16, 6.5) : moonSvg(16, 16, 1.2);
    else if (code === 2) b = (day ? sunSvg(12, 11, 5) : moonSvg(12, 11, 0.8)) + CLOUD;
    else if (code === 3) b = CLOUD;
    else if (code === 45 || code === 48)
      b = '<g stroke="var(--cloud)" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="11" x2="26" y2="11"/><line x1="4" y1="17" x2="28" y2="17"/><line x1="7" y1="23" x2="25" y2="23"/></g>';
    else if ((code >= 71 && code <= 77) || code === 85 || code === 86)
      b = CLOUD_UP + '<g fill="var(--snow)"><circle cx="10" cy="26" r="2"/><circle cx="16" cy="29" r="2"/><circle cx="22" cy="26" r="2"/></g>';
    else if (code >= 95)
      b = CLOUD_UP + '<path d="M17 19l-5 7h4l-2 6 7-9h-4l2-4z" fill="var(--sun)"/>';
    else if (code >= 51)
      b = CLOUD_UP + '<g stroke="var(--rain)" stroke-width="2" stroke-linecap="round"><line x1="11" y1="23" x2="9" y2="28"/><line x1="17" y1="23" x2="15" y2="28"/><line x1="23" y1="23" x2="21" y2="28"/></g>';
    else b = CLOUD;
    return '<svg viewBox="0 0 32 32" aria-hidden="true">' + b + "</svg>";
  }
  function toF(c) { return c * 9 / 5 + 32; }
  function t(c, unit) { return c == null ? "—" : Math.round(unit === "fahrenheit" ? toF(c) : c) + "°"; }
  function rangeHTML(max, min, unit) {
    return '<span class="tr tmax"><i>' + T.max + '</i><b>' + t(max, unit) + "</b></span>" +
           '<span class="tr tmin"><i>' + T.min + '</i><b>' + t(min, unit) + "</b></span>";
  }
  function otherUnit(u) { return u === "fahrenheit" ? "celsius" : "fahrenheit"; }
  function unitLetter(u) { return u === "fahrenheit" ? "F" : "C"; }
  function hhmm(iso) { return iso ? iso.slice(11, 16) : "—"; }
  function minutesOf(iso) { var p = iso.slice(11, 16).split(":"); return +p[0] * 60 + +p[1]; }
  function dayLabel(dateStr, i) {
    if (i === 0) return T.hoy;
    if (i === 1) return T.manana;
    var p = dateStr.split("-");
    var s = new Intl.DateTimeFormat(LOC, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])));
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function setFlagWx(key, ico, txt) { I.emit("tiempo-actual", { key: key, ico: ico, txt: txt }); }

  // Tarjeta vacía de un lugar (con buscador si D.buscador). Los identificadores llevan la clave del lugar (u, p, x0, s).
  function tarjeta(D) {
    var n = D.key, sec = document.createElement("section");
    sec.className = "card";
    sec.innerHTML = '<h2 id="detail-title-' + n + '"></h2>' +
      (D.buscador ? '<div class="place-search"><input id="ps-input" type="search" autocomplete="off" enterkeyhint="search"></div>' +
        '<ul class="ps-list" id="ps-list" hidden></ul>' +
        '<div class="news-tabs"><button type="button" class="chip" id="ps-geo"></button><button type="button" class="chip" id="ps-clear" hidden></button></div>' +
        '<p class="ps-msg" id="ps-msg"></p>' : '') +
      '<div id="today-' + n + '"><p class="status">' + T.cargandoTiempo + '</p></div>' +
      '<div class="hours" id="hours-' + n + '" aria-label="' + T.horaAHora + '"></div>' +
      '<h3 class="sub">' + T.proximosDias + '</h3>' +
      '<div class="days" id="days-' + n + '"></div>';
    sec.querySelector("h2").textContent = D.buscador && !D.nombre ? T.tiempoOtroLugar : tx("tiempoEn", D.nombre);
    return sec;
  }

  function renderWeather(D, n, d, savedAt) {
    var unit = D.unidad, other = otherUnit(unit), both = D.mostrarAmbasUnidades;
    var dl = d.daily, cur = d.current, hr = d.hourly, td = todayIn(D.zonaHoraria), todayStr = keyOf(td[0], td[1], td[2]);
    var i0 = dl.time.indexOf(todayStr);
    if (i0 < 0) return false;                      // la copia es demasiado antigua para hoy
    var light = minutesOf(dl.sunset[i0]) - minutesOf(dl.sunrise[i0]), rain0 = dl.precipitation_probability_max[i0];
    var nowTxt = savedAt
      ? '<span class="stale">' + tx("prevGuardada", ago(savedAt)) + "</span>"
      : T.ahora + " <strong>" + t(cur.temperature_2m, unit) + "</strong>" +
        (both ? " (" + t(cur.temperature_2m, other) + unitLetter(other) + ")" : "") + " · " + T.sensacion + " " + t(cur.apparent_temperature, unit);
    $("today-" + n).innerHTML =
      '<div class="today-main"><div class="today-left"><span class="today-name">' + T.hoy + '</span>' +
      '<span class="today-ico">' + icon(dl.weather_code[i0], 1) + '</span>' +
      '<span class="today-desc">' + (WMO[dl.weather_code[i0]] || "—") + '</span></div>' +
      '<div class="today-range">' + rangeHTML(dl.temperature_2m_max[i0], dl.temperature_2m_min[i0], unit) + '</div></div>' +
      '<p class="today-meta">' + nowTxt +
      ' · ' + T.lluvia + ' ' + (rain0 == null ? "—" : rain0 + " %") +
      ' · ' + T.amanece + ' ' + hhmm(dl.sunrise[i0]) + ' · ' + T.anochece + ' ' + hhmm(dl.sunset[i0]) +
      ' · ' + tx("deLuz", Math.floor(light / 60), light % 60) + '</p>';

    // Tiempo actual debajo de la bandera
    if (savedAt) setFlagWx(D.key, "", T.sinConexion);
    else setFlagWx(D.key, icon(cur.weather_code, cur.is_day), t(cur.temperature_2m, unit) +
      (both ? " (" + t(cur.temperature_2m, other) + unitLetter(other) + ")" : "") + " · " + (WMO[cur.weather_code] || ""));

    // Hoy hora a hora (00 a 23)
    var nowH = +localParts(D.zonaHoraria).hour, html = "";
    hr.time.forEach(function (tm, i) {
      if (tm.slice(0, 10) !== todayStr) return;
      var h = +tm.slice(11, 13), p = hr.precipitation_probability[i];
      html += '<div class="hour' + (h < nowH ? " past" : h === nowH ? " now" : "") + '">' +
        '<span class="h-t">' + (h === nowH ? T.ahora : String(h).padStart(2, "0") + " h") + '</span>' +
        '<span class="h-i">' + icon(hr.weather_code[i], hr.is_day[i]) + '</span>' +
        '<span class="h-v">' + t(hr.temperature_2m[i], unit) + '</span>' +
        '<span class="h-r">' + (p ? p + " %" : "") + '</span></div>';
    });
    var box = $("hours-" + n);
    box.innerHTML = html;
    var nowEl = box.querySelector(".hour.now");
    box.scrollLeft = nowEl ? Math.max(0, nowEl.offsetLeft - 4) : 0;

    // Días siguientes: desde mañana
    html = "";
    var dias = Math.max(1, Math.min(15, D.dias));
    for (var i = i0 + 1; i < dl.time.length && i <= i0 + dias; i++) {
      var snow = dl.snowfall_sum[i], rain = dl.precipitation_probability_max[i];
      html += '<div class="day">' +
        '<div class="day-head"><span class="day-name">' + dayLabel(dl.time[i], i - i0) + '</span><span class="day-ico">' + icon(dl.weather_code[i], 1) + "</span></div>" +
        '<div class="day-temp">' + rangeHTML(dl.temperature_2m_max[i], dl.temperature_2m_min[i], unit) + "</div>" +
        "<p>" + (WMO[dl.weather_code[i]] || "—") + "</p>" +
        "<p>" + T.sensMin + " " + t(dl.apparent_temperature_min[i], unit) + "</p>" +
        "<p>" + T.lluviaDia + " " + (rain == null ? "—" : rain + " %") + "</p>" +
        (snow > 0 ? '<p class="snow">' + T.nieve + ' ' + nf1.format(snow) + " cm</p>" : "<p>" + T.sinNieve + "</p>") +
        "</div>";
    }
    $("days-" + n).innerHTML = html;
    return true;
  }

  function loadDetailOne(D, n, after) {
    if (D.lat == null) {                                     // tarjeta del buscador sin lugar elegido
      $("today-" + n).innerHTML = '<p class="status">' + T.buscaLugar + '</p>';
      $("hours-" + n).innerHTML = ""; $("days-" + n).innerHTML = "";
      return;
    }
    var dias = Math.max(1, Math.min(15, D.dias));
    fetchJSON("https://api.open-meteo.com/v1/forecast?latitude=" + D.lat + "&longitude=" + D.lon +
      "&current=temperature_2m,apparent_temperature,weather_code,is_day" +
      "&hourly=temperature_2m,weather_code,precipitation_probability,is_day" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_min," +
      "snowfall_sum,precipitation_probability_max,sunrise,sunset" +
      "&forecast_days=" + (dias + 1) + "&timezone=" + encodeURIComponent(D.zonaHoraria))
      .then(function (d) {
        // "auto": la zona horaria la decide Open-Meteo según las coordenadas (lugar buscado o ubicación)
        if (D.zonaHoraria === "auto" && d.timezone) { D.zonaHoraria = d.timezone; if (D.buscador) I.guardarLugar(D); }
        if (!renderWeather(D, n, d, null)) throw new Error("datos sin el día de hoy");
        store("tiempo:" + D.key, { t: Date.now(), d: d, lat: D.lat, lon: D.lon });
        if (after) after();
      })
      .catch(function () {
        var c = load("tiempo:" + D.key);
        if (c && c.d && (!D.buscador || (c.lat === D.lat && c.lon === D.lon)) && renderWeather(D, n, c.d, c.t)) return;
        $("today-" + n).innerHTML = '<p class="status warn">' + T.errTiempo + '</p>';
        $("hours-" + n).innerHTML = "";
        $("days-" + n).innerHTML = "";
        setFlagWx(D.key, "", T.sinDatos);
      });
  }

  I.tiempo = {
    WMO: WMO, icon: icon, t: t, tarjeta: tarjeta,
    cargar: function (D, after) { loadDetailOne(D, D.key, after); }
  };
});
