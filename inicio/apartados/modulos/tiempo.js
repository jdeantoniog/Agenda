/* =============================================================
   APARTADO: TIEMPO
   Una tarjeta por lugar fijo de config.js (ordenTiempo y lugaresExtra):
   hoy, hora a hora y los próximos días (diasTiempo). Se actualiza cada 30 min.
   El lugar buscado va en su propio apartado: "tiempo-buscador".
   ============================================================= */
Inicio.apartado("tiempo", function (box, I) {
  "use strict";
  var lugares = I.lugares.filter(function (D) { return !D.buscador; });
  var wrap = document.createElement("div");
  wrap.id = "details"; wrap.className = "details";
  lugares.forEach(function (D) { wrap.appendChild(I.tiempo.tarjeta(D)); });
  box.appendChild(wrap);

  function cargar() { lugares.forEach(function (D) { I.tiempo.cargar(D); }); }
  I.on("actualizar", cargar);
  setInterval(cargar, 30 * 60 * 1000);
});
