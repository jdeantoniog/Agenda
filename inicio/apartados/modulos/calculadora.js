/* =============================================================
   APARTADO: CALCULADORA
   Operaciones básicas, porcentaje (200 + 10 % = 220, como en el móvil),
   cambio de signo, "=" repetido y copiar el resultado. También con el
   teclado, pero solo cuando el foco está en la calculadora o en ninguna
   parte: no interfiere con el conversor, el buscador ni otros botones.
   Números con el formato del idioma de la página. No guarda nada.
   ============================================================= */
Inicio.apartado("calculadora", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T;
  var SYM = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  var nf = new Intl.NumberFormat(I.LOC, { maximumFractionDigits: 10 });
  var DEC = (nf.formatToParts(1.5).filter(function (p) { return p.type === "decimal"; })[0] || { value: "," }).value;

  function k(id, cls, txt, aria) {
    return '<button type="button" class="calc-key' + (cls ? " " + cls : "") + '" data-k="' + id + '"' +
      (aria ? ' aria-label="' + I.esc(T[aria]) + '"' : "") + (id === "C" ? ' id="calc-clear"' : "") + ">" + (txt || id) + "</button>";
  }
  box.innerHTML =
    '<section class="card" id="calc-card" aria-labelledby="calc-title">' +
    '<div class="calc">' +
    '<div class="calc-head"><h2 id="calc-title"></h2><button type="button" class="chip" id="calc-copy"></button></div>' +
    '<div class="calc-screen" aria-live="polite"><div class="calc-expr" id="calc-expr"></div><div class="calc-result" id="calc-result">0</div></div>' +
    '<div class="calc-keys" id="calc-keys">' +
    k("C", "fn", "AC") + k("neg", "fn", "±", "calcSigno") + k("%", "fn", "%", "calcPorcentaje") + k("/", "op", "÷", "calcDividir") +
    k("7") + k("8") + k("9") + k("*", "op", "×", "calcMultiplicar") +
    k("4") + k("5") + k("6") + k("-", "op", "−", "calcRestar") +
    k("1") + k("2") + k("3") + k("+", "op", "+", "calcSumar") +
    k("0", "zero", "0") + k(".", "", DEC, "calcDecimal") + k("=", "eq", "=", "calcIgual") +
    '</div>' +
    '<p class="calc-hint" id="calc-hint"></p>' +
    '</div></section>';
  $("calc-title").textContent = T.calculadora;
  $("calc-copy").textContent = T.calcCopiar;
  $("calc-hint").textContent = T.calcPista;
  var card = $("calc-card");

  // Estado: primer operando, operación pendiente y número que se está escribiendo
  var acc = null, op = null, entry = "0", fresh = true, lastOp = null, lastArg = null, err = false;

  function round(x) { return Math.abs(x) < 1e-12 ? 0 : parseFloat(x.toPrecision(12)); }
  function calc(a, o, b) {
    if (o === "+") return a + b;
    if (o === "-") return a - b;
    if (o === "*") return a * b;
    if (b === 0) throw new Error("div0");
    return a / b;
  }
  function show(n) {                      // número con el formato del idioma; muy grandes o pequeños en notación científica
    if (!isFinite(n)) return "—";
    var a = Math.abs(n);
    if (a !== 0 && (a >= 1e15 || a < 1e-9)) return n.toExponential(6).replace(".", DEC).replace("e", " × 10^");
    return nf.format(n);
  }
  function showEntry() {                  // lo que se escribe, respetando ceros y la coma final
    var neg = entry.charAt(0) === "-", s = neg ? entry.slice(1) : entry, p = s.split(".");
    var ent = nf.format(+p[0] || 0);
    return (neg ? "-" : "") + ent + (p.length > 1 ? DEC + p[1] : "");
  }
  function render() {
    var r = $("calc-result");
    r.classList.toggle("error", err);
    if (!err) r.textContent = fresh && acc !== null && op === null ? show(acc) : showEntry();
    $("calc-expr").textContent = acc !== null && op ? show(acc) + " " + SYM[op] : "";
    $("calc-clear").textContent = entry !== "0" && !fresh ? "C" : "AC";
    Array.prototype.forEach.call(card.querySelectorAll(".calc-key.op"), function (b) {
      b.setAttribute("aria-pressed", String(op === b.dataset.k && fresh));
    });
  }
  function fail(msg) { err = true; acc = null; op = null; entry = "0"; fresh = true; $("calc-result").textContent = msg; render(); }
  function digit(d) {
    if (err) { err = false; }
    if (fresh) { entry = d === "." ? "0." : d; fresh = false; lastOp = null; return; }
    if (d === "." && entry.indexOf(".") !== -1) return;
    if (entry.replace(/[-.]/g, "").length >= 15) return;
    entry = entry === "0" && d !== "." ? d : entry === "-0" && d !== "." ? "-" + d : entry + d;
  }
  function operator(o) {
    if (err) return;
    var x = +entry;
    try {
      if (op && !fresh) acc = round(calc(acc, op, x));
      else if (acc === null || (!op && !fresh)) acc = x;
    } catch (e) { fail(T.calcDivCero); return; }
    op = o; fresh = true; lastOp = null;
  }
  function equals() {
    if (err) return;
    try {
      if (op) {
        var b = fresh ? acc : +entry;
        lastOp = op; lastArg = b;
        acc = round(calc(acc, op, b)); op = null;
      } else if (lastOp) {                  // "=" repetido: repite la última operación
        acc = round(calc(acc === null ? +entry : acc, lastOp, lastArg));
      } else { acc = +entry; }
    } catch (e) { fail(T.calcDivCero); return; }
    entry = String(acc); fresh = true;
  }
  function percent() {                    // 200 + 10 % = 220 (como en el móvil); sola: 10 % = 0,1
    if (err) return;
    var x = +entry, v = op && (op === "+" || op === "-") && acc !== null ? acc * x / 100 : x / 100;
    entry = String(round(v)); fresh = false;
  }
  function press(key) {
    if (/^[0-9.]$/.test(key)) digit(key);
    else if (SYM[key]) operator(key);
    else if (key === "=") equals();
    else if (key === "%") percent();
    else if (key === "neg") {
      if (fresh && acc !== null && !op) { acc = -acc; entry = String(acc); }
      else entry = entry.charAt(0) === "-" ? entry.slice(1) : "-" + entry;
    } else if (key === "C") {
      if (entry !== "0" && !fresh) { entry = "0"; fresh = false; }
      else { acc = null; op = null; entry = "0"; fresh = true; lastOp = null; }
      err = false;
    } else if (key === "back") {
      if (fresh || err) return;
      entry = entry.length > 1 && entry !== "-0" ? entry.slice(0, -1) : "0";
      if (entry === "-") entry = "0";
    }
    render();
  }
  $("calc-keys").addEventListener("click", function (e) { var b = e.target.closest(".calc-key"); if (b) press(b.dataset.k); });
  $("calc-result").addEventListener("click", function () { press("back"); });

  // Teclado: solo si el foco está en la calculadora o en ninguna parte (no en campos ni en otros botones)
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var a = document.activeElement;
    if (a && a !== document.body && !card.contains(a)) return;
    var key = e.key, map = { ",": ".", Enter: "=", Escape: "C", Delete: "C", Backspace: "back", x: "*", X: "*" };
    key = map[key] || key;
    if (/^[0-9.+\-*/=%]$/.test(key) || key === "C" || key === "back") { e.preventDefault(); press(key); }
  });
  $("calc-copy").addEventListener("click", function () {
    var t = $("calc-result").textContent, b = this;
    function done(ok) { b.textContent = ok ? T.calcCopiado : T.calcNoCopiado; setTimeout(function () { b.textContent = T.calcCopiar; }, 1500); }
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });
  render();
});
