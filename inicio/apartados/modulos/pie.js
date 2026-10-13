/* =============================================================
   APARTADO: PIE
   Hora de la última actualización y botón "Actualizar ahora"
   (recarga todos los apartados de la página).
   ============================================================= */
Inicio.apartado("pie", function (box, I) {
  "use strict";
  var $ = I.$, T = I.T, tx = I.tx;
  box.innerHTML = '<footer><p id="updated"></p><button type="button" id="refresh"></button></footer>';
  $("refresh").textContent = T.actualizar;
  $("refresh").addEventListener("click", function () { I.actualizar(true); });
  function hora() { $("updated").textContent = tx("actualizado", I.fmtTime(I.tzMain), I.cityMain); }
  I.on("actualizar", hora);
  setInterval(hora, 30 * 60 * 1000);
});
