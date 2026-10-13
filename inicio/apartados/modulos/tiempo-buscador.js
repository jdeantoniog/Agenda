/* =============================================================
   APARTADO: TIEMPO EN OTRO LUGAR (buscador)
   Tarjeta de tiempo con buscador (Open-Meteo Geocoding) y botón
   "Mi ubicación" (geolocalización del navegador + nombre con
   BigDataCloud). El lugar elegido se recuerda en este navegador.
   Si la página tiene "sol-aire", también sale allí.
   Avisos que emite: "lugar" (ha cambiado el lugar) y "lugar-listo"
   (ya se sabe su zona horaria: sol-aire puede cargar).
   ============================================================= */
Inicio.apartado("tiempo-buscador", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx, P = I.P, LANG = I.LANG, tzMain = I.tzMain, fetchJSON = I.fetchJSON;
  var D = I.lugares.filter(function (x) { return x.buscador; })[0];
  var wrap = document.createElement("div");
  wrap.className = "details";
  wrap.appendChild(I.tiempo.tarjeta(D));
  box.appendChild(wrap);
  var n = D.key;

  function setLugar(L) {
    D.nombre = L ? L.nombre : ""; D.lat = L ? L.lat : null; D.lon = L ? L.lon : null; D.zonaHoraria = L ? (L.zonaHoraria || "auto") : tzMain;
    I.guardarLugar(D);
    $("detail-title-" + n).textContent = L ? tx("tiempoEn", D.nombre) : T.tiempoOtroLugar;
    $("ps-clear").hidden = !L;
    I.emit("lugar", D);
    if (L) $("today-" + n).innerHTML = '<p class="status">' + T.cargandoTiempo + '</p>';
    I.tiempo.cargar(D, function () { I.emit("lugar-listo", D); });
    if (!L) I.emit("lugar-listo", D);
  }

  var inp = $("ps-input"), list = $("ps-list"), msg = $("ps-msg"), timer, seq = 0;
  var homeCC = (P.festivosOnline && P.festivosOnline.pais) || "ES";
  inp.placeholder = T.buscarLugar; inp.setAttribute("aria-label", T.buscarLugar);
  $("ps-geo").textContent = T.miUbicacion; $("ps-clear").textContent = T.quitar;
  $("ps-clear").hidden = D.lat == null;
  function hide() { list.hidden = true; list.innerHTML = ""; }
  function note(t, cls) { list.innerHTML = '<li class="' + cls + '"></li>'; list.firstChild.textContent = t; list.hidden = false; }
  inp.addEventListener("input", function () {
    clearTimeout(timer);
    var q = inp.value.trim();
    if (q.length < 2) { hide(); return; }
    timer = setTimeout(function () {
      var my = ++seq;
      fetchJSON("https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(q) + "&count=8&language=" + LANG + "&format=json")
        .then(function (d) {
          if (my !== seq) return;
          var r = (d && d.results) || [];
          if (!r.length) { note(T.sinResultados, "muted"); return; }
          list.innerHTML = "";
          r.forEach(function (x) {
            var li = document.createElement("li"), b = document.createElement("button");
            b.type = "button"; b.className = "ps-opt"; b.innerHTML = "<b></b><span></span>";
            b.firstChild.textContent = x.name;
            b.lastChild.textContent = [x.admin2 && x.admin2 !== x.name ? x.admin2 : "", x.admin1 && x.admin1 !== x.admin2 ? x.admin1 : "", x.country].filter(Boolean).join(", ");
            b.addEventListener("click", function () {
              hide(); inp.value = ""; inp.blur(); msg.textContent = "";
              var foreign = x.country_code && x.country_code !== homeCC;
              setLugar({ nombre: x.name + (foreign && x.country ? " (" + x.country + ")" : ""), lat: x.latitude, lon: x.longitude, zonaHoraria: x.timezone || "auto" });
            });
            li.appendChild(b); list.appendChild(li);
          });
          list.hidden = false;
        })
        .catch(function () { if (my === seq) note(T.errBuscar, "status warn"); });
    }, 350);
  });
  inp.addEventListener("keydown", function (e) { if (e.key === "Escape") { hide(); inp.value = ""; } });
  $("ps-clear").addEventListener("click", function () { msg.textContent = ""; setLugar(null); });
  $("ps-geo").addEventListener("click", function () {
    if (!navigator.geolocation) { msg.textContent = T.sinGeo; return; }
    msg.textContent = T.buscandoUbicacion;
    navigator.geolocation.getCurrentPosition(function (pos) {
      var la = +pos.coords.latitude.toFixed(4), lo = +pos.coords.longitude.toFixed(4);
      fetchJSON("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + la + "&longitude=" + lo + "&localityLanguage=" + LANG)
        .then(function (d) { return (d && (d.city || d.locality || d.principalSubdivision)) || ""; }, function () { return ""; })
        .then(function (name) {
          msg.textContent = "";
          setLugar({ nombre: name ? tx("aquiNombre", name) : T.tuUbicacion, lat: la, lon: lo, zonaHoraria: "auto" });
        });
    }, function (err) {
      msg.textContent = err && err.code === 1 ? T.geoDenegada : T.geoError;
    }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
  });

  function cargar() { I.tiempo.cargar(D); }
  I.on("actualizar", cargar);
  setInterval(cargar, 30 * 60 * 1000);
});
