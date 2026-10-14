/* =============================================================
   APARTADO: ACCESO AL RESTO DE PÁGINAS
   Botones con bandera para ir a las demás páginas de inicio.
   La lista está en datos/paginas.js (una línea por página); la
   página actual no sale. Enlaces relativos: ../<carpeta>/index.html
   ============================================================= */
Inicio.apartado("acceso-resto", function (box, I) {
  "use strict";
  var T = I.T, aqui = decodeURIComponent(location.pathname);
  var lista = (window.PAGINAS || []).filter(function (p) { return p && p.carpeta && aqui.indexOf("/" + p.carpeta + "/") === -1; });

  box.innerHTML = '<section class="card" id="acc-card" aria-labelledby="acc-title"><h2 id="acc-title"></h2><nav class="acc-grid" id="acc-grid"></nav></section>';
  I.$("acc-title").textContent = T.accesoResto;
  I.$("acc-grid").setAttribute("aria-label", T.accesoResto);
  if (!lista.length) { box.firstChild.hidden = true; return; }
  lista.forEach(function (p) {
    var a = document.createElement("a");
    a.className = "acc-btn"; a.href = "../" + p.carpeta + "/index.html";
    a.innerHTML = '<svg class="acc-flag" viewBox="0 0 750 500" aria-hidden="true">' + I.flagOf(p.bandera).svg() + "</svg><span></span>";
    a.lastChild.textContent = p.nombre;
    I.$("acc-grid").appendChild(a);
  });
});
