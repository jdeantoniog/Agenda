/* =============================================================
   APARTADO: RELOJES
   Banderas del país y de EE. UU. (y las de lugaresExtra con bandera),
   hora, lugar, día, diferencia horaria y tiempo actual debajo de cada
   bandera (si la página tiene el apartado "tiempo"). Al tocar la
   bandera del país, menú para cambiar de versión (config.js > versiones).
   ============================================================= */
Inicio.apartado("relojes", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx, CFG = I.CFG, P = I.P, U = I.U, SOLO = I.SOLO, tzP = I.tzP, tzU = I.tzU, tzMain = I.tzMain;
  var fmtTime = I.fmtTime, fmtDate = I.fmtDate, offsetMinutes = I.offsetMinutes, nf1 = I.nf1, flagOf = I.flagOf;

  box.innerHTML =
    '<section id="hora-local">' +
    '  <div class="flags">' +
    '    <div class="flag-block">' +
    '      <button type="button" class="flag-btn" id="flag-p-btn" aria-expanded="false" aria-controls="ver-menu" disabled><svg class="flag" id="flag-p" viewBox="0 0 750 500" role="img"></svg></button>' +
    '      <div class="clock"><span class="wx-ico" id="ico-p" aria-hidden="true"></span><span id="clock-p">--:--</span></div>' +
    '      <div class="clock-place" id="place-p"></div>' +
    '      <div class="clock-date" id="date-p"></div>' +
    '      <div class="clock-wx" id="wx-p"></div>' +
    '    </div>' +
    '    <div class="gap" id="gap"></div>' +
    '    <div class="flag-block">' +
    '      <svg class="flag" id="flag-u" viewBox="0 0 750 500" role="img"></svg>' +
    '      <div class="clock"><span class="wx-ico" id="ico-u" aria-hidden="true"></span><span id="clock-u">--:--</span></div>' +
    '      <div class="clock-place" id="place-u"></div>' +
    '      <div class="clock-date" id="date-u"></div>' +
    '      <div class="clock-wx" id="wx-u"></div>' +
    '    </div>' +
    '  </div>' +
    '  <div class="ver-menu" id="ver-menu" hidden></div>' +
    '</section>';
  $("hora-local").setAttribute("aria-label", T.horaLocal);

  var FP = I.FP, FU = I.FU;
  $("flag-p").innerHTML = FP.svg(); $("flag-p").setAttribute("aria-label", tx("bandera", P.nombreBandera || P.nombre));
  $("flag-u").innerHTML = FU.svg(); $("flag-u").setAttribute("aria-label", tx("bandera", U.nombre));
  // pais.mostrarBandera: false -> sin bandera (queda la hora, el lugar, el día y el tiempo actual)
  if (P.mostrarBandera === false) $("flag-p-btn").hidden = true;
  if (SOLO) {
    $("flag-u").closest(".flag-block").hidden = true;
    $("gap").hidden = true; $("gap").parentNode.classList.add("n1");
  }

  /* ---------- Versiones: menú en la bandera del país ----------
     config.js > versiones: [{ id, bandera, nombre, url }]. La última versión vista la guarda el núcleo. */
  (function () {
    var V = CFG.versiones || [], btn = $("flag-p-btn"), menu = $("ver-menu");
    if (V.length < 2) return;
    btn.disabled = false;
    btn.insertAdjacentHTML("beforeend", '<span class="flag-hint" aria-hidden="true">⇄</span>');
    btn.setAttribute("aria-label", T.cambiarVersion);
    V.forEach(function (v) {
      var a = document.createElement("button");
      a.type = "button"; a.className = "ver-opt";
      if (v.id === CFG.version) a.setAttribute("aria-current", "true");
      a.innerHTML = '<svg viewBox="0 0 750 500" aria-hidden="true">' + flagOf(v.bandera).svg() + "</svg><span></span>";
      a.querySelector("span").textContent = v.nombre;
      a.addEventListener("click", function () { if (v.id !== CFG.version && v.url) location.href = v.url; else toggle(false); });
      menu.appendChild(a);
    });
    function toggle(on) { menu.hidden = !on; btn.setAttribute("aria-expanded", String(on)); }
    btn.addEventListener("click", function () { toggle(menu.hidden); });
  })();

  /* ---------- Banderas adicionales: lugaresExtra con "bandera" (van entre las dos principales) ---------- */
  var EXTRA_FLAGS = (CFG.lugaresExtra || []).map(function (L, i) { return { L: L, key: "x" + i }; }).filter(function (x) { return x.L.bandera; });
  (function () {
    if (!EXTRA_FLAGS.length) return;
    var gap = $("gap"), flags = gap.parentNode;
    EXTRA_FLAGS.forEach(function (x) {
      var k = x.key, div = document.createElement("div");
      div.className = "flag-block";
      div.innerHTML = '<svg class="flag" id="flag-' + k + '" viewBox="0 0 750 500" role="img"></svg>' +
        '<div class="clock"><span class="wx-ico" id="ico-' + k + '" aria-hidden="true"></span><span id="clock-' + k + '">--:--</span></div>' +
        '<div class="clock-place" id="place-' + k + '"></div><div class="clock-date" id="date-' + k + '"></div><div class="clock-wx" id="wx-' + k + '"></div>';
      flags.insertBefore(div, gap);
      $("flag-" + k).innerHTML = flagOf(x.L.bandera).svg();
      $("flag-" + k).setAttribute("aria-label", tx("bandera", x.L.nombreBandera || x.L.nombre));
      $("place-" + k).textContent = x.L.ciudadReloj || x.L.nombre;
    });
    gap.hidden = true;                                   // con tres banderas no cabe la diferencia horaria
    flags.classList.add("n3");
  })();

  /* ---------- Relojes ---------- */
  $("place-p").textContent = P.ciudadReloj;
  $("place-u").textContent = U.ciudadReloj;
  function tickClocks() {
    $("clock-p").textContent = fmtTime(tzP);
    if (!SOLO) $("clock-u").textContent = fmtTime(tzU);
    $("date-p").textContent = fmtDate(tzP);
    if (!SOLO) $("date-u").textContent = fmtDate(tzU);
    EXTRA_FLAGS.forEach(function (x) {
      var tz = x.L.zonaHoraria || tzMain;
      $("clock-" + x.key).textContent = fmtTime(tz); $("date-" + x.key).textContent = fmtDate(tz);
    });
    if (EXTRA_FLAGS.length || SOLO) return;
    if (CFG.mostrarDiferencia === false) { $("gap").hidden = true; $("gap").parentNode.classList.add("no-gap"); return; }
    var diff = Math.abs(offsetMinutes(tzP) - offsetMinutes(tzU)) / 60;
    $("gap").innerHTML = diff ? "<strong>" + (Number.isInteger(diff) ? diff : nf1.format(diff)) + " h</strong>" + T.deDiferencia : "<strong>=</strong>" + T.mismaHora;
  }
  tickClocks();
  setInterval(tickClocks, 15000);

  // Tiempo actual debajo de cada bandera (lo anuncia el apartado "tiempo")
  I.on("tiempo-actual", function (o) {
    var a = $("ico-" + o.key), b = $("wx-" + o.key);
    if (a) a.innerHTML = o.ico; if (b) b.textContent = o.txt;
  });
});
