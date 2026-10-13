# Arquitectura: apartados únicos

## Objetivo
Cada apartado (frase del día, tiempo, avisos, calendario…) existe **una sola vez**, en la carpeta `apartados/`. Cada página solo dice qué apartados quiere y en qué orden; lo demás va en su `config.js`.

## Estructura
```
apartados/                   ← común a todos los proyectos (España, París, EE. UU.)
  cargador.js                lee la página y carga solo lo que necesitan sus apartados
  base.css                   colores, tipografía, tarjetas, chips, etiquetas
  nucleo/
    nucleo.js                textos, config, navegador, horas, banderas, fechas, red, lugares, ciclo de actualización
    tiempo.js + tiempo.css   tarjeta de previsión (la usan "tiempo" y "tiempo-buscador")
    marcas.js                festivos, partidos, cumpleaños, mensajes especiales (calendario, próximas fechas, frase, aviso)
  modulos/                   un .js y un .css por apartado
    frase  relojes  tiempo  tiempo-buscador  avisos  calendario  proximas-fechas
    conversor  sol-aire  expresiones  noticias  pie  aviso-dia
  textos/   es.js  it.js  pt.js  pl.js   (config.js > idioma: "it"; cada uno es el antiguo idioma.js)
  datos/    cumples.js  palabras.js  santoral.js
inicio-usa-espana/   index.html  config.js
inicio-espana/       index.html  config.js
inicio-paris/        index.html  config.js
inicio-usa-italia/   index.html  config.js
inicio-usa-brasil/   index.html  config.js
inicio-usa-polska/   index.html  config.js
laboratorio/         index.html  config.js  pruebas.js   ← todos los apartados + pruebas automáticas
entrada/             index.html                           ← página que abre la última versión vista
```

## Así queda un index.html
```html
<link rel="stylesheet" href="../apartados/base.css">
<main>
  <div data-apartado="frase"></div>
  <div data-apartado="relojes"></div>
  <div data-apartado="tiempo"></div>
  <div data-apartado="calendario"></div>
  <div data-apartado="pie"></div>
</main>
<div data-apartado="aviso-dia"></div>
<script src="config.js"></script>
<script src="../apartados/cargador.js"></script>
```
- Añadir un apartado = añadir una línea. Quitarlo = borrarla. El orden en pantalla es el orden de las líneas.
- `ordenSecciones` y `buscadorTiempo` de config.js ya no se usan: lo decide el HTML.
- Datos o idioma distintos por proyecto, en config.js: `datos: { palabras: "palabras-fr", cumples: "cumples" }`, `idioma: "it"`.

## Reglas técnicas
1. Scripts clásicos, no módulos ES: funcionan abriendo el archivo en local (`file://`).
2. Cada apartado se registra con `Inicio.apartado("nombre", function (contenedor, I) {…})` y solo usa el núcleo; no depende de otros apartados. Se comunican con avisos (`Inicio.on` / `Inicio.emit`): `actualizar`, `tiempo-actual`, `lugar`, `lugar-listo`, `marcas`, `marcas-estado`, `montado`.
3. Datos compartidos (lugares del tiempo, marcas del calendario, servicios intermedios de RSS) viven en el núcleo.
4. Se conservan las claves del navegador (`inicio:<version>:v1:…` e `inicio:v1:…`).
5. Textos en `apartados/textos/`, nunca dentro de un apartado.
6. Un apartado que falla muestra un aviso en su sitio y no arrastra a los demás.
7. Al publicar cambios en `apartados/`, subir `VERSION` en cargador.js (evita mezclar archivos viejos y nuevos en caché).

## Plan de migración
| Fase | Responsable | Fecha objetivo | Estado | Riesgos |
|---|---|---|---|---|
| 1. Partir el index.html en núcleo + apartados + cargador | Claude | Conversación 1 | Hecha | — |
| 2. Laboratorio con todos los apartados y pruebas automáticas | Claude | Conversación 1 | Hecha (64 pruebas) | Fuentes de avisos/noticias de ejemplo |
| 3. Migrar inicio-espana y comprobar que se ve igual | Claude + usuario | Conversación 2 | Preparada, falta publicar | palabras.js y cumples.js propios del proyecto |
| 4. Migrar inicio-paris e inicio-usa-* | Claude + usuario | Conversación 2 | Las 6 páginas preparadas e idénticas al original | Faltan palabras.js y santoral.js propios de París, Italia, Brasil y Polonia |
| 5. Incorporar calculadora, mapa y menú entre informes | Claude | Conversación 3 | Pendiente | — |
| 6. Registro de accesos (opción elegida en PENDIENTES.md) | Claude | Conversación 3 | Pendiente | RGPD si es registro propio |

## Riesgo principal
Un cambio en `apartados/` afecta a todas las páginas a la vez. Mitigación: abrir siempre `laboratorio/` antes de subir (las pruebas se ejecutan solas), y si hace falta, mantener `apartados/` versionado (`apartados-v2`) para migrar páginas de una en una.
