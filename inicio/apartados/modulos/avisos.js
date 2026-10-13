/* =============================================================
   APARTADO: AVISOS METEOROLÓGICOS (MeteoAlarm)
   config.js > avisos: { feed, minutosCache, zonas: [{ nombre, buscar: ["zona de AEMET", …] }] }.
   El feed Atom de MeteoAlarm trae los avisos oficiales (CAP) de cada país;
   se lee a través de los servicios intermedios del núcleo. Cada 15 min.
   Sin "avisos" en config.js, el apartado no se muestra.
   ============================================================= */
Inicio.apartado("avisos", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx, CFG = I.CFG, LOC = I.LOC, tzMain = I.tzMain, store = I.store, load = I.load, ago = I.ago, stripAcc = I.stripAcc;

  box.innerHTML = '<section class="card" id="alerts-card" aria-labelledby="alerts-title" hidden>' +
    '<h2 id="alerts-title"></h2><div id="alerts-body" aria-live="polite"></div><p class="small muted" id="alerts-foot"></p></section>';
  $("alerts-title").textContent = T.avisos;

  var AV = CFG.avisos;
  function parseAlerts(xml) {
    var doc = new DOMParser().parseFromString(xml, "text/xml");
    return Array.prototype.map.call(doc.getElementsByTagName("entry"), function (e) {
      function g(tag) { var x = e.getElementsByTagName(tag)[0]; return x ? x.textContent.trim() : ""; }
      var lvl = (g("cap:awareness_level") + " " + g("cap:severity") + " " + g("title")).toLowerCase();
      var nivel = /red|extreme|rojo/.test(lvl) ? 2 : /orange|severe|naranja/.test(lvl) ? 1 : /yellow|moderate|amarill/.test(lvl) ? 0 : -1;
      return { area: g("cap:areaDesc"), evento: g("cap:event") || g("title"), nivel: nivel,
               desde: Date.parse(g("cap:onset") || g("cap:effective")) || 0, hasta: Date.parse(g("cap:expires")) || 0 };
    }).filter(function (a) { return a.nivel >= 0 && (!a.hasta || a.hasta > Date.now()); });
  }
  function renderAlerts(st) {
    var body = $("alerts-body"), foot = $("alerts-foot");
    body.innerHTML = "";
    if (!st) { body.innerHTML = '<p class="status">' + T.cargandoAvisos + "</p>"; return; }
    if (!st.items) { body.innerHTML = '<p class="status warn">' + T.errAvisos + "</p>"; foot.textContent = ""; return; }
    var df = new Intl.DateTimeFormat(LOC, { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: tzMain });
    (AV.zonas || []).forEach(function (z) {
      var div = document.createElement("div"), h = document.createElement("h3"), ul = document.createElement("ul");
      div.className = "alert-zone"; ul.className = "alert-list"; h.textContent = z.nombre;
      var keys = [].concat(z.buscar || z.nombre).map(stripAcc);
      var mine = st.items.filter(function (a) { var ar = stripAcc(a.area); return keys.some(function (k) { return ar.indexOf(k) !== -1; }); })
        .sort(function (a, b) { return b.nivel - a.nivel || a.desde - b.desde; });
      if (!mine.length) { var li0 = document.createElement("li"); li0.className = "muted"; li0.textContent = T.sinAvisos; ul.appendChild(li0); }
      mine.forEach(function (a) {
        var li = document.createElement("li"), dot = document.createElement("i"), txt = document.createElement("span"), when = document.createElement("span");
        dot.className = "alert-dot " + ["amarillo", "naranja", "rojo"][a.nivel]; dot.setAttribute("aria-hidden", "true");
        var dice = /amarill|naranja|rojo|yellow|orange|red\b|giall|arancion|rosso|jaune|rouge/i.test(a.evento);
        txt.textContent = a.evento + (dice ? "" : " · " + T.avisoNivel[a.nivel]) + (a.area ? " · " + a.area : "");
        when.className = "alert-when";
        when.textContent = a.desde && a.hasta ? tx("avisoDesdeHasta", df.format(a.desde), df.format(a.hasta)) : "";
        txt.appendChild(when); li.appendChild(dot); li.appendChild(txt); ul.appendChild(li);
      });
      div.appendChild(h); div.appendChild(ul); body.appendChild(div);
    });
    foot.textContent = st.saved ? tx("avisosGuardados", ago(st.t)) : tx("avisosFuente", ago(st.t));
  }
  function loadAlerts(force) {
    if (!AV) return;
    $("alerts-card").hidden = false;
    var c = load("avisos");
    if (!force && c && Date.now() - c.t < (AV.minutosCache || 30) * 60000) { renderAlerts({ items: c.items, t: c.t }); return; }
    if (!c) renderAlerts(null);
    I.fetchRaw(AV.feed).then(function (r) {
      var items = parseAlerts(r.texto);
      store("avisos", { t: Date.now(), items: items });
      renderAlerts({ items: items, t: Date.now() });
    }).catch(function () {
      renderAlerts(c ? { items: c.items.filter(function (a) { return !a.hasta || a.hasta > Date.now(); }), t: c.t, saved: true } : {});
    });
  }

  I.on("actualizar", function (o) { loadAlerts(o.forzar); });
  setInterval(function () { loadAlerts(false); }, 15 * 60 * 1000);
});
