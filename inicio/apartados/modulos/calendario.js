/* =============================================================
   APARTADO: CALENDARIO
   Calendario mensual con festivos de los dos países, familia,
   escolar, eventos, días señalados, cambios de hora y santoral.
   Las marcas vienen de la librería "marcas" (misma fuente que
   "próximas fechas").
   ============================================================= */
Inicio.apartado("calendario", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx, CFG = I.CFG, P = I.P, SOLO = I.SOLO, LOC = I.LOC, ago = I.ago,
      keyOf = I.keyOf, pad2 = I.pad2, todayYMD = I.todayYMD, countryName = I.countryName, src = I.src;
  var M = I.marcas, ONLINE = M.ONLINE, SPORT_CATS = M.SPORT_CATS, marksOn = M.marksOn,
      tagOf = M.tagOf, tagText = M.tagText, shortDate = M.shortDate, rangeTxt = M.rangeTxt;
  var FLECHA = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'; };

  box.innerHTML =
    '<section class="card" id="cal-card" aria-labelledby="cal-title">' +
    '<h2 id="cal-title"></h2>' +
    '<div class="cal-nav">' +
    '<button type="button" class="cal-btn" id="cal-prev">' + FLECHA("M15 5l-7 7 7 7") + '</button>' +
    '<div class="cal-month"><span id="cal-month" aria-live="polite"></span><button type="button" class="chip" id="cal-today" hidden></button></div>' +
    '<button type="button" class="cal-btn" id="cal-next">' + FLECHA("M9 5l7 7-7 7") + '</button>' +
    '</div>' +
    '<p class="cal-warn" id="cal-warn" hidden></p>' +
    '<div class="cal-grid" id="cal-grid"></div>' +
    '<div class="cal-legend" aria-hidden="true">' +
    '<span><i class="sw fest-p"></i><span id="leg-p"></span></span>' +
    '<span><i class="sw fest-u"></i><span id="leg-u"></span></span>' +
    '<span><i class="sw prov"></i><span id="leg-prev"></span></span>' +
    '<span><i class="sw dot d-fam"></i><span id="leg-fam"></span></span>' +
    '<span><i class="sw dot d-sen"></i><span id="leg-sen"></span></span>' +
    '<span><i class="sw dot d-esc"></i><span id="leg-esc"></span></span>' +
    '<span><i class="sw dot d-evt"></i><span id="leg-evt"></span></span>' +
    '</div>' +
    '<p class="cal-status" id="cal-status"></p>' +
    '<div class="cal-detail" id="cal-detail" aria-live="polite"></div>' +
    '</section>';
  [["cal-title", "calendario"], ["cal-today", "hoy"], ["leg-prev", "legPrev"], ["leg-fam", "familia"], ["leg-sen", "diaSenalado"], ["leg-evt", "evento"]]
    .forEach(function (x) { $(x[0]).textContent = T[x[1]]; });
  $("cal-prev").setAttribute("aria-label", T.mesAnt);
  $("cal-next").setAttribute("aria-label", T.mesSig);
  $("leg-p").textContent = tx("festivoDe", countryName("pais"));
  $("leg-u").textContent = tx("festivoDe", countryName("usa"));
  if (SOLO) $("leg-u").parentNode.hidden = true;
  $("leg-esc").textContent = (CFG.calendario && CFG.calendario.nombreEscolar) || T.escolar;

  var calY, calM, calSel;
  var MONTHS = T.meses;
  function evtMeta(m) {
    return [m.categoria || T.evento, rangeTxt(m), m.nota || "", m.provisional ? T.fechaConfirmar : "", m.online ? T.datoOnline : ""].filter(Boolean).join(" · ");
  }
  function festMeta(m) {
    var X = src(m.pais), N = X.festivosOnline || {};
    return tx("festivoDe", countryName(m.pais)) + (m.ambito ? " · " + m.ambito : "") +
      (m.online ? T.fuenteOnline + (m.provisional ? (X.fuenteOficial ? tx("pendConfirmarCon", X.fuenteOficial) : T.pendConfirmar) : "") :
       m.estimado ? T.previsto : m.provisional ? T.pendAprob : "");
  }
  function senMeta(m) { return [T.diaSenalado + (!SOLO && (m.pais === "usa" || m.pais === "pais") ? " · " + countryName(m.pais) : ""), m.nota || ""].filter(Boolean).join(" · "); }
  function escMeta(m) {
    var C = CFG.calendario || {};
    return [m.etiqueta || C.nombreEscolar || T.calEscolar, rangeTxt(m), m.nota || "", m.provisional ? T.porConfirmar : ""].filter(Boolean).join(" · ");
  }
  function renderCalendar() {
    var td = todayYMD(), grid = $("cal-grid");
    $("cal-month").textContent = MONTHS[calM - 1].charAt(0).toUpperCase() + MONTHS[calM - 1].slice(1) + " " + calY;
    $("cal-today").hidden = calY === td[0] && calM === td[1];
    var first = (new Date(Date.UTC(calY, calM - 1, 1)).getUTCDay() + 6) % 7;     // lunes = 0
    var dim = new Date(Date.UTC(calY, calM, 0)).getUTCDate();
    var html = "";
    T.iniciales.forEach(function (w) { html += '<div class="cal-dow">' + w + "</div>"; });
    for (var i = 0; i < first; i++) html += '<div class="cal-day empty" aria-hidden="true"></div>';
    for (var d = 1; d <= dim; d++) {
      var marks = marksOn(calY, calM, d), cls = "cal-day", dots = "", label = tx("diaDe", d, MONTHS[calM - 1]);
      ["pais", "usa"].forEach(function (which) {
        var f = marks.filter(function (x) { return x.tipo === "fest" && x.pais === which; }), s = which === "pais" ? "p" : "u";
        if (f.some(function (x) { return !x.provisional; })) cls += " fest-" + s;
        else if (f.length) cls += " prov-" + s;
      });
      if ((first + d - 1) % 7 === 6) cls += " sun";
      if (calY === td[0] && calM === td[1] && d === td[2]) { cls += " today"; label += T.esHoyAria; }
      if (marks.some(function (x) { return x.tipo === "fam"; })) dots += '<i class="d-fam"></i>';
      if (marks.some(function (x) { return x.tipo === "esc"; })) dots += '<i class="d-esc"></i>';
      if (marks.some(function (x) { return x.tipo === "evt"; })) dots += '<i class="d-evt"></i>';
      if (marks.some(function (x) { return x.tipo === "sen"; })) dots += '<i class="d-sen"></i>';
      if (marks.length) label += ": " + marks.map(function (x) { return x.nombre; }).join(", ");
      html += '<button type="button" class="' + cls + '" data-d="' + d + '" aria-pressed="' + (d === calSel) + '" aria-label="' +
        label.replace(/"/g, "&quot;") + '"><span>' + d + '</span><span class="cal-dots">' + dots + "</span></button>";
    }
    grid.innerHTML = html;
    renderCalDetail();
  }
  function renderCalDetail() {
    var box = $("cal-detail"), marks = marksOn(calY, calM, calSel);
    var dt = new Date(Date.UTC(calY, calM - 1, calSel));
    box.innerHTML = '<p class="cal-date"></p>';
    box.firstChild.textContent = new Intl.DateTimeFormat(LOC, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(dt);
    if (marks.length) {
      var ul = document.createElement("ul");
      ul.className = "cal-marks";
      marks.forEach(function (m) {
        var li = document.createElement("li"), tag = tagOf(m);
        li.innerHTML = '<span class="tag ' + tag + '">' + tagText(tag) + '</span><span><span class="nm"></span><span class="meta"></span></span>';
        li.querySelector(".nm").textContent = m.nombre;
        li.querySelector(".meta").textContent = m.tipo === "fest" ? festMeta(m) : m.tipo === "fam" ? T.familia :
          m.tipo === "evt" ? evtMeta(m) : m.tipo === "esc" ? escMeta(m) : senMeta(m);
        ul.appendChild(li);
      });
      box.appendChild(ul);
    } else {
      box.insertAdjacentHTML("beforeend", '<p class="cal-none">' + T.nadaMarcado + '</p>');
    }
    var S = window.SANTORAL, santo = S && S[pad2(calM) + "-" + pad2(calSel)];
    if (santo) {
      var p = document.createElement("p");
      p.className = "cal-santo";
      p.innerHTML = "<b></b> <span></span>"; p.querySelector("b").textContent = T.santoral;
      p.querySelector("span").textContent = santo;
      box.appendChild(p);
    }
  }
  // Avisos de datos caducados o a punto de caducar + estado de las fuentes online
  function renderCalStatus() {
    var C = CFG.calendario || {}, td = todayYMD(), y = td[0], warn = [], info = [], todayK = keyOf(td[0], td[1], td[2]);
    function future(x) { return (x.hasta || x.fecha) >= todayK; }
    if (P.fuenteOficial && P.avisarFestivos !== false) {
      var F = P.festivos || {};
      if (!F[y]) warn.push(tx("warnFestivos", countryName("pais"), y));
      if (td[1] >= 10 && !F[y + 1]) warn.push(tx("warnFestivosSig", y + 1, P.fuenteOficial));
    }
    if (C.escolar && !C.escolar.some(future))
      warn.push(tx("warnEscolar", C.nombreEscolar ? tx("deX", C.nombreEscolar) : ""));
    var ev = C.eventos || [];
    if (!ev.some(function (x) { return future(x) && SPORT_CATS.indexOf(x.categoria) === -1; }))
      warn.push(T.warnEventos);
    var sportFuture = ev.some(function (x) { return future(x) && SPORT_CATS.indexOf(x.categoria) !== -1; }) ||
      (ONLINE.sport || []).some(function (e) { return e.key >= todayK; });
    if (SPORT_CATS.length && !sportFuture && td[1] >= 6 && td[1] <= 9)
      warn.push(tx("warnPartidos", SPORT_CATS.join(", ")));
    var st = ONLINE.status;
    if (st.sport) info.push(st.sport.ok ? tx("stPartidos", st.sport.t ? ago(st.sport.t) : "") :
      st.sport.t ? tx("stPartidosCopia", ago(st.sport.t)) : T.stPartidosConfig);
    ["pais", "usa"].forEach(function (w) {
      var s = st.fest[w];
      if (s) info.push(s.ok ? tx("stFestivos", countryName(w), s.y) : tx("stSinFestivos", countryName(w), s.y));
    });
    var wEl = $("cal-warn");
    wEl.hidden = !warn.length; wEl.textContent = warn.join(" ");
    $("cal-status").textContent = info.join(" · ");
  }
  function goMonth(y, m, sel) {
    calY = y; calM = m;
    var td = todayYMD();
    calSel = sel || (y === td[0] && m === td[1] ? td[2] : 1);
    renderCalendar();
  }
  function stepMonth(k) { var x = new Date(Date.UTC(calY, calM - 1 + k, 1)); goMonth(x.getUTCFullYear(), x.getUTCMonth() + 1); }
  $("cal-prev").addEventListener("click", function () { stepMonth(-1); });
  $("cal-next").addEventListener("click", function () { stepMonth(1); });
  $("cal-today").addEventListener("click", function () { var td = todayYMD(); goMonth(td[0], td[1]); });
  $("cal-grid").addEventListener("click", function (e) {
    var b = e.target.closest(".cal-day");
    if (!b || !b.dataset.d) return;
    calSel = +b.dataset.d;
    Array.prototype.forEach.call(this.querySelectorAll(".cal-day[aria-pressed]"), function (x) {
      x.setAttribute("aria-pressed", String(+x.dataset.d === calSel));
    });
    renderCalDetail();
  });
  function renderCalendarToday() { var td = todayYMD(); M.preparar(); goMonth(td[0], td[1]); renderCalStatus(); }

  I.on("actualizar", renderCalendarToday);
  I.on("marcas", function () { if (calY) renderCalendar(); renderCalStatus(); });
  I.on("marcas-estado", renderCalStatus);
});
