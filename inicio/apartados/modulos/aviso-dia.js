/* =============================================================
   APARTADO: AVISO A PANTALLA COMPLETA
   En fechas clave (mensajes especiales y cumpleaños) muestra el
   mensaje a pantalla completa unos segundos (config.js > aviso),
   con confeti en los colores de las banderas. Sin confeti si el
   dispositivo tiene "Reducir movimiento". Puede ir en cualquier
   sitio de la página: se pinta encima de todo.
   ============================================================= */
Inicio.apartado("aviso-dia", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, CFG = I.CFG, FP = I.FP, FU = I.FU;
  var messagesFor = I.marcas.messagesFor, specialMessage = I.marcas.specialMessage;

  box.innerHTML =
    '<div class="splash" id="splash" role="alert" hidden>' +
    '<canvas class="confetti" id="confetti" aria-hidden="true"></canvas>' +
    '<div class="splash-inner"><p class="splash-text" id="splash-text"></p><p class="splash-hint" id="splash-hint"></p></div>' +
    '<div class="splash-bar" aria-hidden="true"><span id="splash-bar"></span></div>' +
    '</div>';
  $("splash-hint").textContent = T.tocaCerrar;

  function startConfetti(secs) {
    var canvas = $("confetti");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ctx = canvas.getContext && canvas.getContext("2d");
    if (reduce || !ctx) return function () {};
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = canvas.clientWidth || window.innerWidth, H = canvas.clientHeight || window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var COLORS = FP.confeti.concat(FU.confeti);
    var pieces = [], N = Math.round(Math.min(160, W * 0.35));
    for (var i = 0; i < N; i++) {
      pieces.push({
        x: Math.random() * W, y: -20 - Math.random() * H * 0.9,
        w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
        vx: -0.6 + Math.random() * 1.2, vy: 1.6 + Math.random() * 2.4,
        rot: Math.random() * Math.PI, vr: -0.12 + Math.random() * 0.24,
        sway: Math.random() * Math.PI * 2, color: COLORS[i % COLORS.length]
      });
    }
    var start = performance.now(), last = start, raf, running = true, spawnEnd = secs * 1000 * 0.55;
    function frame(now) {
      if (!running) return;
      var dt = Math.min(2.5, (now - last) / 16.67); last = now;
      ctx.clearRect(0, 0, W, H);
      var alive = 0;
      pieces.forEach(function (p) {
        p.sway += 0.05 * dt;
        p.x += (p.vx + Math.sin(p.sway) * 0.6) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.y > H + 20 && now - start < spawnEnd) { p.y = -20; p.x = Math.random() * W; }
        if (p.y <= H + 20) {
          alive++;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.sway * 1.7));
          ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
        }
      });
      if (alive) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return function () { running = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H); };
  }
  function showSplash() {
    var S = CFG.aviso || {};
    if (S.activo === false) return;
    var msg = specialMessage();
    if (!msg) return;
    var withConfetti = messagesFor(0).some(function (x) { return x.confeti; });
    var secs = S.segundos || 5, el = $("splash"), bar = $("splash-bar"), timer;
    $("splash-text").textContent = msg;
    el.hidden = false;
    document.body.classList.add("splash-open");
    bar.style.transition = "none";
    bar.style.transform = "scaleX(1)";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bar.style.transition = "transform " + secs + "s linear";
        bar.style.transform = "scaleX(0)";
      });
    });
    var stopConfetti = withConfetti ? startConfetti(secs) : function () {};
    function close() {
      clearTimeout(timer);
      stopConfetti();
      el.classList.add("closing");
      setTimeout(function () { el.hidden = true; el.classList.remove("closing"); document.body.classList.remove("splash-open"); }, 600);
    }
    el.addEventListener("click", close, { once: true });
    timer = setTimeout(close, secs * 1000);
  }

  I.on("montado", showSplash);
});
