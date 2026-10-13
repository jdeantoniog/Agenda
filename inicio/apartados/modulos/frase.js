/* =============================================================
   APARTADO: FRASE DEL DÍA
   Frase del día (datos/palabras.js > FRASES) o, si toca, el mensaje
   especial del día; debajo, aviso de los cumpleaños de los próximos
   días (config.js > avisoPrevioDias).
   ============================================================= */
Inicio.apartado("frase", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx, CFG = I.CFG, LANG = I.LANG, learnTxt = I.learnTxt, dayNumber = I.dayNumber;
  var messagesFor = I.marcas.messagesFor, specialMessage = I.marcas.specialMessage;

  box.innerHTML = '<p class="love" id="love" hidden><span id="love-en"></span><span class="love-es" id="love-es"></span><span class="love-pre" id="love-pre"></span></p>';

  var FRASES = window.FRASES || [];
  function pick(list, i) { return list[((i % list.length) + list.length) % list.length]; }
  function preNotice() {
    var N = CFG.avisoPrevioDias || 0, out = [], today = messagesFor(0);
    for (var k = 1; k <= N; k++) {
      messagesFor(k).forEach(function (x) {
        if (!x.lista || !x.avisar || today.indexOf(x) !== -1) return;
        if (out.some(function (o) { return o.x === x; })) return;
        out.push({ x: x, k: k });
      });
    }
    return out.map(function (o) { return (o.k === 1 ? T.manana : tx("enNDias", o.k)) + ": " + o.x.lista.charAt(0).toLowerCase() + o.x.lista.slice(1); }).join("  ·  ");
  }
  function renderLove() {
    var special = specialMessage(), pre = preNotice();
    $("love-pre").textContent = pre ? T.recuerda + pre : "";
    if (special) {
      $("love").className = "love special";
      $("love-en").textContent = special;
      $("love-es").textContent = "";
      $("love").hidden = false;
      return;
    }
    $("love").className = "love";
    if (!FRASES.length) { $("love-en").textContent = ""; $("love-es").textContent = ""; $("love").hidden = !pre; return; }
    var f = pick(FRASES, dayNumber());
    $("love-en").textContent = learnTxt(f);
    $("love-es").textContent = f[LANG] != null ? f[LANG] : f.es;
    $("love").hidden = false;
  }

  I.on("actualizar", renderLove);
  setInterval(renderLove, 15 * 60 * 1000);
});
