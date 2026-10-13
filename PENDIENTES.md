# Pendientes del proyecto "Inicio"

## Próximo paso
- [x] Reorganizar en apartados únicos: fases 1 y 2 hechas; páginas de usa-espana, España y París preparadas.
- [ ] Publicar en carpetas paralelas (`-v2`) y comparar unos días antes de sustituir.
- [ ] Traer `palabras.js` (francés) de París y los `cumples.js` de cada proyecto si son distintos.
- [ ] Migrar usa-italia, usa-brasil y usa-polska (hace falta su config.js e idioma.js).

## Al modificar los informes globales
- [ ] **Añadir un enlace para ir de unos informes a otros** (inicio-espana, inicio-usa-*, inicio-paris). Opción: menú en el pie con la lista de páginas, definida en `config.js` (`versiones`), que ya existe en las de EE. UU.
- [ ] **Registrar desde dónde se accede** (decidir opción; ver abajo).
- [ ] Incorporar los apartados independientes ya refinados: calculadora, mapa de ubicación.

## Apartados independientes (carpeta `apartados`)
| Archivo | Estado | Dónde encajaría |
|---|---|---|
| `calculadora.html` | Primera versión | Junto al conversor |
| `mapa-ubicacion.html` | Primera versión | Dentro de "Tiempo en otro lugar" (botón Mi ubicación) |

## Registro de accesos: opciones
| Opción | Qué guarda | Coste | RGPD |
|---|---|---|---|
| GoatCounter | Visitas por página, origen del enlace, país, dispositivo | Gratis (uso no comercial) | Sin cookies |
| Cloudflare Web Analytics | Igual que GoatCounter | Gratis | Sin cookies |
| Google Sheet propia (Apps Script) | Lo que decidamos: página, fecha, origen, ciudad aproximada | Gratis | Datos en tu Drive; avisar a los usuarios |
| Google Analytics | Todo | Gratis | Cookies: exige aviso y consentimiento |
