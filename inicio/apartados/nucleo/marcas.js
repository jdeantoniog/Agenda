/* =============================================================
   LIBRERÍA DEL NÚCLEO: MARCAS DEL CALENDARIO Y MENSAJES ESPECIALES
   Una sola fuente para calendario, próximas fechas, frase del día y
   aviso a pantalla completa: festivos (config.js + Nager.Date),
   partidos (config.js + TheSportsDB), cumpleaños y mensajes
   especiales, calendario escolar, eventos, días señalados y cambios
   de hora.
   Avisos que emite:
     "marcas"        han llegado datos online nuevos: volver a pintar
     "marcas-estado" ha cambiado el estado de las fuentes online
   ============================================================= */
Inicio.libreria("marcas", function (I) {
  "use strict";
  var T = I.T, tx = I.tx, CFG = I.CFG, P = I.P, U = I.U, SOLO = I.SOLO, tzU = I.tzU, tzP = I.tzP, tzMain = I.tzMain,
      store = I.store, load = I.load, keyOf = I.keyOf, dayNum = I.dayNum, ymdOfRule = I.ymdOfRule, stripAcc = I.stripAcc,
      localParts = I.localParts, offsetMinutes = I.offsetMinutes, zonedTime = I.zonedTime, bothTimes = I.bothTimes,
      countryName = I.countryName, fetchJSON = I.fetchJSON, src = I.src, LOC = I.LOC;

  var ONLINE = { fest: { usa: {}, pais: {} }, sport: [], status: { fest: {}, sport: null } };
  var OL = CFG.online || {};
  var SP = OL.deportes || {};
  var SPORT_CATS = (SP.equipos || []).map(function (e) { return e.categoria || e.nombre; })
    .concat((SP.ligas || []).map(function (l) { return l.categoria; }));
  function refreshCalendarViews() { marksCache = {}; I.emit("marcas"); }

  // Festivos: los oficiales de config.js mandan; si un año no está, se piden a Nager.Date (nacionales + región)
  function loadOnlineHolidays(which, y) {
    var X = src(which), N = X.festivosOnline;
    if (!OL.festivos || !N || (X.festivos && X.festivos[y]) || ONLINE.fest[which][y]) return;
    var key = "festivos:" + N.pais + ":" + y, c = load(key);
    if (c && c.list) { ONLINE.fest[which][y] = c.list; ONLINE.status.fest[which] = { ok: true, t: c.t, y: y }; }
    if (c && Date.now() - c.t < 7 * 86400000) return;
    ONLINE.fest[which][y] = ONLINE.fest[which][y] || "cargando";
    fetchJSON("https://date.nager.at/api/v3/PublicHolidays/" + y + "/" + N.pais)
      .then(function (arr) {
        var names = X.nombresFestivos || {};
        var list = arr.filter(function (h) {
          return (h.global || (N.region && (h.counties || []).indexOf(N.region) !== -1)) && (!h.types || h.types.indexOf("Public") !== -1);
        }).map(function (h) {
          return { fecha: h.date, nombre: names[h.name] || names[h.localName] || h.localName || h.name,
                   ambito: h.global ? (N.ambitoNacional || "Nacional") : (N.ambitoRegion || N.region),
                   provisional: !N.confirmados, online: true };
        });
        if (!list.length) throw new Error("vacío");
        ONLINE.fest[which][y] = list; store(key, { t: Date.now(), list: list });
        ONLINE.status.fest[which] = { ok: true, t: Date.now(), y: y };
        refreshCalendarViews();
      })
      .catch(function () {
        if (ONLINE.fest[which][y] === "cargando") delete ONLINE.fest[which][y];
        if (!ONLINE.status.fest[which] || !ONLINE.status.fest[which].ok) ONLINE.status.fest[which] = { ok: false, y: y };
        I.emit("marcas-estado");
      });
  }
  function festList(which, y) {
    var X = src(which), official = X.festivos && X.festivos[y];
    if (official) return official;
    loadOnlineHolidays(which, y);
    var online = Array.isArray(ONLINE.fest[which][y]) && ONLINE.fest[which][y];
    var hab = (X.festivosHabituales || []).map(function (h) {
      var r = ymdOfRule(h, y);
      return r && r[0] === y && { fecha: keyOf(r[0], r[1], r[2]), nombre: h.nombre, ambito: h.ambito || "",
        provisional: true, estimado: true, soloConfig: !!h.soloConfig };
    }).filter(Boolean);
    // Los festivos que la fuente online no da (locales de una ciudad) se añaden desde config.js como previstos
    return online ? online.concat(hab.filter(function (h) { return h.soloConfig; })) : hab;
  }

  // Partidos desde TheSportsDB (equipos de config.js > online.deportes)
  var sportsBusy = false;
  var TSDB = "https://www.thesportsdb.com/api/v1/json/" + (SP.clave || "123") + "/";
  function teamsIn(txt) {
    var x = stripAcc(txt);
    return (SP.equipos || []).filter(function (tm) {
      return [].concat(tm.coincide || tm.nombre).some(function (w) { return x.indexOf(stripAcc(w)) !== -1; });
    }).map(function (tm) { return tm.nombre; });
  }
  function tsdbTeamEvents(team) {
    function ok(evs) {
      return evs.filter(function (e) { return teamsIn((e.strHomeTeam || "") + " " + (e.strAwayTeam || "") + " " + (e.strEvent || "")).indexOf(team.nombre) !== -1; });
    }
    function byId(id) { return id ? fetchJSON(TSDB + "eventsnext.php?id=" + id).then(function (d) { return ok((d && d.events) || []); }) : Promise.resolve([]); }
    var cachedId = load("equipo:" + team.nombre) || team.id;
    return byId(cachedId).then(function (evs) {
      if (evs.length) return evs;
      // El identificador no devuelve partidos: se busca el equipo por nombre y se guarda el bueno
      return fetchJSON(TSDB + "searchteams.php?t=" + encodeURIComponent(team.buscar || team.nombre)).then(function (d) {
        var tm = ((d && d.teams) || []).filter(function (x) { return !team.deporte || x.strSport === team.deporte; })[0];
        if (!tm || String(tm.idTeam) === String(cachedId)) return [];
        store("equipo:" + team.nombre, tm.idTeam);
        return byId(tm.idTeam);
      });
    });
  }
  function whenFromUTC(dateStr, timeStr, stamp) {
    var iso = stamp ? String(stamp).replace(" ", "T") : (dateStr + "T" + (timeStr || "00:00:00"));
    if (!/(Z|[+-]\d\d:?\d\d)$/.test(iso)) iso += "Z";
    var dt = new Date(iso);
    if (isNaN(dt)) return null;
    var p = localParts(tzMain, dt), known = !!(stamp || (timeStr && timeStr.slice(0, 5) !== "00:00"));
    return { key: p.year + "-" + p.month + "-" + p.day, nota: known ? bothTimes(dt) : "" };
  }
  function loadOnlineSports() {
    if (!SP.activo || !((SP.equipos || []).length || (SP.ligas || []).length)) return;
    var c = load("deportes");
    if (c && c.list) { ONLINE.sport = c.list; ONLINE.status.sport = { ok: true, t: c.t, cache: true }; }
    if (c && Date.now() - c.t < (SP.horasCache || 12) * 3600000) return;
    if (sportsBusy) return;                              // ya hay una carga en curso (calendario y próximas fechas la piden a la vez)
    sportsBusy = true;
    var jobs = (SP.equipos || []).map(function (tm) {
      return tsdbTeamEvents(tm).then(function (evs) {
        return evs.map(function (e) {
          var w = whenFromUTC(e.dateEvent, e.strTime, e.strTimestamp);
          return w && { id: e.idEvent, key: w.key, nombre: (e.strHomeTeam || "") + " - " + (e.strAwayTeam || ""), categoria: tm.categoria || tm.nombre,
            nota: [e.strLeague, w.nota || T.horaConfirmar, e.strVenue].filter(Boolean).join(" · ") };
        }).filter(Boolean);
      }).catch(function () { return null; });
    });
    // Ligas completas: config.js > online.deportes.ligas: [{ id, categoria, filtro }]
    (SP.ligas || []).forEach(function (lg) {
      jobs.push(fetchJSON(TSDB + "eventsnextleague.php?id=" + lg.id).then(function (d) {
        var re = lg.filtro ? new RegExp(lg.filtro, "i") : null;
        return ((d && d.events) || []).filter(function (e) { return !re || re.test((e.strLeague || "") + " " + (e.strEvent || "")); }).map(function (e) {
          var w = whenFromUTC(e.dateEvent, e.strTime, e.strTimestamp);
          return w && { id: e.idEvent, key: w.key, nombre: e.strEvent, categoria: lg.categoria,
            nota: [w.nota || T.horaConfirmar, e.strVenue || e.strCity].filter(Boolean).join(" · ") };
        }).filter(Boolean);
      }).catch(function () { return null; }));
    });
    Promise.all(jobs).then(function (res) {
      if (res.every(function (r) { return r === null; })) throw new Error("sin respuesta");
      var seen = {}, list = [];
      res.forEach(function (r) { (r || []).forEach(function (e) { if (!seen[e.id]) { seen[e.id] = 1; list.push(e); } }); });
      ONLINE.sport = list; store("deportes", { t: Date.now(), list: list });
      sportsBusy = false;
      ONLINE.status.sport = { ok: true, t: Date.now(), n: list.length };
      refreshCalendarViews();
    }).catch(function () {
      sportsBusy = false;
      ONLINE.status.sport = { ok: false, t: c && c.t };
      I.emit("marcas-estado");
    });
  }



  /* ---------- Calendario: marcas por día ---------- */
  var marksCache = {};
  function marksForYear(y) {
    if (marksCache[y]) return marksCache[y];
    var C = CFG.calendario || {}, map = {};
    function add(k, m) { (map[k] = map[k] || []).push(m); }

    // Festivos de los dos países
    ["pais", "usa"].forEach(function (which) {
      festList(which, y).forEach(function (f) {
        add(f.fecha, { tipo: "fest", pais: which, nombre: f.nombre, ambito: f.ambito, provisional: !!f.provisional, estimado: !!f.estimado, online: !!f.online });
      });
    });
    // Familia (cumpleaños y fechas con "lista" de mensajesEspeciales)
    (CFG.mensajesEspeciales || []).forEach(function (x) {
      if (!x.lista) return;
      var r = ymdOfRule(x, y);
      if (r) add(keyOf(r[0], r[1], r[2]), { tipo: "fam", nombre: x.lista });
    });
    // Partidos online. Sustituyen a los de config.js de la misma categoría (±1 día)
    var onl = ONLINE.sport || [];
    onl.forEach(function (e) {
      if (+e.key.slice(0, 4) === y) add(e.key, { tipo: "evt", nombre: e.nombre, categoria: e.categoria, nota: e.nota, inicio: true, desde: e.key, online: true });
    });
    function coveredOnline(x) {
      if (SPORT_CATS.indexOf(x.categoria) === -1) return false;
      var d0 = dayNum(x.fecha), tx0 = teamsIn(x.nombre);
      // Mismo partido: misma categoría, ±1 día y algún equipo en común (o categoría sin equipos, como la UFC)
      return onl.some(function (e) {
        if (e.categoria !== x.categoria || Math.abs(dayNum(e.key) - d0) > 1) return false;
        var te = teamsIn(e.nombre);
        return !tx0.length || te.some(function (t) { return tx0.indexOf(t) !== -1; });
      });
    }
    // Rangos de fechas (calendario escolar y eventos de varios días)
    function addRange(x, tipo, extra) {
      var a = x.fecha.split("-").map(Number), b = (x.hasta || x.fecha).split("-").map(Number);
      var t0 = Date.UTC(a[0], a[1] - 1, a[2]), t1 = Date.UTC(b[0], b[1] - 1, b[2]);
      for (var tt = t0; tt <= t1; tt += 86400000) {
        var dd = new Date(tt);
        if (dd.getUTCFullYear() !== y) continue;
        var m = { tipo: tipo, nombre: x.nombre, inicio: tt === t0, desde: x.fecha, hasta: x.hasta, nota: x.nota, provisional: !!x.provisional };
        for (var k in extra) m[k] = extra[k];
        add(keyOf(y, dd.getUTCMonth() + 1, dd.getUTCDate()), m);
      }
    }
    (C.escolar || []).forEach(function (x) { addRange(x, "esc", { etiqueta: x.etiqueta }); });
    // Eventos con fecha concreta. "hora" (HH:MM) va en la zona de EE. UU., o en la del país con zona: "pais".
    (C.eventos || []).forEach(function (x) {
      if (coveredOnline(x)) return;
      var nota = x.nota || "";
      if (x.hora && /^\d\d:\d\d$/.test(x.hora)) {
        var f = x.fecha.split("-").map(Number), hm = x.hora.split(":").map(Number);
        var dt = new Date(zonedTime(x.zona === "pais" || SOLO ? tzP : tzU, f[0], f[1], f[2], hm[0], hm[1]));
        nota = [bothTimes(dt), nota].filter(Boolean).join(" · ");
      }
      addRange(x, "evt", { categoria: x.categoria, nota: nota, pais: x.pais });
    });
    // Días señalados de los dos países (sin repetir el mismo nombre el mismo día)
    function addSen(k, which, nombre, nota) {
      var same = (map[k] || []).filter(function (m) {
        return (m.tipo === "sen" && m.nombre === nombre) || (m.tipo === "fest" && m.nombre.indexOf(nombre) === 0);
      });
      if (same.length) { same.forEach(function (m) { if (m.tipo === "sen" && m.pais !== which) m.pais = "ambos"; }); return; }
      add(k, { tipo: "sen", pais: which, nombre: nombre, nota: nota });
    }
    ["pais", "usa"].forEach(function (which) {
      (src(which).senalados || []).forEach(function (x) {
        var r = ymdOfRule(x, y);
        if (r && r[0] === y) addSen(keyOf(r[0], r[1], r[2]), which, x.nombre, x.nota);
      });
    });
    // Cambios de hora: se calculan solos a partir de la zona horaria de cada sitio
    var dstDays = {};
    [["usa", tzU], ["pais", tzP]].filter(function (z) { return !(SOLO && z[0] === "usa"); }).forEach(function (z) {
      var prev = offsetMinutes(z[1], new Date(Date.UTC(y - 1, 11, 31, 12)));
      for (var tt = Date.UTC(y, 0, 1, 12); tt < Date.UTC(y + 1, 0, 1, 12); tt += 86400000) {
        var o = offsetMinutes(z[1], new Date(tt));
        if (o !== prev) {
          var dd = new Date(tt), diff = Math.abs(offsetMinutes(tzP, dd) - offsetMinutes(tzU, dd)) / 60, dk = keyOf(y, dd.getUTCMonth() + 1, dd.getUTCDate());
          if (dstDays[dk]) {
            // Los dos países cambian el mismo día: se deja un único aviso con ambos nombres
            dstDays[dk].nombre = tx(o > prev ? "cambioAdelanta" : "cambioRetrasa", countryName("pais") + T.yConj + countryName("usa"));
            dstDays[dk].pais = "ambos"; dstDays[dk].nota = diff ? tx("desdeHoyDif", diff) : T.desdeHoyMisma;
          } else {
            addSen(dk, z[0], tx(o > prev ? "cambioAdelanta" : "cambioRetrasa", countryName(z[0])), SOLO ? "" : diff ? tx("desdeHoyDif", diff) : T.desdeHoyMisma);
            dstDays[dk] = map[dk][map[dk].length - 1];
          }
        }
        prev = o;
      }
    });
    var order = { fest: 0, fam: 1, esc: 2, evt: 3, sen: 4 };
    Object.keys(map).forEach(function (k) { map[k].sort(function (a, b) { return order[a.tipo] - order[b.tipo]; }); });
    return (marksCache[y] = map);
  }
  function marksOn(y, m, d) { return marksForYear(y)[keyOf(y, m, d)] || []; }

  /* ---------- Etiquetas comunes de calendario y próximas fechas ---------- */
  function tagOf(m) { return m.tipo === "fest" ? (m.pais === "usa" ? "FestU" : "Fest") : m.tipo === "fam" ? "Fam" : m.tipo === "evt" ? "Evt" : m.tipo === "esc" ? "Esc" : "Dia"; }
  function tagText(tag) { return tag === "Dia" ? T.tagDia : tag === "Esc" ? T.tagEsc : tag === "Fam" ? T.tagFam : tag === "Evt" ? T.tagEvt : T.tagFest; }
  function shortDate(s) {
    var p = s.split("-");
    return new Intl.DateTimeFormat(LOC, { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])));
  }
  function rangeTxt(m) { return m.hasta ? tx("rango", shortDate(m.desde), shortDate(m.hasta)) : ""; }

  /* ---------- Mensajes especiales y cumpleaños (frase del día y aviso a pantalla completa) ---------- */
  function ymdIn(tz, offsetDays) {
    var p = localParts(tz, new Date(Date.now() + (offsetDays || 0) * 86400000));
    return { y: +p.year, m: +p.month, d: +p.day, mmdd: p.month + "-" + p.day, full: p.year + "-" + p.month + "-" + p.day };
  }
  function matches(x, tt) {
    if (x.fecha) { var f = x.fecha.replace(/\s/g, ""); return f === tt.mmdd || f === tt.full; }
    if (x.regla) {
      var r = ymdOfRule(x, tt.y);
      return !!r && r[1] === tt.m && r[2] === tt.d;
    }
    return false;
  }
  // zona: "ambas" (desde que empieza el día en el país hasta que acaba en EE. UU.), "pais", "usa"; sin zona, la principal
  function zonesOf(x) { return x.zona === "ambas" ? [tzP, tzU] : x.zona === "pais" ? [tzP] : x.zona === "usa" ? [tzU] : [tzMain]; }
  function messagesFor(offsetDays) {
    return (CFG.mensajesEspeciales || []).filter(function (x) {
      return zonesOf(x).some(function (tz) { return matches(x, ymdIn(tz, offsetDays)); });
    });
  }
  function specialMessage() {
    var hit = messagesFor(0);
    return hit.length ? hit.map(function (x) { return x.texto; }).join("  ·  ") : null;
  }

  I.marcas = {
    ONLINE: ONLINE, SPORT_CATS: SPORT_CATS,
    // Antes de pintar: partidos online (con caché) y marcas recalculadas para hoy
    preparar: function () { loadOnlineSports(); marksCache = {}; },
    marksOn: marksOn, marksForYear: marksForYear, teamsIn: teamsIn,
    tagOf: tagOf, tagText: tagText, shortDate: shortDate, rangeTxt: rangeTxt,
    ymdIn: ymdIn, messagesFor: messagesFor, specialMessage: specialMessage
  };
});
