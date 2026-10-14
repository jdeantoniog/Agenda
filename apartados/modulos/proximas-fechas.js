/* =============================================================
   APARTADO: PRÓXIMAS FECHAS
   Lo que viene en los próximos proximasFechasDias días (mínimo
   mostrarFechas), con cuenta atrás en vivo. Misma fuente que el
   calendario (librería "marcas").
   ============================================================= */
Inicio.apartado("proximas-fechas", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, CFG = I.CFG, LOC = I.LOC, tzMain = I.tzMain, keyOf = I.keyOf, shiftDays = I.shiftDays,
      todayYMD = I.todayYMD, midnightIn = I.midnightIn;
  var M = I.marcas, marksOn = M.marksOn, tagOf = M.tagOf, tagText = M.tagText;

  box.innerHTML = '<section class="card" id="dates-card" aria-labelledby="dates-title"><h2 id="dates-title"></h2><ul class="dlist" id="dates"></ul></section>';
  $("dates-title").textContent = T.proximas;

  var datesDay = "";
  function renderDates() {
    var td = todayYMD(), items = [], min = CFG.mostrarFechas || 12, dias = CFG.proximasFechasDias || 31,
        excl = CFG.proximasFechasExcluir || [];
    datesDay = keyOf(td[0], td[1], td[2]);
    for (var k = 0; k < 400; k++) {
      if (k > dias && items.length >= min) break;
      var r = shiftDays(td[0], td[1], td[2], k);
      marksOn(r[0], r[1], r[2]).forEach(function (m) {
        if ((m.tipo === "evt" || m.tipo === "esc") && !m.inicio && k > 0) return;      // un rango aparece una vez
        if (m.tipo === "evt" && excl.indexOf(m.categoria) !== -1) return;              // categorías que solo van al calendario
        items.push({ r: r, k: k, m: m });
      });
    }
    var ul = $("dates"), rows = Math.ceil(items.length / 2);
    ul.innerHTML = "";
    ul.style.gridTemplateRows = "repeat(" + Math.max(rows, 1) + ", auto)";
    if (!items.length) { ul.innerHTML = '<li class="col-top"><span class="muted">' + T.noFechas + '</span></li>'; return; }
    var dfmt = new Intl.DateTimeFormat(LOC, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
    items.forEach(function (x, i) {
      var li = document.createElement("li"), tag = tagOf(x.m);
      if (i === 0 || i === rows) li.className = "col-top";
      li.innerHTML = '<span class="tag ' + tag + '">' + tagText(tag) + '</span><span class="d-txt"><span class="d-name"></span>' +
        '<span class="d-when"></span><span class="d-cd"></span></span>';
      li.querySelector(".d-name").textContent = x.m.nombre + (x.m.provisional && !x.m.online && x.m.tipo !== "fest" ? T.porConfirmarParen : "");
      li.querySelector(".d-when").textContent = dfmt.format(new Date(Date.UTC(x.r[0], x.r[1] - 1, x.r[2])));
      var cd = li.querySelector(".d-cd");
      if (x.k === 0) { cd.textContent = x.m.desde && !x.m.inicio ? T.enCurso : T.esHoy; cd.classList.add("today"); }
      else cd.dataset.t = midnightIn(tzMain, x.r[0], x.r[1], x.r[2]);
      ul.appendChild(li);
    });
    tickDates();
  }
  // Cuenta atrás en vivo: "4 días · 13:11:04" o "2 meses 3 días · 13:11:04"
  function addMonths(tm, n) {
    var d = new Date(tm), day = d.getDate();
    d.setDate(1); d.setMonth(d.getMonth() + n);
    d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
    return d.getTime();
  }
  function breakdown(from, to) {
    var months = 0;
    while (addMonths(from, months + 1) <= to) months++;
    var rest = Math.floor((to - addMonths(from, months)) / 1000);
    var weeks = Math.floor(rest / 604800); rest -= weeks * 604800;
    var days = Math.floor(rest / 86400); rest -= days * 86400;
    var hours = Math.floor(rest / 3600); rest -= hours * 3600;
    var mins = Math.floor(rest / 60);
    return [months, weeks, days, hours, mins, rest - mins * 60];
  }
  function tickDates() {
    var now = Date.now(), td = todayYMD();
    if (keyOf(td[0], td[1], td[2]) !== datesDay) { renderDates(); return; }   // ha cambiado el día
    Array.prototype.forEach.call(document.querySelectorAll("#dates .d-cd[data-t]"), function (el) {
      var tt = +el.dataset.t;
      if (tt <= now) { renderDates(); return; }
      var b = breakdown(now, tt), d = b[1] * 7 + b[2], txt = "";
      if (b[0]) txt = b[0] + " " + (b[0] === 1 ? T.mes : T.mesesVarios && !(b[0] % 10 >= 2 && b[0] % 10 <= 4 && (b[0] % 100 < 12 || b[0] % 100 > 14)) ? T.mesesVarios : T.mesesN) + " ";
      if (d || !b[0]) txt += d + " " + (d === 1 ? T.dia : T.dias);
      el.textContent = txt.trim() + " · " + [b[3], b[4], b[5]].map(function (v) { return String(v).padStart(2, "0"); }).join(":");
    });
  }
  setInterval(tickDates, 1000);

  I.on("actualizar", function () { M.preparar(); renderDates(); });
  I.on("marcas", renderDates);
});
