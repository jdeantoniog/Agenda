/* =============================================================
   APARTADO: CONVERSOR
   Dólares y la moneda del país (config.js > pais.moneda) más
   unidades. Tipo de cambio: BCE (Frankfurter) > ExchangeRate-API >
   última tasa guardada > tasa manual de config.js. Cada 30 min.
   ============================================================= */
Inicio.apartado("conversor", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx, P = I.P, LOC = I.LOC, store = I.store, load = I.load, ago = I.ago, fetchJSON = I.fetchJSON;

  box.innerHTML =
    '<section class="card" id="conv-card" aria-labelledby="conv-title">' +
    '<h2 id="conv-title"></h2>' +
    '<div class="conv">' +
    '<div class="conv-btns" id="conv-btns" role="group"></div>' +
    '<div class="conv-out">' +
    '<div class="field"><label for="conv-a" id="conv-a-label"></label>' +
    '<div class="box"><span class="sym" id="conv-a-sym"></span><input id="conv-a" inputmode="decimal" autocomplete="off" value="20"></div></div>' +
    '<div class="conv-eq" aria-hidden="true">=</div>' +
    '<div class="field"><label for="conv-b" id="conv-b-label"></label>' +
    '<div class="box"><span class="sym" id="conv-b-sym"></span><input id="conv-b" inputmode="decimal" autocomplete="off"></div></div>' +
    '</div>' +
    '</div>' +
    '<p class="rate" id="conv-note"></p>' +
    '</section>';
  $("conv-title").textContent = T.conversor;
  $("conv-btns").setAttribute("aria-label", T.queConvertir);

  var nf2 = new Intl.NumberFormat(LOC, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var nfMax2 = new Intl.NumberFormat(LOC, { maximumFractionDigits: 2 });
  var nf4 = new Intl.NumberFormat(LOC, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  function parseNum(v) {
    v = String(v).replace(/\s/g, "");
    if (v === "") return NaN;
    if (v.indexOf(",") !== -1) v = v.replace(/\./g, "").replace(",", ".");
    return parseFloat(v);
  }
  function lin(f) { return { toB: function (x) { return x * f; }, toA: function (x) { return x / f; } }; }
  var MON = P.moneda || { codigo: "EUR", simbolo: "€", nombre: "Euros" };
  var rate = null;                                   // unidades de la moneda del país por 1 dólar
  var CONV = [
    { id: "money", btn: T.dolares + " / " + MON.nombre.toLowerCase(), main: true, a: T.dolares, sa: "$", b: MON.nombre, sb: MON.simbolo, money: true,
      conv: { toB: function (x) { return rate ? x * rate : NaN; }, toA: function (x) { return rate ? x / rate : NaN; } } },
    { id: "mi", btn: T.bMillas, a: T.millas, sa: "mi", b: T.kilometros, sb: "km", conv: lin(1.609344) },
    { id: "yd", btn: T.bYardas, a: T.yardas, sa: "yd", b: T.metros, sb: "m", conv: lin(0.9144) },
    { id: "f", btn: "°F / °C", a: T.fahrenheit, sa: "°F", b: T.celsius, sb: "°C",
      conv: { toB: function (x) { return (x - 32) * 5 / 9; }, toA: function (x) { return x * 9 / 5 + 32; } } },
    { id: "lb", btn: T.bLibras, a: T.libras, sa: "lb", b: T.kilos, sb: "kg", conv: lin(0.45359237) },
    { id: "oz", btn: T.bOnzas, a: T.onzas, sa: "oz", b: T.gramos, sb: "g", conv: lin(28.349523125) },
    { id: "cup", btn: T.bTazas, a: T.tazas, sa: "cup", b: T.mililitros, sb: "ml", conv: lin(236.5882365) },
    { id: "in", btn: T.bPulgadas, a: T.pulgadas, sa: "in", b: T.centimetros, sb: "cm", conv: lin(2.54) },
    { id: "gal", btn: T.bGalones, a: T.galones, sa: "gal", b: T.litros, sb: "l", conv: lin(3.785411784) },
    { id: "mph", btn: "mph / km/h", a: T.mph, sa: "mph", b: T.kmh, sb: "km/h", conv: lin(1.609344) }
  ];
  var convCur = CONV[0], convA = $("conv-a"), convB = $("conv-b"), rateTxt = T.cargandoCambio, rateWarn = false;
  CONV.forEach(function (u) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "conv-btn" + (u.main ? " main" : ""); b.textContent = u.btn; b.dataset.id = u.id;
    b.setAttribute("aria-pressed", String(u === convCur));
    $("conv-btns").appendChild(b);
  });
  $("conv-btns").addEventListener("click", function (e) {
    var b = e.target.closest(".conv-btn");
    if (!b) return;
    var u = CONV.filter(function (x) { return x.id === b.dataset.id; })[0];
    if (u === convCur) return;
    convCur = u;
    Array.prototype.forEach.call(this.children, function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    convA.value = u.money ? "20" : "1";
    setConv("a");
  });
  function setConv(from) {
    var u = convCur, fmt = u.money ? nf2 : nfMax2;
    $("conv-a-label").textContent = u.a; $("conv-a-sym").textContent = u.sa;
    $("conv-b-label").textContent = u.b; $("conv-b-sym").textContent = u.sb;
    if (from === "a") { var r = u.conv.toB(parseNum(convA.value)); convB.value = isNaN(r) ? "" : fmt.format(r); }
    else { var r2 = u.conv.toA(parseNum(convB.value)); convA.value = isNaN(r2) ? "" : fmt.format(r2); }
    var note = $("conv-note");
    note.className = "rate" + (u.money && rateWarn ? " warn" : "");
    note.textContent = u.money ? rateTxt : u.id === "oz" ? T.notaOnza : u.id === "cup" ? T.notaTaza : u.id === "gal" ? T.notaGalon : "";
  }
  convA.addEventListener("input", function () { setConv("a"); });
  convB.addEventListener("input", function () { setConv("b"); });
  [convA, convB].forEach(function (el) { el.addEventListener("focus", function () { el.select(); }); });

  // Tipo de cambio: BCE (Frankfurter) > ExchangeRate-API > última tasa guardada > tasa manual de config.js
  function showRate(r, txt, warn) {
    rate = r; rateWarn = !!warn;
    rateTxt = "1 $ = " + nf4.format(r) + " " + MON.simbolo + " · 1 " + MON.simbolo + " = " + nf4.format(1 / r) + " $ · " + txt;
    setConv("a");
  }
  function loadRate() {
    var to = MON.codigo;
    fetchJSON("https://api.frankfurter.app/latest?from=USD&to=" + to)
      .then(function (d) { return { r: d.rates[to], src: T.bce, fecha: String(d.date || "").split("-").reverse().join("/") }; })
      .catch(function () {
        return fetchJSON("https://open.er-api.com/v6/latest/USD")
          .then(function (d) { return { r: d.rates[to], src: "ExchangeRate-API", fecha: (d.time_last_update_utc || "").slice(5, 16) }; });
      })
      .then(function (x) {
        if (!(x.r > 0)) throw new Error("sin tasa");
        store("cambio:" + to, { t: Date.now(), r: x.r, src: x.src, fecha: x.fecha });
        showRate(x.r, x.src + (x.fecha ? " (" + x.fecha + ")" : ""), false);
      })
      .catch(function () {
        var c = load("cambio:" + to);
        if (c && c.r) showRate(c.r, tx("tasaGuardada", ago(c.t)), Date.now() - c.t > 3 * 86400000);
        else if (MON.tasaRespaldo) showRate(MON.tasaRespaldo, T.tasaManual, true);
        else { rate = null; rateWarn = true; rateTxt = T.sinCambio; setConv("a"); }
      });
  }
  setConv("a");

  I.on("actualizar", loadRate);
  setInterval(loadRate, 30 * 60 * 1000);
});
