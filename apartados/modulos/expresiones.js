/* =============================================================
   APARTADO: EXPRESIONES ÚTILES
   palabrasPorDia expresiones al día (datos/palabras.js > EXPRESIONES),
   mezclando un poco de cada bloque. Modo repaso y aprendidas: se
   guardan en el navegador y se comparten entre todas las versiones.
   ============================================================= */
Inicio.apartado("expresiones", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx, CFG = I.CFG, LANG = I.LANG, learnTxt = I.learnTxt, dayNumber = I.dayNumber,
      store = I.store, load = I.load, LEARNED_KEY = I.LEARNED_KEY;

  box.innerHTML =
    '<section class="card" id="expr-card" aria-labelledby="expr-title" hidden>' +
    '<div class="x-head"><h2 id="expr-title"></h2><button type="button" class="chip" id="expr-mode" aria-pressed="false"></button></div>' +
    '<ul class="xlist" id="expr-list"></ul>' +
    '<p class="x-foot small muted"><span id="expr-count"></span> <button type="button" class="linkbtn" id="expr-reset" hidden></button></p>' +
    '</section>';
  $("expr-title").textContent = T.expresiones; $("expr-mode").textContent = T.repaso; $("expr-reset").textContent = T.reiniciar;
  document.documentElement.style.setProperty("--toca-ver", JSON.stringify(T.tocaVer));

  function dailySlice(list, n) {
    if (list.length <= n) return list.slice();
    var start = (dayNumber() * n) % list.length, out = [];
    for (var i = 0; i < n; i++) out.push(list[(start + i) % list.length]);
    return out;
  }
  function renderExpr() {
    var E = window.EXPRESIONES, card = $("expr-card");
    if (!E) { card.hidden = true; return; }
    // Todas las listas mezcladas por turnos; las aprendidas salen de la rotación
    var learned = load(LEARNED_KEY, true) || {}, total = 0;
    var groups = Object.keys(E).map(function (k) { return E[k] || []; }), list = [];
    var longest = Math.max.apply(null, groups.map(function (g) { return g.length; }));
    for (var i = 0; i < longest; i++) groups.forEach(function (g) { if (g[i]) { total++; if (!learned[learnTxt(g[i])]) list.push(g[i]); } });
    if (!list.length) { card.hidden = true; return; }
    var ul = $("expr-list"), today = dailySlice(list, CFG.palabrasPorDia || 20), rows = Math.ceil(today.length / 2);
    ul.innerHTML = "";
    ul.style.gridTemplateRows = "repeat(" + rows + ", auto)";
    today.forEach(function (w, i) {
      var li = document.createElement("li");
      if (i === 0 || i === rows) li.className = "col-top";
      li.innerHTML = '<span class="x-en"></span><span class="x-es"></span><button type="button" class="x-chk" aria-label="' + T.marcarAprendida + '">✓</button>';
      li.children[0].textContent = learnTxt(w);
      li.children[1].textContent = w[LANG] != null ? w[LANG] : w.es;
      li.dataset.en = learnTxt(w);
      ul.appendChild(li);
    });
    var nL = Object.keys(learned).length;
    $("expr-count").textContent = nL ? tx("aprendidasDe", nL, total) : T.marcaCirculo;
    $("expr-reset").hidden = !nL;
    card.hidden = false;
  }
  (function () {
    var btn = $("expr-mode"), ul = $("expr-list");
    function setMode(on) { btn.setAttribute("aria-pressed", String(on)); ul.classList.toggle("repaso", on); store("repaso", on, true); }
    setMode(!!load("repaso", true));
    btn.addEventListener("click", function () { setMode(btn.getAttribute("aria-pressed") !== "true"); });
    ul.addEventListener("click", function (e) {
      var li = e.target.closest("li");
      if (!li) return;
      if (e.target.closest(".x-chk")) {
        var L = load(LEARNED_KEY, true) || {};
        if (L[li.dataset.en]) delete L[li.dataset.en]; else L[li.dataset.en] = Date.now();
        store(LEARNED_KEY, L, true);
        li.classList.toggle("learned", !!L[li.dataset.en]);
        var n = Object.keys(L).length;
        $("expr-count").textContent = n ? tx("aprendidasManana", n) : "";
        $("expr-reset").hidden = !n;
        return;
      }
      if (ul.classList.contains("repaso")) li.classList.toggle("show");
    });
    $("expr-reset").addEventListener("click", function () {
      if (!window.confirm(T.confirmReiniciar)) return;
      store(LEARNED_KEY, {}, true); renderExpr();
    });
  })();

  I.on("actualizar", renderExpr);
});
