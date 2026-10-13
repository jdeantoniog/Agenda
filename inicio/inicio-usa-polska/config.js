/* =============================================================
   CONFIGURACIÓN DE LA PÁGINA (versión EE. UU. + España)
   Edita solo este archivo para cambiar lugares, fechas o textos.
   - Para hacer otra versión (Italia, Brasil, Polonia…): copia la carpeta,
     cambia "version" y el bloque "pais". El index.html no se toca.
   - Coordenadas: Google Maps, clic derecho sobre el punto, copiar.
   - Fechas siempre en formato "AAAA-MM-DD" (o "MM-DD" si se repite cada año).
   - Respeta comas y comillas: un error aquí deja la página en blanco.
   ============================================================= */

window.CONFIG = {
  titulo: "Start",      // solo se ve en la pestaña y en el icono de la pantalla de inicio
  version: "usa-pl",
  idioma: "pl",                  // textos de la página: apartados/textos/pl.js     // identificador único de esta web: separa su caché de las otras versiones
  datos: { palabras: "palabras-pl", santoral: "santoral-pl", cumples: "cumples-pl" },   // apartados/datos/ propios de esta versión

  // Versiones publicadas: al tocar la bandera del país aparece un menú para cambiar.
  // url relativa y terminada en index.html: así funciona igual en GitHub Pages que abriendo los archivos en local.
  versiones: [
    { id: "usa-es", bandera: "ES", nombre: "España", url: "../inicio-usa-espana/index.html" },
    { id: "usa-it", bandera: "IT", nombre: "Italia", url: "../inicio-usa-italia/index.html" },
    { id: "usa-br", bandera: "BR", nombre: "Brasil", url: "../inicio-usa-brasil/index.html" },
    { id: "usa-pl", bandera: "PL", nombre: "Polska", url: "../inicio-usa-polska/index.html" }
  ],

  // Hora de referencia para "hoy", el calendario, la cuenta atrás y el cambio diario de frases:
  // "usa" (West Branch) o "pais".
  zonaPrincipal: "usa",

  /* ---------- Estados Unidos (fijo en todas las versiones; textos en el idioma de esta versión) ---------- */
  usa: {
    nombre: "Stany Zjednoczone",
    nombreCorto: "USA",
    bandera: "US",
    ciudadReloj: "West Branch",
    zonaHoraria: "America/Detroit",
    tiempo: { nombre: "West Branch, MI", lat: 44.2764, lon: -84.2386, mostrarAmbasUnidades: true },
    festivosOnline: { pais: "US", region: "US-MI", ambitoNacional: "Federalne", ambitoRegion: "Michigan", confirmados: true },
    nombresFestivos: {
      "New Year's Day": "Nowy Rok",
      "Martin Luther King, Jr. Day": "Dzień Martina Luthera Kinga",
      "Martin Luther King Jr. Day": "Dzień Martina Luthera Kinga",
      "Presidents Day": "Dzień Prezydentów",
      "Presidents' Day": "Dzień Prezydentów",
      "Washington's Birthday": "Dzień Prezydentów",
      "Memorial Day": "Memorial Day (Dzień Pamięci Poległych)",
      "Juneteenth": "Juneteenth (koniec niewolnictwa)",
      "Juneteenth National Independence Day": "Juneteenth (koniec niewolnictwa)",
      "Independence Day": "Dzień Niepodległości USA",
      "Labor Day": "Labor Day (Święto Pracy w USA)",
      "Labour Day": "Labor Day (Święto Pracy w USA)",
      "Columbus Day": "Columbus Day / Dzień Ludów Rdzennych",
      "Veterans Day": "Dzień Weteranów",
      "Thanksgiving Day": "Thanksgiving (Święto Dziękczynienia)",
      "Christmas Day": "Boże Narodzenie"
    },
    festivosHabituales: [
      { fecha: "01-01", nombre: "Nowy Rok", ambito: "Federalne" },
      { regla: { mes: 1, diaSemana: 1, orden: 3 }, nombre: "Dzień Martina Luthera Kinga", ambito: "Federalne" },
      { regla: { mes: 2, diaSemana: 1, orden: 3 }, nombre: "Dzień Prezydentów", ambito: "Federalne" },
      { regla: { mes: 5, diaSemana: 1, orden: -1 }, nombre: "Memorial Day (Dzień Pamięci Poległych)", ambito: "Federalne" },
      { fecha: "06-19", nombre: "Juneteenth (koniec niewolnictwa)", ambito: "Federalne" },
      { fecha: "07-04", nombre: "Dzień Niepodległości USA", ambito: "Federalne" },
      { regla: { mes: 9, diaSemana: 1, orden: 1 }, nombre: "Labor Day (Święto Pracy w USA)", ambito: "Federalne" },
      { regla: { mes: 10, diaSemana: 1, orden: 2 }, nombre: "Columbus Day / Dzień Ludów Rdzennych", ambito: "Federalne" },
      { fecha: "11-11", nombre: "Dzień Weteranów", ambito: "Federalne" },
      { regla: { mes: 11, diaSemana: 4, orden: 4 }, nombre: "Thanksgiving (Święto Dziękczynienia)", ambito: "Federalne" },
      { fecha: "12-25", nombre: "Boże Narodzenie", ambito: "Federalne" }
    ],
    // Los cambios de hora se calculan solos.
    senalados: [
      { fecha: "02-02", nombre: "Dzień Świstaka" },
      { fecha: "02-14", nombre: "Walentynki" },
      { fecha: "03-17", nombre: "Dzień Świętego Patryka" },
      { regla: { mes: 5, diaSemana: 0, orden: 2 }, nombre: "Dzień Matki w USA" },
      { regla: { mes: 6, diaSemana: 0, orden: 3 }, nombre: "Dzień Ojca w USA" },
      { fecha: "10-31", nombre: "Halloween" },
      { fecha: "11-15", nombre: "Początek sezonu polowań na jelenie w Michigan", nota: "broń palna, do 30 listopada" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 1 }, nombre: "Black Friday" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 4 }, nombre: "Cyber Monday" },
      { fecha: "12-24", nombre: "Wigilia" },
      { fecha: "12-31", nombre: "Sylwester" },
      { fecha: "05-20", nombre: "Przypomnienie: dodać terminarz Lions na nowy sezon" },
      { fecha: "06-01", nombre: "Przypomnienie: dodać kalendarz szkolny Ogemaw Heights na następny rok" }
    ]
  },

  /* ---------- País que se compara con EE. UU.: Polonia ----------
     Ciudad provisional: Varsovia. En Polonia no hay festivos regionales: solo cambian tiempo y ciudadReloj. */
  pais: {
    nombre: "Polska",
    bandera: "PL",
    ciudadReloj: "Warszawa",
    zonaHoraria: "Europe/Warsaw",
    tiempo: { nombre: "Warszawa", lat: 52.2297, lon: 21.0122 },
    // tasaRespaldo: złotych por 1 dólar, solo sin conexión. Estimación, revisar.
    moneda: { codigo: "PLN", simbolo: "zł", nombre: "Złote", tasaRespaldo: 3.65 },
    festivosOnline: { pais: "PL", ambitoNacional: "Ustawowe", confirmados: false },
    fuenteOficial: "Ustawa o dniach wolnych od pracy (z Wigilią od 2025)",
    festivos: {
      "2026": [
        { fecha: "2026-01-01", nombre: "Nowy Rok", ambito: "Ustawowe" },
        { fecha: "2026-01-06", nombre: "Święto Trzech Króli", ambito: "Ustawowe" },
        { fecha: "2026-04-05", nombre: "Wielkanoc", ambito: "Ustawowe" },
        { fecha: "2026-04-06", nombre: "Poniedziałek Wielkanocny", ambito: "Ustawowe" },
        { fecha: "2026-05-01", nombre: "Święto Pracy", ambito: "Ustawowe" },
        { fecha: "2026-05-03", nombre: "Święto Konstytucji 3 Maja", ambito: "Ustawowe" },
        { fecha: "2026-05-24", nombre: "Zielone Świątki", ambito: "Ustawowe" },
        { fecha: "2026-06-04", nombre: "Boże Ciało", ambito: "Ustawowe" },
        { fecha: "2026-08-15", nombre: "Wniebowzięcie NMP i Święto Wojska Polskiego", ambito: "Ustawowe" },
        { fecha: "2026-11-01", nombre: "Wszystkich Świętych", ambito: "Ustawowe" },
        { fecha: "2026-11-11", nombre: "Narodowe Święto Niepodległości", ambito: "Ustawowe" },
        { fecha: "2026-12-24", nombre: "Wigilia Bożego Narodzenia", ambito: "Ustawowe" },
        { fecha: "2026-12-25", nombre: "Boże Narodzenie (pierwszy dzień)", ambito: "Ustawowe" },
        { fecha: "2026-12-26", nombre: "Boże Narodzenie (drugi dzień)", ambito: "Ustawowe" }
      ],
      "2027": [
        { fecha: "2027-01-01", nombre: "Nowy Rok", ambito: "Ustawowe" },
        { fecha: "2027-01-06", nombre: "Święto Trzech Króli", ambito: "Ustawowe" },
        { fecha: "2027-03-28", nombre: "Wielkanoc", ambito: "Ustawowe" },
        { fecha: "2027-03-29", nombre: "Poniedziałek Wielkanocny", ambito: "Ustawowe" },
        { fecha: "2027-05-01", nombre: "Święto Pracy", ambito: "Ustawowe" },
        { fecha: "2027-05-03", nombre: "Święto Konstytucji 3 Maja", ambito: "Ustawowe" },
        { fecha: "2027-05-16", nombre: "Zielone Świątki", ambito: "Ustawowe" },
        { fecha: "2027-05-27", nombre: "Boże Ciało", ambito: "Ustawowe" },
        { fecha: "2027-08-15", nombre: "Wniebowzięcie NMP i Święto Wojska Polskiego", ambito: "Ustawowe" },
        { fecha: "2027-11-01", nombre: "Wszystkich Świętych", ambito: "Ustawowe" },
        { fecha: "2027-11-11", nombre: "Narodowe Święto Niepodległości", ambito: "Ustawowe" },
        { fecha: "2027-12-24", nombre: "Wigilia Bożego Narodzenia", ambito: "Ustawowe" },
        { fecha: "2027-12-25", nombre: "Boże Narodzenie (pierwszy dzień)", ambito: "Ustawowe" },
        { fecha: "2027-12-26", nombre: "Boże Narodzenie (drugi dzień)", ambito: "Ustawowe" }
      ]
    },
    festivosHabituales: [
      { fecha: "01-01", nombre: "Nowy Rok", ambito: "Ustawowe" },
      { fecha: "01-06", nombre: "Święto Trzech Króli", ambito: "Ustawowe" },
      { pascua: 0, nombre: "Wielkanoc", ambito: "Ustawowe" },
      { pascua: 1, nombre: "Poniedziałek Wielkanocny", ambito: "Ustawowe" },
      { fecha: "05-01", nombre: "Święto Pracy", ambito: "Ustawowe" },
      { fecha: "05-03", nombre: "Święto Konstytucji 3 Maja", ambito: "Ustawowe" },
      { pascua: 49, nombre: "Zielone Świątki", ambito: "Ustawowe" },
      { pascua: 60, nombre: "Boże Ciało", ambito: "Ustawowe" },
      { fecha: "08-15", nombre: "Wniebowzięcie NMP i Święto Wojska Polskiego", ambito: "Ustawowe" },
      { fecha: "11-01", nombre: "Wszystkich Świętych", ambito: "Ustawowe" },
      { fecha: "11-11", nombre: "Narodowe Święto Niepodległości", ambito: "Ustawowe" },
      { fecha: "12-24", nombre: "Wigilia Bożego Narodzenia", ambito: "Ustawowe", soloConfig: true },
      { fecha: "12-25", nombre: "Boże Narodzenie (pierwszy dzień)", ambito: "Ustawowe" },
      { fecha: "12-26", nombre: "Boże Narodzenie (drugi dzień)", ambito: "Ustawowe" }
    ],
    senalados: [
      { fecha: "01-21", nombre: "Dzień Babci" },
      { fecha: "01-22", nombre: "Dzień Dziadka" },
      { pascua: -52, nombre: "Tłusty czwartek" },
      { pascua: -46, nombre: "Środa Popielcowa" },
      { fecha: "02-14", nombre: "Walentynki" },
      { fecha: "03-08", nombre: "Dzień Kobiet" },
      { pascua: -7, nombre: "Niedziela Palmowa" },
      { pascua: 1, nombre: "Śmigus-dyngus" },
      { fecha: "05-02", nombre: "Dzień Flagi" },
      { fecha: "05-26", nombre: "Dzień Matki" },
      { fecha: "06-01", nombre: "Dzień Dziecka" },
      { fecha: "06-23", nombre: "Dzień Ojca" },
      { fecha: "08-01", nombre: "Rocznica Powstania Warszawskiego", nota: "godzina W: 17:00" },
      { fecha: "09-01", nombre: "Początek roku szkolnego w Polsce" },
      { fecha: "10-14", nombre: "Dzień Edukacji Narodowej" },
      { fecha: "10-31", nombre: "Halloween" },
      { fecha: "11-02", nombre: "Zaduszki" },
      { fecha: "11-29", nombre: "Andrzejki (wieczór)" },
      { fecha: "12-06", nombre: "Mikołajki" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 1 }, nombre: "Black Friday" },
      { fecha: "12-31", nombre: "Sylwester" },
      { fecha: "11-15", nombre: "Przypomnienie: dodać polskie święta na przyszły rok w config.js" }
    ]
  },

  /* ---------- Mensajes especiales (sustituyen a la frase del día) ----------
     fecha: "MM-DD" (cada año) o "AAAA-MM-DD" (un día) · regla: { mes, diaSemana, orden }
     zona: sin poner, la de zonaPrincipal; "pais"; "usa"; "ambas" (desde que empieza el día en el país
           hasta que acaba en EE. UU.).
     lista: texto para el calendario y "Próximas fechas" (si no se pone, no aparece).
     avisar: aviso arriba los días previos · confeti: confeti en el aviso grande de ese día.
     LOS CUMPLEAÑOS VAN EN cumples.js (salen con zona "ambas").                          */
  avisoPrevioDias: 3,
  aviso: { activo: true, segundos: 5 },
  mensajesEspeciales: [
    { fecha: "01-01", texto: "Szczęśliwego Nowego Roku! Mocno ściskamy z domu." },
    { fecha: "12-24", texto: "Wesołych Świąt! Łamiemy się z Tobą opłatkiem na odległość.", zona: "pais" },
    { regla: { mes: 11, diaSemana: 4, orden: 4 }, texto: "Udanego Thanksgiving! Smacznej kolacji z indykiem." }
  ],

  /* ---------- Orden de las secciones (debajo de banderas y tiempo) ----------
     calendario, proximasFechas, conversor, solAire, expresiones. La que se quite de la lista no se muestra. */
  ordenSecciones: ["calendario", "proximasFechas", "conversor", "solAire", "expresiones"],

  /* ---------- Tiempo ----------
     Una tarjeta por lugar, en este orden. Hoy hora a hora + "diasTiempo" días desde mañana (1 a 15). */
  ordenTiempo: ["usa", "pais"],
  diasTiempo: 6,

  /* ---------- Expresiones útiles ---------- */
  palabrasPorDia: 20,

  /* ---------- Próximas fechas ----------
     Todo lo de los próximos proximasFechasDias días; si son menos de mostrarFechas, se completa. */
  proximasFechasDias: 31,
  mostrarFechas: 12,
  // Categorías de eventos que solo salen en el calendario
  proximasFechasExcluir: ["Lions"],

  /* ---------- Datos online (se guardan en el navegador; si fallan, se usa config.js) ---------- */
  online: {
    festivos: true,
    deportes: {
      activo: true,
      clave: "123",            // clave gratuita de TheSportsDB
      horasCache: 12,
      equipos: [
        // coincide: palabra para reconocer al equipo en los partidos · categoria: la de sus eventos en config.js
        { nombre: "Detroit Lions", buscar: "Detroit Lions", deporte: "American Football", coincide: "Lions", categoria: "Lions" }
      ]
    }
  },

  /* ---------- Calendario ---------- */
  calendario: {
    nombreEscolar: "Ogemaw Heights",
    // West Branch-Rose City Area Schools, curso 2026-2027. provisional: deducido del PDF del distrito, por confirmar.
    escolar: [
      { fecha: "2026-08-31", nombre: "Pierwszy dzień szkoły" },
      { fecha: "2026-09-04", hasta: "2026-09-07", nombre: "Wolne: długi weekend Labor Day" },
      { fecha: "2026-09-30", nombre: "Skrócone lekcje", nota: "11:24" },
      { fecha: "2026-10-15", nombre: "Wywiadówka", nota: "OHHS, 16:00-18:00" },
      { fecha: "2026-10-22", nombre: "Wywiadówka", nota: "OHHS, 16:00-18:00" },
      { fecha: "2026-10-30", nombre: "Skrócone lekcje i koniec pierwszego okresu", nota: "11:24" },
      { fecha: "2026-11-25", hasta: "2026-11-27", nombre: "Wolne: Thanksgiving", provisional: true },
      { fecha: "2026-12-23", hasta: "2027-01-01", nombre: "Przerwa świąteczna", provisional: true },
      { fecha: "2027-01-15", nombre: "Koniec pierwszego semestru" },
      { fecha: "2027-01-27", nombre: "Skrócone lekcje", nota: "11:24" },
      { fecha: "2027-02-24", nombre: "Skrócone lekcje i wywiadówka", nota: "OHHS" },
      { fecha: "2027-02-25", nombre: "Wywiadówka", nota: "OHHS" },
      { fecha: "2027-03-29", hasta: "2027-04-02", nombre: "Ferie wiosenne", provisional: true },
      { fecha: "2027-04-28", nombre: "Skrócone lekcje", nota: "11:24" },
      { fecha: "2027-06-09", nombre: "Ostatni dzień szkoły" }
    ],
    // hora: "HH:MM" en hora de Michigan; la página añade la del país.
    eventos: [
      { fecha: "2026-11-03", nombre: "Wybory w połowie kadencji", categoria: "USA", pais: "usa" },
      { fecha: "2027-02-14", nombre: "Super Bowl LXI", categoria: "NFL", pais: "usa", nota: "SoFi Stadium, Inglewood (Kalifornia)" },
      // Detroit Lions, temporada 2026 (calendario oficial publicado el 14/05/2026)
      { fecha: "2026-09-13", nombre: "Lions - New Orleans Saints", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-09-17", nombre: "Buffalo Bills - Lions", categoria: "Lions", nota: "Thursday Night Football" },
      { fecha: "2026-09-27", nombre: "Lions - New York Jets", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-10-04", nombre: "Carolina Panthers - Lions", categoria: "Lions", hora: "20:20", nota: "Sunday Night Football" },
      { fecha: "2026-10-11", nombre: "Arizona Cardinals - Lions", categoria: "Lions", hora: "16:25" },
      { fecha: "2026-10-25", nombre: "Lions - Green Bay Packers", categoria: "Lions", hora: "16:25", nota: "Ford Field" },
      { fecha: "2026-11-01", nombre: "Lions - Minnesota Vikings", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-11-08", nombre: "Miami Dolphins - Lions", categoria: "Lions", hora: "13:00" },
      { fecha: "2026-11-15", nombre: "Lions - New England Patriots", categoria: "Lions", hora: "09:30", nota: "Monachium, Niemcy" },
      { fecha: "2026-11-22", nombre: "Lions - Tampa Bay Buccaneers", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-11-26", nombre: "Lions - Chicago Bears", categoria: "Lions", nota: "mecz na Święto Dziękczynienia · Ford Field" },
      { fecha: "2026-12-06", nombre: "Atlanta Falcons - Lions", categoria: "Lions", hora: "13:00" },
      { fecha: "2026-12-13", nombre: "Lions - Tennessee Titans", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-12-20", nombre: "Minnesota Vikings - Lions", categoria: "Lions", nota: "Sunday Night Football" },
      { fecha: "2026-12-28", nombre: "Lions - New York Giants", categoria: "Lions", hora: "20:15", nota: "Monday Night Football · Ford Field" },
      { fecha: "2027-01-03", nombre: "Chicago Bears - Lions", categoria: "Lions", nota: "po południu" },
      { fecha: "2027-01-10", nombre: "Green Bay Packers - Lions", categoria: "Lions", provisional: true, nota: "dzień (9 lub 10 stycznia) i godzina do potwierdzenia" }
    ]
  }
};
