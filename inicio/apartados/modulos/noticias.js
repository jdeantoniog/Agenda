/* =============================================================
   APARTADO: NOTICIAS
   config.js > noticias: { porPais, minutosCache, paises: [{ nombre, nota, fuentes: [{ nombre, rss }] }] }.
   El navegador no puede leer un RSS de otra web directamente: se pide a
   rss2json y, si falla, a los servicios intermedios del núcleo (8 s cada uno).
   Los titulares de todas las fuentes de un país se mezclan por fecha.
   Sin conexión: última copia guardada. Cada 15 min.
   ============================================================= */
Inicio.apartado("noticias", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx, CFG = I.CFG, store = I.store, load = I.load, ago = I.ago, withTimeout = I.withTimeout;

  box.innerHTML = '<section class="card" id="news-card" aria-labelledby="news-title" hidden>' +
    '<h2 id="news-title"></h2><div class="news-tabs" id="news-tabs" role="group"></div>' +
    '<ul class="news-list" id="news-list" aria-live="polite"></ul><p class="small muted" id="news-foot"></p></section>';
  $("news-title").textContent = T.noticias;
  $("news-tabs").setAttribute("aria-label", T.pais || "País");

  var NEWS = CFG.noticias, newsSel = 0, newsData = {};
  function newsItemsFromXML(xml) {
    var doc = new DOMParser().parseFromString(xml, "text/xml");
    var nodes = doc.querySelectorAll("item");
    if (!nodes.length) nodes = doc.querySelectorAll("entry");                 // Atom
    return Array.prototype.map.call(nodes, function (it) {
      function g(tag) { var el = it.querySelector(tag); return el ? el.textContent.trim() : ""; }
      var le = it.querySelector("link"), link = le ? (le.textContent.trim() || le.getAttribute("href") || "") : "";
      return { title: g("title"), link: link, date: g("pubDate") || g("updated") || g("published"), source: g("source") };
    });
  }
  // rss2json primero (devuelve JSON); después los servicios intermedios comunes del núcleo (allorigins, codetabs…)
  var PROXIES = [
    { via: "rss2json", go: function (u) {
      return withTimeout("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (d) {
        if (!d || d.status !== "ok" || !(d.items || []).length) throw new Error("rss2json");
        return d.items.map(function (it) { return { title: it.title, link: it.link, date: it.pubDate, source: "" }; });
      }); } }
  ].concat(I.PROXIES.map(function (px) {
    return { via: px.via, go: function (u) {
      return withTimeout(px.url + encodeURIComponent(u)).then(function (r) { return r.text(); }).then(function (t) {
        var x = newsItemsFromXML(t); if (!x.length) throw new Error(px.via); return x; }); } };
  }));
  // Prueba los servicios en orden hasta que uno devuelva titulares
  function fetchFeed(url) {
    var i = 0;
    function next() {
      if (i >= PROXIES.length) return Promise.reject(new Error("sin respuesta"));
      var P3 = PROXIES[i++];
      return P3.go(url).then(function (items) { return { items: items, via: P3.via }; }, next);
    }
    return next();
  }
  function cleanNews(raw) {
    var seen = {};
    return raw.map(function (x) {
      var title = String(x.title || "").replace(/\s+/g, " "), src = String(x.source || "");
      if (x.splitSource) {                                                  // "Titular - Medio" (Google News)
        var m = title.match(/^(.*)\s[-–]\s([^-–]{2,60})$/);
        if (m) { title = m[1]; if (!src) src = m[2]; }
      }
      var ds = String(x.date || ""), iso = /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/.test(ds);   // rss2json: "AAAA-MM-DD hh:mm:ss" en UTC
      var d = Date.parse(iso ? ds.replace(" ", "T") + "Z" : ds);
      var link = /^https?:\/\//i.test(String(x.link || "").trim()) ? String(x.link).trim() : "";
      return { t: title.trim(), s: src.trim(), l: link, d: isNaN(d) ? 0 : d };
    }).filter(function (x) {
      var k = x.t.toLowerCase();
      if (!x.t || !x.l || seen[k]) return false;
      seen[k] = 1; return true;
    }).sort(function (a, b) { return b.d - a.d; }).slice(0, NEWS.porPais || 8);
  }
  function renderNews() {
    if (!NEWS) return;
    var P2 = NEWS.paises[newsSel], st = newsData[newsSel], ul = $("news-list"), foot = $("news-foot");
    ul.innerHTML = "";
    Array.prototype.forEach.call($("news-tabs").children, function (b, i) { b.setAttribute("aria-pressed", String(i === newsSel)); });
    if (!st) { ul.innerHTML = '<li class="muted">' + T.cargandoNoticias + "</li>"; foot.textContent = ""; return; }
    var diag = (st.diag || []).map(function (f) { return f.nombre + " (" + (f.ok ? f.via : T.sinRespuesta) + ")"; }).join(", ");
    if (!st.items || !st.items.length) { ul.innerHTML = '<li class="status warn">' + T.sinNoticias + "</li>"; foot.textContent = diag ? T.fuentes + diag : ""; return; }
    st.items.forEach(function (x) {
      var li = document.createElement("li"), a = document.createElement("a"), meta = document.createElement("span");
      a.href = x.l; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = x.t;
      meta.className = "news-meta"; meta.textContent = [x.s, x.d ? ago(x.d) : ""].filter(Boolean).join(" · ");
      li.appendChild(a); li.appendChild(meta); ul.appendChild(li);
    });
    foot.textContent = (st.saved ? tx("noticiasGuardadas", ago(st.t)) : tx("noticiasActualizadas", ago(st.t))) + " " +
      (P2.nota || T.noticiasFuente) + (diag ? " " + T.fuentes + diag + "." : "");
  }
  function loadNews(force) {
    if (!NEWS) return;
    NEWS.paises.forEach(function (P2, i) {
      var key = "noticias:" + i, c = load(key);
      if (c && c.items && !newsData[i]) newsData[i] = { items: c.items, t: c.t, saved: true, diag: c.diag };
      if (!force && c && Date.now() - c.t < (NEWS.minutosCache || 30) * 60000) { newsData[i] = { items: c.items, t: c.t, diag: c.diag }; renderNews(); return; }
      var fuentes = P2.fuentes || [{ nombre: "", rss: P2.rss }];
      Promise.all(fuentes.map(function (f) {
        return fetchFeed(f.rss).then(function (r) {
          r.items.forEach(function (x) { if (f.nombre) x.source = f.nombre; else x.splitSource = true; });
          return { nombre: f.nombre || "RSS", ok: true, via: r.via, items: r.items };
        }, function () { return { nombre: f.nombre || "RSS", ok: false, items: [] }; });
      })).then(function (res) {
        var diag = res.map(function (r) { return { nombre: r.nombre, ok: r.ok, via: r.via }; });
        var items = cleanNews([].concat.apply([], res.map(function (r) { return r.items; })));
        if (items.length) {
          store(key, { t: Date.now(), items: items, diag: diag });
          newsData[i] = { items: items, t: Date.now(), diag: diag };
        } else {
          newsData[i] = c && c.items ? { items: c.items, t: c.t, saved: true, diag: diag } : { items: [], diag: diag };
        }
        renderNews();
      });
    });
    renderNews();
  }
  (function () {
    if (!NEWS || !(NEWS.paises || []).length) return;
    $("news-card").hidden = false;
    NEWS.paises.forEach(function (P2, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = P2.nombre;
      b.addEventListener("click", function () { newsSel = i; renderNews(); });
      $("news-tabs").appendChild(b);
    });
    if (NEWS.paises.length === 1) $("news-tabs").hidden = true;
  })();

  I.on("actualizar", function (o) { loadNews(o.forzar); });
  setInterval(function () { loadNews(false); }, 15 * 60 * 1000);
});
