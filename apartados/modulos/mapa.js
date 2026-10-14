/* =============================================================
   APARTADO: DÓNDE ESTOY (mapa de ubicación)
   Al pulsar "Ver mi ubicación": posición del móvil (pide permiso),
   mapa de Google insertado (sin clave), nombre del sitio con
   BigDataCloud, enlace para abrir Google Maps y copiar coordenadas.
   No se carga nada hasta pulsar el botón. No guarda nada.
   ============================================================= */
Inicio.apartado("mapa", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx, P = I.P, LANG = I.LANG;
  var homeCC = (P.festivosOnline && P.festivosOnline.pais) || "ES";   // país de la página: no se repite en el nombre
  var pos = null;

  box.innerHTML =
    '<section class="card" id="map-card" aria-labelledby="map-title">' +
    '<div class="map-loc">' +
    '<h2 id="map-title"></h2>' +
    '<p class="map-place" id="map-place"></p>' +
    '<p class="map-meta" id="map-meta"></p>' +
    '<div class="map-box" id="map-box"><div class="map-empty" id="map-empty"></div></div>' +
    '<div class="map-actions">' +
    '<button type="button" class="chip map-main" id="map-locate"></button>' +
    '<a class="chip" id="map-open" target="_blank" rel="noopener" hidden></a>' +
    '<button type="button" class="chip" id="map-copy" hidden></button>' +
    '</div>' +
    '<p class="map-msg" id="map-msg" aria-live="polite"></p>' +
    '</div></section>';
  $("map-title").textContent = T.mapaTitulo;
  $("map-place").textContent = T.mapaNoConsultada;
  $("map-meta").textContent = T.mapaPermiso;
  $("map-empty").textContent = T.mapaPulsa;
  $("map-locate").textContent = T.mapaVer;
  $("map-open").textContent = T.mapaAbrir;
  $("map-copy").textContent = T.mapaCopiar;

  function msg(t, warn) { $("map-msg").textContent = t || ""; $("map-msg").className = "map-msg" + (warn ? " warn" : ""); }

  // Mapa de Google sin clave (inserción clásica) + enlace directo a la app o web de Google Maps
  function showMap(lat, lon, acc) {
    pos = { lat: lat, lon: lon };
    var q = lat.toFixed(6) + "," + lon.toFixed(6);
    var zoom = acc > 2000 ? 12 : acc > 300 ? 14 : 16;
    $("map-box").innerHTML = '<iframe title="' + I.esc(T.mapaIframe) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=' +
      q + "&z=" + zoom + "&hl=" + LANG + '&output=embed"></iframe>';
    $("map-open").href = "https://www.google.com/maps/search/?api=1&query=" + q;
    $("map-open").hidden = false; $("map-copy").hidden = false;
    $("map-meta").textContent = tx("mapaPrecision", q.replace(",", ", "), Math.round(acc));
    $("map-locate").textContent = T.mapaActualizar;
  }
  // Nombre del sitio (calle, municipio) a partir de las coordenadas
  function nameOf(lat, lon) {
    $("map-place").textContent = T.mapaTu;
    I.fetchJSON("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat + "&longitude=" + lon + "&localityLanguage=" + LANG)
      .then(function (d) {
        var town = d.city || d.locality || "", region = d.principalSubdivision || "", country = d.countryName || "";
        var parts = [town, region !== town ? region : "", country && d.countryCode !== homeCC ? country : ""].filter(Boolean);
        if (parts.length) $("map-place").textContent = parts.join(", ");
      })
      .catch(function () { /* sin nombre: se queda "Tu ubicación" */ });
  }
  $("map-locate").addEventListener("click", function () {
    if (!window.isSecureContext && location.protocol !== "file:") { msg(T.mapaHttps, true); return; }
    if (!navigator.geolocation) { msg(T.mapaSinGeo, true); return; }
    msg(T.mapaBuscando);
    navigator.geolocation.getCurrentPosition(function (p) {
      msg("");
      var lat = p.coords.latitude, lon = p.coords.longitude;
      showMap(lat, lon, p.coords.accuracy || 0);
      nameOf(lat.toFixed(4), lon.toFixed(4));
    }, function (e) {
      msg(e.code === 1 ? T.mapaDenegado : e.code === 3 ? T.mapaTardado : T.mapaError, true);
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  });
  $("map-copy").addEventListener("click", function () {
    if (!pos) return;
    var t = pos.lat.toFixed(6) + ", " + pos.lon.toFixed(6), b = this;
    function done(ok) { b.textContent = ok ? T.mapaCopiadas : T.mapaNoCopiado; setTimeout(function () { b.textContent = T.mapaCopiar; }, 1500); }
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });
});
