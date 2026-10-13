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
  titulo: "Início",      // solo se ve en la pestaña y en el icono de la pantalla de inicio
  version: "usa-br",
  idioma: "pt",                  // textos de la página: apartados/textos/pt.js     // identificador único de esta web: separa su caché de las otras versiones
  datos: { palabras: "palabras-br", santoral: "santoral-br", cumples: "cumples-br" },   // apartados/datos/ propios de esta versión

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
    nombre: "Estados Unidos",
    nombreCorto: "EUA",
    bandera: "US",
    ciudadReloj: "West Branch",
    zonaHoraria: "America/Detroit",
    tiempo: { nombre: "West Branch, MI", lat: 44.2764, lon: -84.2386, mostrarAmbasUnidades: true },
    festivosOnline: { pais: "US", region: "US-MI", ambitoNacional: "Federal", ambitoRegion: "Michigan", confirmados: true },
    nombresFestivos: {
      "New Year's Day": "Ano-Novo",
      "Martin Luther King, Jr. Day": "Dia de Martin Luther King",
      "Martin Luther King Jr. Day": "Dia de Martin Luther King",
      "Presidents Day": "Dia dos Presidentes",
      "Presidents' Day": "Dia dos Presidentes",
      "Washington's Birthday": "Dia dos Presidentes",
      "Memorial Day": "Memorial Day (Dia dos Mortos em Guerra)",
      "Juneteenth": "Juneteenth (fim da escravidão)",
      "Juneteenth National Independence Day": "Juneteenth (fim da escravidão)",
      "Independence Day": "Dia da Independência dos EUA",
      "Labor Day": "Labor Day (Dia do Trabalho)",
      "Labour Day": "Labor Day (Dia do Trabalho)",
      "Columbus Day": "Columbus Day / Dia dos Povos Indígenas",
      "Veterans Day": "Dia dos Veteranos",
      "Thanksgiving Day": "Thanksgiving (Dia de Ação de Graças)",
      "Christmas Day": "Natal"
    },
    festivosHabituales: [
      { fecha: "01-01", nombre: "Ano-Novo", ambito: "Federal" },
      { regla: { mes: 1, diaSemana: 1, orden: 3 }, nombre: "Dia de Martin Luther King", ambito: "Federal" },
      { regla: { mes: 2, diaSemana: 1, orden: 3 }, nombre: "Dia dos Presidentes", ambito: "Federal" },
      { regla: { mes: 5, diaSemana: 1, orden: -1 }, nombre: "Memorial Day (Dia dos Mortos em Guerra)", ambito: "Federal" },
      { fecha: "06-19", nombre: "Juneteenth (fim da escravidão)", ambito: "Federal" },
      { fecha: "07-04", nombre: "Dia da Independência dos EUA", ambito: "Federal" },
      { regla: { mes: 9, diaSemana: 1, orden: 1 }, nombre: "Labor Day (Dia do Trabalho)", ambito: "Federal" },
      { regla: { mes: 10, diaSemana: 1, orden: 2 }, nombre: "Columbus Day / Dia dos Povos Indígenas", ambito: "Federal" },
      { fecha: "11-11", nombre: "Dia dos Veteranos", ambito: "Federal" },
      { regla: { mes: 11, diaSemana: 4, orden: 4 }, nombre: "Thanksgiving (Dia de Ação de Graças)", ambito: "Federal" },
      { fecha: "12-25", nombre: "Natal", ambito: "Federal" }
    ],
    // Los cambios de hora se calculan solos.
    senalados: [
      { fecha: "02-02", nombre: "Dia da Marmota" },
      { fecha: "02-14", nombre: "Valentine's Day (namorados nos EUA)" },
      { fecha: "03-17", nombre: "Dia de São Patrício" },
      { regla: { mes: 5, diaSemana: 0, orden: 2 }, nombre: "Dia das Mães" },
      { regla: { mes: 6, diaSemana: 0, orden: 3 }, nombre: "Dia dos Pais nos EUA" },
      { fecha: "10-31", nombre: "Halloween" },
      { fecha: "11-15", nombre: "Abertura da caça ao cervo em Michigan", nota: "com rifle, até 30 de novembro" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 1 }, nombre: "Black Friday" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 4 }, nombre: "Cyber Monday" },
      { fecha: "12-24", nombre: "Véspera de Natal" },
      { fecha: "12-31", nombre: "Véspera de Ano-Novo" },
      { fecha: "05-20", nombre: "Lembrete: adicionar o calendário dos Lions da nova temporada" },
      { fecha: "06-01", nombre: "Lembrete: adicionar o calendário escolar de Ogemaw Heights do próximo ano" }
    ]
  },

  /* ---------- País que se compara con EE. UU.: Brasil ----------
     Ciudad provisional: São Paulo. Para cambiarla: tiempo, ciudadReloj, festivosOnline.region y los festivos locales. */
  pais: {
    nombre: "Brasil",
    bandera: "BR",
    ciudadReloj: "São Paulo",
    zonaHoraria: "America/Sao_Paulo",
    tiempo: { nombre: "São Paulo", lat: -23.5505, lon: -46.6333 },
    // tasaRespaldo: reales por 1 dólar, solo sin conexión. Estimación, revisar.
    moneda: { codigo: "BRL", simbolo: "R$", nombre: "Reais", tasaRespaldo: 5.4 },
    festivosOnline: { pais: "BR", region: "BR-SP", ambitoNacional: "Nacional", ambitoRegion: "Estado de São Paulo", confirmados: false },
    fuenteOficial: "Lei 662/1949, Lei 6.802/1980 e Lei 14.759/2023",
    festivos: {
      "2026": [
        { fecha: "2026-01-01", nombre: "Confraternização Universal", ambito: "Nacional" },
        { fecha: "2026-01-25", nombre: "Aniversário de São Paulo", ambito: "Cidade de São Paulo" },
        { fecha: "2026-04-03", nombre: "Sexta-feira Santa", ambito: "Nacional" },
        { fecha: "2026-04-21", nombre: "Tiradentes", ambito: "Nacional" },
        { fecha: "2026-05-01", nombre: "Dia do Trabalho", ambito: "Nacional" },
        { fecha: "2026-06-04", nombre: "Corpus Christi", ambito: "Cidade de São Paulo" },
        { fecha: "2026-07-09", nombre: "Revolução Constitucionalista", ambito: "Estado de São Paulo" },
        { fecha: "2026-09-07", nombre: "Independência do Brasil", ambito: "Nacional" },
        { fecha: "2026-10-12", nombre: "Nossa Senhora Aparecida", ambito: "Nacional" },
        { fecha: "2026-11-02", nombre: "Finados", ambito: "Nacional" },
        { fecha: "2026-11-15", nombre: "Proclamação da República", ambito: "Nacional" },
        { fecha: "2026-11-20", nombre: "Dia Nacional de Zumbi e da Consciência Negra", ambito: "Nacional" },
        { fecha: "2026-12-25", nombre: "Natal", ambito: "Nacional" }
      ],
      "2027": [
        { fecha: "2027-01-01", nombre: "Confraternização Universal", ambito: "Nacional" },
        { fecha: "2027-01-25", nombre: "Aniversário de São Paulo", ambito: "Cidade de São Paulo" },
        { fecha: "2027-03-26", nombre: "Sexta-feira Santa", ambito: "Nacional" },
        { fecha: "2027-04-21", nombre: "Tiradentes", ambito: "Nacional" },
        { fecha: "2027-05-01", nombre: "Dia do Trabalho", ambito: "Nacional" },
        { fecha: "2027-05-27", nombre: "Corpus Christi", ambito: "Cidade de São Paulo" },
        { fecha: "2027-07-09", nombre: "Revolução Constitucionalista", ambito: "Estado de São Paulo" },
        { fecha: "2027-09-07", nombre: "Independência do Brasil", ambito: "Nacional" },
        { fecha: "2027-10-12", nombre: "Nossa Senhora Aparecida", ambito: "Nacional" },
        { fecha: "2027-11-02", nombre: "Finados", ambito: "Nacional" },
        { fecha: "2027-11-15", nombre: "Proclamação da República", ambito: "Nacional" },
        { fecha: "2027-11-20", nombre: "Dia Nacional de Zumbi e da Consciência Negra", ambito: "Nacional" },
        { fecha: "2027-12-25", nombre: "Natal", ambito: "Nacional" }
      ]
    },
    festivosHabituales: [
      { fecha: "01-01", nombre: "Confraternização Universal", ambito: "Nacional" },
      { fecha: "01-25", nombre: "Aniversário de São Paulo", ambito: "Cidade de São Paulo", soloConfig: true },
      { pascua: -2, nombre: "Sexta-feira Santa", ambito: "Nacional" },
      { fecha: "04-21", nombre: "Tiradentes", ambito: "Nacional" },
      { fecha: "05-01", nombre: "Dia do Trabalho", ambito: "Nacional" },
      { pascua: 60, nombre: "Corpus Christi", ambito: "Cidade de São Paulo", soloConfig: true },
      { fecha: "07-09", nombre: "Revolução Constitucionalista", ambito: "Estado de São Paulo" },
      { fecha: "09-07", nombre: "Independência do Brasil", ambito: "Nacional" },
      { fecha: "10-12", nombre: "Nossa Senhora Aparecida", ambito: "Nacional" },
      { fecha: "11-02", nombre: "Finados", ambito: "Nacional" },
      { fecha: "11-15", nombre: "Proclamação da República", ambito: "Nacional" },
      { fecha: "11-20", nombre: "Dia Nacional de Zumbi e da Consciência Negra", ambito: "Nacional" },
      { fecha: "12-25", nombre: "Natal", ambito: "Nacional" }
    ],
    senalados: [
      { pascua: -48, nombre: "Carnaval (segunda-feira)", nota: "ponto facultativo" },
      { pascua: -47, nombre: "Carnaval (terça-feira)", nota: "ponto facultativo" },
      { pascua: -46, nombre: "Quarta-feira de Cinzas" },
      { fecha: "03-08", nombre: "Dia Internacional da Mulher" },
      { pascua: -7, nombre: "Domingo de Ramos" },
      { pascua: 0, nombre: "Páscoa" },
      { fecha: "04-22", nombre: "Descobrimento do Brasil" },
      { regla: { mes: 5, diaSemana: 0, orden: 2 }, nombre: "Dia das Mães" },
      { fecha: "06-12", nombre: "Dia dos Namorados" },
      { fecha: "06-13", nombre: "Festa Junina: Santo Antônio" },
      { fecha: "06-24", nombre: "Festa Junina: São João" },
      { fecha: "06-29", nombre: "Festa Junina: São Pedro" },
      { regla: { mes: 8, diaSemana: 0, orden: 2 }, nombre: "Dia dos Pais" },
      { fecha: "10-12", nombre: "Dia das Crianças" },
      { fecha: "10-15", nombre: "Dia do Professor" },
      { fecha: "10-31", nombre: "Halloween" },
      { regla: { mes: 11, diaSemana: 4, orden: 4, desplazamiento: 1 }, nombre: "Black Friday" },
      { fecha: "12-24", nombre: "Véspera de Natal" },
      { fecha: "12-31", nombre: "Véspera de Ano-Novo" },
      { fecha: "11-15", nombre: "Lembrete: adicionar os feriados do Brasil do próximo ano no config.js" }
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
    { fecha: "01-01", texto: "Feliz Ano-Novo! Um abraço bem grande de casa." },
    { fecha: "12-25", texto: "Feliz Natal! Estamos pensando em você." },
    { regla: { mes: 11, diaSemana: 4, orden: 4 }, texto: "Feliz Thanksgiving! Aproveite o jantar de Ação de Graças." }
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
      { fecha: "2026-08-31", nombre: "Primeiro dia de aula" },
      { fecha: "2026-09-04", hasta: "2026-09-07", nombre: "Sem aula: feriado do Labor Day" },
      { fecha: "2026-09-30", nombre: "Saída antecipada", nota: "11:24" },
      { fecha: "2026-10-15", nombre: "Reunião de pais e professores", nota: "OHHS, 16:00 às 18:00" },
      { fecha: "2026-10-22", nombre: "Reunião de pais e professores", nota: "OHHS, 16:00 às 18:00" },
      { fecha: "2026-10-30", nombre: "Saída antecipada e fim do primeiro bimestre", nota: "11:24" },
      { fecha: "2026-11-25", hasta: "2026-11-27", nombre: "Sem aula: Thanksgiving", provisional: true },
      { fecha: "2026-12-23", hasta: "2027-01-01", nombre: "Férias de Natal", provisional: true },
      { fecha: "2027-01-15", nombre: "Fim do primeiro semestre" },
      { fecha: "2027-01-27", nombre: "Saída antecipada", nota: "11:24" },
      { fecha: "2027-02-24", nombre: "Saída antecipada e reunião de pais e professores", nota: "OHHS" },
      { fecha: "2027-02-25", nombre: "Reunião de pais e professores", nota: "OHHS" },
      { fecha: "2027-03-29", hasta: "2027-04-02", nombre: "Férias de primavera", provisional: true },
      { fecha: "2027-04-28", nombre: "Saída antecipada", nota: "11:24" },
      { fecha: "2027-06-09", nombre: "Último dia de aula" }
    ],
    // hora: "HH:MM" en hora de Michigan; la página añade la del país.
    eventos: [
      { fecha: "2026-11-03", nombre: "Eleições de meio de mandato", categoria: "EUA", pais: "usa" },
      { fecha: "2027-02-14", nombre: "Super Bowl LXI", categoria: "NFL", pais: "usa", nota: "SoFi Stadium, Inglewood (Califórnia)" },
      // Detroit Lions, temporada 2026 (calendario oficial publicado el 14/05/2026)
      { fecha: "2026-09-13", nombre: "Lions - New Orleans Saints", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-09-17", nombre: "Buffalo Bills - Lions", categoria: "Lions", nota: "Thursday Night Football" },
      { fecha: "2026-09-27", nombre: "Lions - New York Jets", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-10-04", nombre: "Carolina Panthers - Lions", categoria: "Lions", hora: "20:20", nota: "Sunday Night Football" },
      { fecha: "2026-10-11", nombre: "Arizona Cardinals - Lions", categoria: "Lions", hora: "16:25" },
      { fecha: "2026-10-25", nombre: "Lions - Green Bay Packers", categoria: "Lions", hora: "16:25", nota: "Ford Field" },
      { fecha: "2026-11-01", nombre: "Lions - Minnesota Vikings", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-11-08", nombre: "Miami Dolphins - Lions", categoria: "Lions", hora: "13:00" },
      { fecha: "2026-11-15", nombre: "Lions - New England Patriots", categoria: "Lions", hora: "09:30", nota: "Munique, Alemanha" },
      { fecha: "2026-11-22", nombre: "Lions - Tampa Bay Buccaneers", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-11-26", nombre: "Lions - Chicago Bears", categoria: "Lions", nota: "jogo de Ação de Graças · Ford Field" },
      { fecha: "2026-12-06", nombre: "Atlanta Falcons - Lions", categoria: "Lions", hora: "13:00" },
      { fecha: "2026-12-13", nombre: "Lions - Tennessee Titans", categoria: "Lions", hora: "13:00", nota: "Ford Field" },
      { fecha: "2026-12-20", nombre: "Minnesota Vikings - Lions", categoria: "Lions", nota: "Sunday Night Football" },
      { fecha: "2026-12-28", nombre: "Lions - New York Giants", categoria: "Lions", hora: "20:15", nota: "Monday Night Football · Ford Field" },
      { fecha: "2027-01-03", nombre: "Chicago Bears - Lions", categoria: "Lions", nota: "à tarde" },
      { fecha: "2027-01-10", nombre: "Green Bay Packers - Lions", categoria: "Lions", provisional: true, nota: "dia (9 ou 10 de janeiro) e horário a confirmar" }
    ]
  }
};
