/* =============================================================
   CONFIGURAZIONE DELLA PAGINA (versione USA + Italia)
   Modifica solo questo file per cambiare luoghi, date o testi.
   - Coordinate: Google Maps, clic destro sul punto, copia.
   - Date sempre nel formato "AAAA-MM-GG" (o "MM-GG" se si ripete ogni anno).
   - Rispetta virgole e virgolette: un errore qui lascia la pagina vuota.
   ============================================================= */

window.CONFIG = {
  titulo: "Home",        // si vede solo nella scheda e nell'icona della schermata Home
  version: "usa-it",
  idioma: "it",                  // textos de la página: apartados/textos/it.js     // identificativo unico di questo sito: separa la sua cache dalle altre versioni
  datos: { palabras: "palabras-it", santoral: "santoral-it", cumples: "cumples-it" },   // apartados/datos/ propios de esta versión

  // Versioni pubblicate: toccando la bandiera del paese appare un menu per cambiare.
  // url relativo e terminato con index.html: funziona sia su GitHub Pages sia aprendo i file in locale.
  versiones: [
    { id: "usa-es", bandera: "ES", nombre: "España", url: "../inicio-usa-espana/index.html" },
    { id: "usa-it", bandera: "IT", nombre: "Italia", url: "../inicio-usa-italia/index.html" },
    { id: "usa-br", bandera: "BR", nombre: "Brasil", url: "../inicio-usa-brasil/index.html" },
    { id: "usa-pl", bandera: "PL", nombre: "Polska", url: "../inicio-usa-polska/index.html" }
  ],

  // Ora di riferimento per "oggi", il calendario, il conto alla rovescia e il cambio giornaliero delle frasi:
  // "usa" (West Branch) o "pais".
  zonaPrincipal: "usa",

  /* ---------- Stati Uniti (fisso in tutte le versioni) ---------- */
  usa: {
    nombre: "Stati Uniti",
    nombreCorto: "USA",
    bandera: "US",
    ciudadReloj: "West Branch",
    zonaHoraria: "America/Detroit",
    tiempo: { nombre: "West Branch, MI", lat: 44.2764, lon: -84.2386, mostrarAmbasUnidades: true },
    // Festivi online: federali + Michigan. Le date federali sono fissate per legge: si danno per confermate.
    festivosOnline: { pais: "US", region: "US-MI", ambitoNacional: "Federale", ambitoRegion: "Michigan", confirmados: true },
    // Traduzione dei nomi forniti dalla fonte online
    nombresFestivos: {
      "New Year's Day": "Capodanno",
      "Martin Luther King, Jr. Day": "Giorno di Martin Luther King",
      "Martin Luther King Jr. Day": "Giorno di Martin Luther King",
      "Presidents Day": "Giorno dei Presidenti",
      "Presidents' Day": "Giorno dei Presidenti",
      "Washington's Birthday": "Giorno dei Presidenti",
      "Memorial Day": "Memorial Day (Giorno dei Caduti)",
      "Juneteenth": "Juneteenth (fine della schiavitù)",
      "Juneteenth National Independence Day": "Juneteenth (fine della schiavitù)",
      "Independence Day": "Giorno dell'Indipendenza",
      "Labor Day": "Labor Day (Festa del Lavoro)",
      "Labour Day": "Labor Day (Festa del Lavoro)",
      "Columbus Day": "Columbus Day / Giornata dei Popoli Indigeni",
      "Veterans Day": "Giorno dei Veterani",
      "Thanksgiving Day": "Thanksgiving (Giorno del Ringraziamento)",
      "Christmas Day": "Natale"
    },
    // Si usano solo senza connessione né copia salvata (segnati come "previsti")
    festivosHabituales: [
      { fecha: "01-01", nombre: "Capodanno", ambito: "Federale" },
      { regla: { mes: 1, diaSemana: 1, orden: 3 }, nombre: "Giorno di Martin Luther King", ambito: "Federale" },
      { regla: { mes: 2, diaSemana: 1, orden: 3 }, nombre: "Giorno dei Presidenti", ambito: "Federale" },
      { regla: { mes: 5, diaSemana: 1, orden: -1 }, nombre: "Memorial Day (Giorno dei Caduti)", ambito: "Federale" },
      { fecha: "06-19", nombre: "Juneteenth (fine della schiavitù)", ambito: "Federale" },
      { fecha: "07-04", nombre: "Giorno dell'Indipendenza", ambito: "Federale" },
      { regla: { mes: 9, diaSemana: 1, orden: 1 }, nombre: "Labor Day (Festa del Lavoro)", ambito: "Federale" },
      { regla: { mes: 10, diaSemana: 1, orden: 2 }, nombre: "Columbus Day / Giornata dei Popoli Indigeni", ambito: "Federale" },
      { fecha: "11-11", nombre: "Giorno dei Veterani", ambito: "Federale" },
      { regla: { mes: 11, diaSemana: 4, orden: 4 }, nombre: "Thanksgiving (Giorno del Ringraziamento)", ambito: "Federale" },
      { fecha: "12-25", nombre: "Natale", ambito: "Federale" }
    ],
    // Ricorrenze che non sono festivi. Se il paese ne ha una con lo stesso nome, esce una volta sola.
    // I cambi d'ora si calcolano da soli.
    senalados: [
      { fecha: "02-02", nombre: "Giorno della Marmotta" },
      { fecha: "02-14", nombre: "San Valentino" },
      { fecha: "03-17", nombre: "San Patrizio" },
      { regla: { mes: 5, diaSemana: 0, orden: 2 }, nombre: "Festa della mamma" },
      { regla: { mes: 6, diaSemana: 0, orden: 3 }, nombre: "Festa del papà negli USA" },
      { fecha: "10-31", nombre: "Halloween" },
      { fecha: "11-15", nombre: "Apertura della caccia al cervo in Michigan", nota: "fucile, fino al 30 novembre" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 1 }, nombre: "Black Friday" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 4 }, nombre: "Cyber Monday" },
      { fecha: "12-24", nombre: "Vigilia di Natale" },
      { fecha: "12-31", nombre: "San Silvestro" },
      { fecha: "05-20", nombre: "Promemoria: aggiungere il calendario dei Lions della nuova stagione" },
      { fecha: "06-01", nombre: "Promemoria: aggiungere il calendario scolastico di Ogemaw Heights del prossimo anno" }
    ]
  },

  /* ---------- Paese confrontato con gli USA (ciò che cambia tra le versioni) ----------
     festivos: ufficiali per anno, prevalgono su quelli online.
     fuenteOficial: se presente, la pagina avvisa quando mancano quelli dell'anno in corso o del successivo. */
  pais: {
    nombre: "Italia",
    bandera: "IT",
    ciudadReloj: "Parma",
    zonaHoraria: "Europe/Rome",
    tiempo: { nombre: "Parma", lat: 44.8015, lon: 10.3279 },
    // Valuta del convertitore (dollari contro questa). tasaRespaldo: unità per 1 dollaro, solo senza connessione.
    moneda: { codigo: "EUR", simbolo: "€", nombre: "Euro", tasaRespaldo: 0.87 },
    festivosOnline: { pais: "IT", ambitoNacional: "Nazionale", confirmados: false },
    fuenteOficial: "Legge 260/1949 e successive modifiche",
    festivos: {
      // 12 festivi nazionali (con San Francesco dal 2026, Legge 151/2025) + patrono di Parma
      "2026": [
        { fecha: "2026-01-01", nombre: "Capodanno", ambito: "Nazionale" },
        { fecha: "2026-01-06", nombre: "Epifania", ambito: "Nazionale" },
        { fecha: "2026-01-13", nombre: "Sant'Ilario, patrono di Parma", ambito: "Parma" },
        { fecha: "2026-04-06", nombre: "Lunedì dell'Angelo (Pasquetta)", ambito: "Nazionale" },
        { fecha: "2026-04-25", nombre: "Festa della Liberazione", ambito: "Nazionale" },
        { fecha: "2026-05-01", nombre: "Festa dei Lavoratori", ambito: "Nazionale" },
        { fecha: "2026-06-02", nombre: "Festa della Repubblica", ambito: "Nazionale" },
        { fecha: "2026-08-15", nombre: "Ferragosto (Assunzione)", ambito: "Nazionale" },
        { fecha: "2026-10-04", nombre: "San Francesco d'Assisi, patrono d'Italia", ambito: "Nazionale" },
        { fecha: "2026-11-01", nombre: "Ognissanti", ambito: "Nazionale" },
        { fecha: "2026-12-08", nombre: "Immacolata Concezione", ambito: "Nazionale" },
        { fecha: "2026-12-25", nombre: "Natale", ambito: "Nazionale" },
        { fecha: "2026-12-26", nombre: "Santo Stefano", ambito: "Nazionale" }
      ],
      "2027": [
        { fecha: "2027-01-01", nombre: "Capodanno", ambito: "Nazionale" },
        { fecha: "2027-01-06", nombre: "Epifania", ambito: "Nazionale" },
        { fecha: "2027-01-13", nombre: "Sant'Ilario, patrono di Parma", ambito: "Parma" },
        { fecha: "2027-03-29", nombre: "Lunedì dell'Angelo (Pasquetta)", ambito: "Nazionale" },
        { fecha: "2027-04-25", nombre: "Festa della Liberazione", ambito: "Nazionale" },
        { fecha: "2027-05-01", nombre: "Festa dei Lavoratori", ambito: "Nazionale" },
        { fecha: "2027-06-02", nombre: "Festa della Repubblica", ambito: "Nazionale" },
        { fecha: "2027-08-15", nombre: "Ferragosto (Assunzione)", ambito: "Nazionale" },
        { fecha: "2027-10-04", nombre: "San Francesco d'Assisi, patrono d'Italia", ambito: "Nazionale" },
        { fecha: "2027-11-01", nombre: "Ognissanti", ambito: "Nazionale" },
        { fecha: "2027-12-08", nombre: "Immacolata Concezione", ambito: "Nazionale" },
        { fecha: "2027-12-25", nombre: "Natale", ambito: "Nazionale" },
        { fecha: "2027-12-26", nombre: "Santo Stefano", ambito: "Nazionale" }
      ]
    },
    // Riserva se un anno non ha festivi ufficiali né connessione. soloConfig: la fonte online non lo fornisce (patrono).
    festivosHabituales: [
      { fecha: "01-01", nombre: "Capodanno", ambito: "Nazionale" },
      { fecha: "01-06", nombre: "Epifania", ambito: "Nazionale" },
      { fecha: "01-13", nombre: "Sant'Ilario, patrono di Parma", ambito: "Parma", soloConfig: true },
      { pascua: 1, nombre: "Lunedì dell'Angelo (Pasquetta)", ambito: "Nazionale" },
      { fecha: "04-25", nombre: "Festa della Liberazione", ambito: "Nazionale" },
      { fecha: "05-01", nombre: "Festa dei Lavoratori", ambito: "Nazionale" },
      { fecha: "06-02", nombre: "Festa della Repubblica", ambito: "Nazionale" },
      { fecha: "08-15", nombre: "Ferragosto (Assunzione)", ambito: "Nazionale" },
      { fecha: "10-04", nombre: "San Francesco d'Assisi, patrono d'Italia", ambito: "Nazionale" },
      { fecha: "11-01", nombre: "Ognissanti", ambito: "Nazionale" },
      { fecha: "12-08", nombre: "Immacolata Concezione", ambito: "Nazionale" },
      { fecha: "12-25", nombre: "Natale", ambito: "Nazionale" },
      { fecha: "12-26", nombre: "Santo Stefano", ambito: "Nazionale" }
    ],
    senalados: [
      { fecha: "02-14", nombre: "San Valentino" },
      { pascua: -52, nombre: "Giovedì grasso" },
      { pascua: -47, nombre: "Martedì grasso" },
      { pascua: -46, nombre: "Mercoledì delle Ceneri" },
      { fecha: "03-08", nombre: "Festa della donna" },
      { fecha: "03-19", nombre: "Festa del papà in Italia" },
      { pascua: -7, nombre: "Domenica delle Palme" },
      { pascua: 0, nombre: "Pasqua" },
      { regla: { mes: 5, diaSemana: 0, orden: 2 }, nombre: "Festa della mamma" },
      { fecha: "08-10", nombre: "Notte di San Lorenzo (stelle cadenti)" },
      { fecha: "10-31", nombre: "Halloween" },
      { fecha: "11-02", nombre: "Commemorazione dei defunti" },
      { fecha: "11-04", nombre: "Giornata dell'Unità nazionale e delle Forze armate" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 1 }, nombre: "Black Friday" },
      { fecha: "12-24", nombre: "Vigilia di Natale" },
      { fecha: "12-31", nombre: "San Silvestro" },
      { fecha: "11-15", nombre: "Promemoria: aggiungere i festivi italiani dell'anno prossimo in config.js" }
    ]
  },

  /* ---------- Messaggi speciali (sostituiscono la frase del giorno) ----------
     fecha: "MM-GG" (ogni anno) o "AAAA-MM-GG" (un giorno) · regla: { mes, diaSemana, orden }
     zona: se omessa, quella di zonaPrincipal; "pais"; "usa"; "ambas".
     lista: testo per il calendario e "Prossime date" · avisar: avviso nei giorni prima · confeti: coriandoli.
     I COMPLEANNI VANNO IN cumples.js.                                                 */
  avisoPrevioDias: 3,
  aviso: { activo: true, segundos: 5 },
  mensajesEspeciales: [
    { fecha: "01-01", texto: "Buon anno! Un abbraccio grande da casa." },
    { fecha: "01-06", texto: "Buona Befana!", zona: "pais" },
    { fecha: "12-25", texto: "Buon Natale! Ti pensiamo tanto." },
    { regla: { mes: 11, diaSemana: 4, orden: 4 }, texto: "Buon Thanksgiving! Goditi la cena del Ringraziamento." }
  ],

  /* ---------- Ordine delle sezioni (sotto bandiere e meteo) ----------
     calendario, proximasFechas, conversor, solAire, expresiones. Quella tolta dalla lista non si mostra. */
  ordenSecciones: ["calendario", "proximasFechas", "conversor", "solAire", "expresiones"],

  /* ---------- Meteo ----------
     Una scheda per luogo, in quest'ordine. Oggi ora per ora + "diasTiempo" giorni da domani (da 1 a 15). */
  ordenTiempo: ["usa", "pais"],
  diasTiempo: 6,

  /* ---------- Espressioni utili ---------- */
  palabrasPorDia: 20,

  /* ---------- Prossime date ----------
     Tutto ciò che cade nei prossimi proximasFechasDias giorni; se sono meno di mostrarFechas, si completa. */
  proximasFechasDias: 31,
  mostrarFechas: 12,
  // Categorie di eventi che compaiono solo nel calendario
  proximasFechasExcluir: ["Lions"],

  /* ---------- Dati online (salvati nel browser; se non rispondono, si usa config.js) ---------- */
  online: {
    festivos: true,
    deportes: {
      activo: true,
      clave: "123",            // chiave gratuita di TheSportsDB
      horasCache: 12,
      equipos: [
        // coincide: parola per riconoscere la squadra nelle partite · categoria: quella dei suoi eventi in config.js
        { nombre: "Detroit Lions", buscar: "Detroit Lions", deporte: "American Football", coincide: "Lions", categoria: "Lions" }
      ]
    }
  },

  /* ---------- Calendario ---------- */
  calendario: {
    nombreEscolar: "Ogemaw Heights",
    // West Branch-Rose City Area Schools, anno scolastico 2026-2027 (PDF ufficiale del distretto).
    // provisional: true -> dedotto dal conteggio dei giorni di lezione del PDF; da confermare con la scuola.
    escolar: [
      { fecha: "2026-08-31", nombre: "Primo giorno di scuola" },
      { fecha: "2026-09-04", hasta: "2026-09-07", nombre: "Niente scuola: ponte del Labor Day" },
      { fecha: "2026-09-30", nombre: "Uscita anticipata", nota: "11:24" },
      { fecha: "2026-10-15", nombre: "Colloqui genitori-insegnanti", nota: "OHHS, 16:00-18:00" },
      { fecha: "2026-10-22", nombre: "Colloqui genitori-insegnanti", nota: "OHHS, 16:00-18:00" },
      { fecha: "2026-10-30", nombre: "Uscita anticipata e fine del primo periodo", nota: "11:24" },
      { fecha: "2026-11-25", hasta: "2026-11-27", nombre: "Niente scuola: Thanksgiving", provisional: true },
      { fecha: "2026-12-23", hasta: "2027-01-01", nombre: "Vacanze di Natale", provisional: true },
      { fecha: "2027-01-15", nombre: "Fine del primo semestre" },
      { fecha: "2027-01-27", nombre: "Uscita anticipata", nota: "11:24" },
      { fecha: "2027-02-24", nombre: "Uscita anticipata e colloqui genitori-insegnanti", nota: "OHHS" },
      { fecha: "2027-02-25", nombre: "Colloqui genitori-insegnanti", nota: "OHHS" },
      { fecha: "2027-03-29", hasta: "2027-04-02", nombre: "Vacanze di primavera", provisional: true },
      { fecha: "2027-04-28", nombre: "Uscita anticipata", nota: "11:24" },
      { fecha: "2027-06-09", nombre: "Ultimo giorno di scuola" }
    ],
    // Eventi con data precisa. hora: "HH:MM" in ora degli USA (Michigan); la pagina aggiunge anche quella italiana.
    eventos: [
      { fecha: "2026-11-03", nombre: "Elezioni di metà mandato", categoria: "USA", pais: "usa" },
      { fecha: "2027-02-14", nombre: "Super Bowl LXI", categoria: "NFL", pais: "usa", nota: "SoFi Stadium, Inglewood (California)" },
      // Detroit Lions, stagione 2026 (calendario ufficiale pubblicato il 14/05/2026). Orari del Michigan.
      { fecha: "2026-09-13", nombre: "Lions - New Orleans Saints", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-09-17", nombre: "Buffalo Bills - Lions", categoria: "Lions", nota: "Thursday Night Football" },
      { fecha: "2026-09-27", nombre: "Lions - New York Jets", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-10-04", nombre: "Carolina Panthers - Lions", categoria: "Lions", hora: "20:20", nota: "Sunday Night Football" },
      { fecha: "2026-10-11", nombre: "Arizona Cardinals - Lions", categoria: "Lions", hora: "16:25" },
      { fecha: "2026-10-25", nombre: "Lions - Green Bay Packers", categoria: "Lions", hora: "16:25", nota: "Ford Field" },
      { fecha: "2026-11-01", nombre: "Lions - Minnesota Vikings", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-11-08", nombre: "Miami Dolphins - Lions", categoria: "Lions", hora: "13:00" },
      { fecha: "2026-11-15", nombre: "Lions - New England Patriots", categoria: "Lions", hora: "09:30", nota: "Monaco di Baviera, Germania" },
      { fecha: "2026-11-22", nombre: "Lions - Tampa Bay Buccaneers", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-11-26", nombre: "Lions - Chicago Bears", categoria: "Lions", nota: "partita del Ringraziamento · Ford Field" },
      { fecha: "2026-12-06", nombre: "Atlanta Falcons - Lions", categoria: "Lions", hora: "13:00" },
      { fecha: "2026-12-13", nombre: "Lions - Tennessee Titans", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-12-20", nombre: "Minnesota Vikings - Lions", categoria: "Lions", nota: "Sunday Night Football" },
      { fecha: "2026-12-28", nombre: "Lions - New York Giants", categoria: "Lions", hora: "20:15", nota: "Monday Night Football · Ford Field" },
      { fecha: "2027-01-03", nombre: "Chicago Bears - Lions", categoria: "Lions", nota: "nel pomeriggio" },
      { fecha: "2027-01-10", nombre: "Green Bay Packers - Lions", categoria: "Lions", provisional: true, nota: "giorno (9 o 10 gennaio) e orario da confermare" }
    ]
  }
};
