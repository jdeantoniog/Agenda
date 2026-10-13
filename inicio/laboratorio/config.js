/* =============================================================
   CONFIGURACIÓN DEL LABORATORIO
   Copia de la de inicio-usa-espana con TODO activado (buscador, avisos y
   noticias) para probar cambios en apartados/ antes de publicarlos.
   Sin "versiones": el laboratorio no debe quedar como "última versión
   vista" en la página de entrada. Caché propia (version: "laboratorio").
   ---------------------------------------------------------------
   (versión EE. UU. + España)
   Edita solo este archivo para cambiar lugares, fechas o textos.
   - Para hacer otra versión (Italia, Brasil, Polonia…): copia la carpeta,
     cambia "version" y el bloque "pais". El index.html no se toca.
   - Coordenadas: Google Maps, clic derecho sobre el punto, copiar.
   - Fechas siempre en formato "AAAA-MM-DD" (o "MM-DD" si se repite cada año).
   - Respeta comas y comillas: un error aquí deja la página en blanco.
   ============================================================= */

window.CONFIG = {
  titulo: "Inicio",      // solo se ve en la pestaña y en el icono de la pantalla de inicio
  version: "laboratorio",     // identificador único de esta web: separa su caché de las otras versiones
  datos: { cumples: "cumples-usa-es" },   // apartados/datos/ (los demás, los comunes)

  // Versiones publicadas: al tocar la bandera del país aparece un menú para cambiar.
  // url relativa y terminada en index.html: así funciona igual en GitHub Pages que abriendo los archivos en local.
  versiones: [],

  // Hora de referencia para "hoy", el calendario, la cuenta atrás y el cambio diario de frases:
  // "usa" (West Branch) o "pais".
  zonaPrincipal: "usa",

  /* ---------- Estados Unidos (fijo en todas las versiones) ---------- */
  usa: {
    nombre: "Estados Unidos",
    nombreCorto: "EE. UU.",
    bandera: "US",
    ciudadReloj: "West Branch",
    zonaHoraria: "America/Detroit",
    tiempo: { nombre: "West Branch, MI", lat: 44.2764, lon: -84.2386, mostrarAmbasUnidades: true },
    // Festivos online: federales + Michigan. Las fechas federales son fijas por ley: se dan por confirmadas.
    festivosOnline: { pais: "US", region: "US-MI", ambitoNacional: "Federal", ambitoRegion: "Michigan", confirmados: true },
    // Traducción de los nombres que da la fuente online
    nombresFestivos: {
      "New Year's Day": "Año Nuevo",
      "Martin Luther King, Jr. Day": "Día de Martin Luther King",
      "Martin Luther King Jr. Day": "Día de Martin Luther King",
      "Presidents Day": "Día de los Presidentes",
      "Presidents' Day": "Día de los Presidentes",
      "Washington's Birthday": "Día de los Presidentes",
      "Memorial Day": "Memorial Day (Día de los Caídos)",
      "Juneteenth": "Juneteenth (fin de la esclavitud)",
      "Juneteenth National Independence Day": "Juneteenth (fin de la esclavitud)",
      "Independence Day": "Día de la Independencia",
      "Labor Day": "Labor Day (Día del Trabajo)",
      "Labour Day": "Labor Day (Día del Trabajo)",
      "Columbus Day": "Columbus Day / Día de los Pueblos Indígenas",
      "Veterans Day": "Día de los Veteranos",
      "Thanksgiving Day": "Thanksgiving (Acción de Gracias)",
      "Christmas Day": "Navidad"
    },
    // Solo se usan si no hay conexión ni copia guardada (se marcan como "previstos")
    festivosHabituales: [
      { fecha: "01-01", nombre: "Año Nuevo", ambito: "Federal" },
      { regla: { mes: 1, diaSemana: 1, orden: 3 }, nombre: "Día de Martin Luther King", ambito: "Federal" },
      { regla: { mes: 2, diaSemana: 1, orden: 3 }, nombre: "Día de los Presidentes", ambito: "Federal" },
      { regla: { mes: 5, diaSemana: 1, orden: -1 }, nombre: "Memorial Day (Día de los Caídos)", ambito: "Federal" },
      { fecha: "06-19", nombre: "Juneteenth (fin de la esclavitud)", ambito: "Federal" },
      { fecha: "07-04", nombre: "Día de la Independencia", ambito: "Federal" },
      { regla: { mes: 9, diaSemana: 1, orden: 1 }, nombre: "Labor Day (Día del Trabajo)", ambito: "Federal" },
      { regla: { mes: 10, diaSemana: 1, orden: 2 }, nombre: "Columbus Day / Día de los Pueblos Indígenas", ambito: "Federal" },
      { fecha: "11-11", nombre: "Día de los Veteranos", ambito: "Federal" },
      { regla: { mes: 11, diaSemana: 4, orden: 4 }, nombre: "Thanksgiving (Acción de Gracias)", ambito: "Federal" },
      { fecha: "12-25", nombre: "Navidad", ambito: "Federal" }
    ],
    // Días señalados que no son festivo. Si el país tiene uno con el mismo nombre, sale una sola vez.
    //   fecha: "MM-DD" · regla: { mes, diaSemana (0 domingo ... 6 sábado), orden (1-5 o -1 = último), desplazamiento } · pascua
    // Los cambios de hora se calculan solos: no hace falta ponerlos.
    senalados: [
      { fecha: "02-02", nombre: "Día de la Marmota" },
      { fecha: "02-14", nombre: "San Valentín" },
      { fecha: "03-17", nombre: "San Patricio" },
      { regla: { mes: 5, diaSemana: 0, orden: 2 }, nombre: "Día de la Madre en EE. UU." },
      { regla: { mes: 6, diaSemana: 0, orden: 3 }, nombre: "Día del Padre en EE. UU." },
      { fecha: "10-31", nombre: "Halloween" },
      { fecha: "11-15", nombre: "Empieza la temporada de caza del ciervo en Michigan", nota: "rifle, hasta el 30 de noviembre" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 1 }, nombre: "Black Friday" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 4 }, nombre: "Cyber Monday" },
      { fecha: "12-24", nombre: "Nochebuena" },
      { fecha: "12-31", nombre: "Nochevieja" },
      // Recordatorios de mantenimiento (la página también avisa sola si falta algo)
      { fecha: "05-20", nombre: "Recordatorio: añadir el calendario de los Lions de la nueva temporada" },
      { fecha: "06-01", nombre: "Recordatorio: añadir el calendario escolar de Ogemaw Heights del curso siguiente" }
    ]
  },

  /* ---------- País que se compara con EE. UU. (lo que cambia entre versiones) ----------
     bandera: "ES", "IT", "BR", "PL" (dibujada en la página). color: opcional, para el calendario.
     tiempo: lugar de la segunda tarjeta del tiempo.
     festivosOnline: país y región para Nager.Date (si un año no está en "festivos").
     festivos: oficiales por año. Mandan sobre los online.
     fuenteOficial: si se pone, la página avisa cuando falten los oficiales del año en curso o del siguiente. */
  pais: {
    nombre: "España",
    bandera: "ES",
    ciudadReloj: "Madrid",
    zonaHoraria: "Europe/Madrid",
    tiempo: { nombre: "Madrid (Ciudad Lineal)", lat: 40.4466, lon: -3.6510 },
    // Moneda del conversor (dólares frente a esta). tasaRespaldo: unidades por 1 dólar, solo si no hay
    // conexión ni tasa guardada en el navegador. Revísala de vez en cuando.
    moneda: { codigo: "EUR", simbolo: "€", nombre: "Euros", tasaRespaldo: 0.87 },
    festivosOnline: { pais: "ES", region: "ES-MD", ambitoNacional: "Nacional", ambitoRegion: "Comunidad de Madrid", confirmados: false },
    fuenteOficial: "BOCM",
    festivos: {
      // Decreto 75/2025 (BOCM 25/09/2025) + Ayuntamiento de Madrid (pleno 30/09/2025)
      "2026": [
        { fecha: "2026-01-01", nombre: "Año Nuevo", ambito: "Nacional" },
        { fecha: "2026-01-06", nombre: "Epifanía del Señor (Reyes)", ambito: "Nacional" },
        { fecha: "2026-04-02", nombre: "Jueves Santo", ambito: "Comunidad de Madrid" },
        { fecha: "2026-04-03", nombre: "Viernes Santo", ambito: "Nacional" },
        { fecha: "2026-05-01", nombre: "Fiesta del Trabajo", ambito: "Nacional" },
        { fecha: "2026-05-02", nombre: "Fiesta de la Comunidad de Madrid", ambito: "Comunidad de Madrid" },
        { fecha: "2026-05-15", nombre: "San Isidro Labrador", ambito: "Madrid capital" },
        { fecha: "2026-08-15", nombre: "Asunción de la Virgen", ambito: "Nacional" },
        { fecha: "2026-10-12", nombre: "Fiesta Nacional de España", ambito: "Nacional" },
        { fecha: "2026-11-02", nombre: "Todos los Santos (traslado)", ambito: "Comunidad de Madrid" },
        { fecha: "2026-11-09", nombre: "Nuestra Señora de la Almudena", ambito: "Madrid capital" },
        { fecha: "2026-12-07", nombre: "Día de la Constitución (traslado)", ambito: "Comunidad de Madrid" },
        { fecha: "2026-12-08", nombre: "Inmaculada Concepción", ambito: "Nacional" },
        { fecha: "2026-12-25", nombre: "Navidad", ambito: "Nacional" }
      ],
      // Decreto 82/2026 (BOCM 01/10/2026). Festivos locales de Madrid capital aún sin aprobar.
      "2027": [
        { fecha: "2027-01-01", nombre: "Año Nuevo", ambito: "Nacional" },
        { fecha: "2027-01-06", nombre: "Epifanía del Señor (Reyes)", ambito: "Nacional" },
        { fecha: "2027-03-19", nombre: "San José", ambito: "Comunidad de Madrid" },
        { fecha: "2027-03-25", nombre: "Jueves Santo", ambito: "Comunidad de Madrid" },
        { fecha: "2027-03-26", nombre: "Viernes Santo", ambito: "Nacional" },
        { fecha: "2027-05-01", nombre: "Fiesta del Trabajo", ambito: "Nacional" },
        { fecha: "2027-05-15", nombre: "San Isidro Labrador", ambito: "Madrid capital", provisional: true },
        { fecha: "2027-08-16", nombre: "Asunción de la Virgen (traslado)", ambito: "Comunidad de Madrid" },
        { fecha: "2027-10-12", nombre: "Fiesta Nacional de España", ambito: "Nacional" },
        { fecha: "2027-11-01", nombre: "Todos los Santos", ambito: "Nacional" },
        { fecha: "2027-11-09", nombre: "Nuestra Señora de la Almudena", ambito: "Madrid capital", provisional: true },
        { fecha: "2027-12-06", nombre: "Día de la Constitución", ambito: "Nacional" },
        { fecha: "2027-12-08", nombre: "Inmaculada Concepción", ambito: "Nacional" },
        { fecha: "2027-12-25", nombre: "Navidad", ambito: "Nacional" }
      ]
    },
    // Respaldo si un año no tiene oficiales ni hay conexión. soloConfig: la fuente online no lo da (locales) y se añade siempre.
    festivosHabituales: [
      { fecha: "01-01", nombre: "Año Nuevo", ambito: "Nacional" },
      { fecha: "01-06", nombre: "Epifanía del Señor (Reyes)", ambito: "Nacional" },
      { pascua: -3, nombre: "Jueves Santo", ambito: "Comunidad de Madrid" },
      { pascua: -2, nombre: "Viernes Santo", ambito: "Nacional" },
      { fecha: "05-01", nombre: "Fiesta del Trabajo", ambito: "Nacional" },
      { fecha: "05-02", nombre: "Fiesta de la Comunidad de Madrid", ambito: "Comunidad de Madrid" },
      { fecha: "05-15", nombre: "San Isidro Labrador", ambito: "Madrid capital", soloConfig: true },
      { fecha: "08-15", nombre: "Asunción de la Virgen", ambito: "Nacional" },
      { fecha: "10-12", nombre: "Fiesta Nacional de España", ambito: "Nacional" },
      { fecha: "11-01", nombre: "Todos los Santos", ambito: "Nacional" },
      { fecha: "11-09", nombre: "Nuestra Señora de la Almudena", ambito: "Madrid capital", soloConfig: true },
      { fecha: "12-06", nombre: "Día de la Constitución", ambito: "Nacional" },
      { fecha: "12-08", nombre: "Inmaculada Concepción", ambito: "Nacional" },
      { fecha: "12-25", nombre: "Navidad", ambito: "Nacional" }
    ],
    senalados: [
      { fecha: "01-05", nombre: "Cabalgata de Reyes" },
      { fecha: "01-06", nombre: "Sorteo de la Lotería del Niño" },
      { fecha: "01-07", nombre: "Empiezan las rebajas de invierno" },
      { fecha: "02-14", nombre: "San Valentín" },
      { pascua: -47, nombre: "Martes de Carnaval" },
      { pascua: -46, nombre: "Miércoles de Ceniza" },
      { fecha: "03-08", nombre: "Día Internacional de la Mujer" },
      { fecha: "03-19", nombre: "Día del Padre en España" },
      { pascua: -7, nombre: "Domingo de Ramos" },
      { pascua: 0, nombre: "Domingo de Resurrección" },
      { fecha: "04-23", nombre: "Día del Libro" },
      { regla: { mes: 5, diaSemana: 0, orden: 1 }, nombre: "Día de la Madre en España" },
      { pascua: 60, nombre: "Corpus Christi" },
      { fecha: "06-23", nombre: "Noche de San Juan" },
      { fecha: "07-01", nombre: "Empiezan las rebajas de verano" },
      { fecha: "08-07", nombre: "Verbena de San Cayetano" },
      { fecha: "08-10", nombre: "Verbena de San Lorenzo" },
      { fecha: "08-15", nombre: "Fiestas de la Virgen de la Paloma" },
      { fecha: "10-31", nombre: "Halloween" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 1 }, nombre: "Black Friday" },
      { fecha: "12-22", nombre: "Sorteo de la Lotería de Navidad" },
      { fecha: "12-24", nombre: "Nochebuena" },
      { fecha: "12-28", nombre: "Día de los Santos Inocentes" },
      { fecha: "12-31", nombre: "Nochevieja" },
      { fecha: "12-31", nombre: "San Silvestre Vallecana" },
      { fecha: "10-05", nombre: "Recordatorio: añadir los festivos de España del año siguiente (BOCM)" }
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
    { fecha: "01-01", texto: "¡Feliz Año Nuevo! Un beso cariño, ¡qué pena que no estés aquí!" },
    { fecha: "01-06", texto: "¡Felices Reyes Magos!", zona: "pais" },
    { fecha: "12-25", texto: "¡Feliz Navidad Carlotis! ¡Te quiero cariño!" },
    { fecha: "2027-06-20", texto: "¡Hoy vuelves a casa! Buen viaje, cariño. ¡Te esperamos con los brazos abiertos!", lista: "Vuelta a casa" },
    { regla: { mes: 2, diaSemana: 1, orden: 3 }, texto: "¡Día de los Presidentes! Jajaja, ¡qué raros son!" },
    { regla: { mes: 11, diaSemana: 4, orden: 4 }, texto: "¡Feliz Día de Acción de Gracias! Que pases una velada inolvidable dando gracias en familia." }
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

  /* ---------- Solo en el laboratorio: avisos y noticias de ejemplo ----------
     Fuentes de prueba: revisar que siguen publicando antes de llevarlas a una página real. */
  avisos: {
    feed: "https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-spain",
    minutosCache: 30,
    zonas: [{ nombre: "Madrid", buscar: ["Madrid"] }]
  },
  noticias: {
    porPais: 6,
    minutosCache: 30,
    paises: [
      { nombre: "España", fuentes: [{ nombre: "", rss: "https://news.google.com/rss/search?q=pol%C3%ADtica+Espa%C3%B1a&hl=es&gl=ES&ceid=ES:es" }] },
      { nombre: "EE. UU.", fuentes: [{ nombre: "", rss: "https://news.google.com/rss/search?q=politics&hl=en-US&gl=US&ceid=US:en" }] }
    ]
  },

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
    // West Branch-Rose City Area Schools, curso 2026-2027 (PDF oficial del distrito).
    // provisional: true -> deducido del recuento de días lectivos del PDF; confirmar con el instituto.
    escolar: [
      { fecha: "2026-08-31", nombre: "Primer día de clase" },
      { fecha: "2026-09-04", hasta: "2026-09-07", nombre: "Sin clase: puente del Labor Day" },
      { fecha: "2026-09-30", nombre: "Salida anticipada", nota: "11:24" },
      { fecha: "2026-10-15", nombre: "Reunión de padres y profesores", nota: "OHHS, 16:00 a 18:00" },
      { fecha: "2026-10-22", nombre: "Reunión de padres y profesores", nota: "OHHS, 16:00 a 18:00" },
      { fecha: "2026-10-30", nombre: "Salida anticipada y fin del primer trimestre", nota: "11:24" },
      { fecha: "2026-11-25", hasta: "2026-11-27", nombre: "Sin clase: Thanksgiving", provisional: true },
      { fecha: "2026-12-23", hasta: "2027-01-01", nombre: "Vacaciones de Navidad", provisional: true },
      { fecha: "2027-01-15", nombre: "Fin del primer semestre" },
      { fecha: "2027-01-27", nombre: "Salida anticipada", nota: "11:24" },
      { fecha: "2027-02-24", nombre: "Salida anticipada y reunión de padres y profesores", nota: "OHHS" },
      { fecha: "2027-02-25", nombre: "Reunión de padres y profesores", nota: "OHHS" },
      { fecha: "2027-03-29", hasta: "2027-04-02", nombre: "Vacaciones de primavera", provisional: true },
      { fecha: "2027-04-28", nombre: "Salida anticipada", nota: "11:24" },
      { fecha: "2027-06-09", nombre: "Último día de clase" }
    ],
    // Eventos con fecha concreta. hora: "HH:MM" en hora de EE. UU. (Michigan); la página pone también la del país.
    // pais: "usa" o "pais" (solo informativo) · provisional: true -> fecha por confirmar.
    eventos: [
      { fecha: "2026-11-03", nombre: "Elecciones de mitad de mandato", categoria: "EE. UU.", pais: "usa" },
      { fecha: "2027-02-14", nombre: "Super Bowl LXI", categoria: "NFL", pais: "usa", nota: "SoFi Stadium, Inglewood (California)" },
      // Detroit Lions, temporada 2026 (calendario oficial publicado el 14/05/2026). Horas de Michigan.
      { fecha: "2026-09-13", nombre: "Lions - New Orleans Saints", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-09-17", nombre: "Buffalo Bills - Lions", categoria: "Lions", nota: "Thursday Night Football" },
      { fecha: "2026-09-27", nombre: "Lions - New York Jets", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-10-04", nombre: "Carolina Panthers - Lions", categoria: "Lions", hora: "20:20", nota: "Sunday Night Football" },
      { fecha: "2026-10-11", nombre: "Arizona Cardinals - Lions", categoria: "Lions", hora: "16:25" },
      { fecha: "2026-10-25", nombre: "Lions - Green Bay Packers", categoria: "Lions", hora: "16:25", nota: "Ford Field" },
      { fecha: "2026-11-01", nombre: "Lions - Minnesota Vikings", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-11-08", nombre: "Miami Dolphins - Lions", categoria: "Lions", hora: "13:00" },
      { fecha: "2026-11-15", nombre: "Lions - New England Patriots", categoria: "Lions", hora: "09:30", nota: "Múnich, Alemania" },
      { fecha: "2026-11-22", nombre: "Lions - Tampa Bay Buccaneers", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-11-26", nombre: "Lions - Chicago Bears", categoria: "Lions", nota: "partido de Acción de Gracias · Ford Field" },
      { fecha: "2026-12-06", nombre: "Atlanta Falcons - Lions", categoria: "Lions", hora: "13:00" },
      { fecha: "2026-12-13", nombre: "Lions - Tennessee Titans", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-12-20", nombre: "Minnesota Vikings - Lions", categoria: "Lions", nota: "Sunday Night Football" },
      { fecha: "2026-12-28", nombre: "Lions - New York Giants", categoria: "Lions", hora: "20:15", nota: "Monday Night Football · Ford Field" },
      { fecha: "2027-01-03", nombre: "Chicago Bears - Lions", categoria: "Lions", nota: "por la tarde" },
      { fecha: "2027-01-10", nombre: "Green Bay Packers - Lions", categoria: "Lions", provisional: true, nota: "día (9 o 10 de enero) y hora por confirmar" }
    ]
  }
};
