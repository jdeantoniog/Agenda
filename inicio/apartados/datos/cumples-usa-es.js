/* =============================================================
   CUMPLEAÑOS
   Una línea por persona:  ["MM-DD", "Nombre"],
   - Mes y día con dos cifras: "03-11", no "3-11".
   - Todas las líneas llevan coma al final (la última también vale).
   - Opcional, al final: { avisar: false } para no avisar los días previos;
     { texto: "..." } y { lista: "..." } para cambiar el mensaje del día y el texto del calendario.
   - Los cumpleaños se ven en las dos zonas horarias: desde que empieza el día en el país
     hasta que acaba en EE. UU.
   Cada cumpleaños sale en el calendario, en "Próximas fechas",
   en la cuenta atrás y con un mensaje y confeti ese día.
   ============================================================= */

window.CUMPLES = [
  
  //["02-28", "Carlota", { avisar: false, texto: "¡Feliz cumpleaños Carlotilla!", lista: "Tu cumpleaños" }],
  // Enero
  ["01-03", "Elena"],
  ["01-24", "Abuita"],
  // Febrero
  ["02-28", "Carlota", {texto: "¡Feliz cumpleaños Carlotilla!", lista: "Tu cumpleaños" }],
  // Abril
  ["04-05", "Celia"],
  // Mayo
  ["05-16", "Valeria"],
  // Junio
  // Julio
  ["07-03", "Paco"],  
  ["07-07", "Tio Antonio"],
  ["07-18", "Papi"],
  // Agosto
  ["08-12", "Tio Javi"], 
  // Septiembre
  ["09-05", "Nati"],
  ["09-27", "Mámi"],
  // Octubre
  ["10-03", "Abuito"],
  ["10-14", "Marta", {texto: "¡Feliz cumpleaños Marta!", lista: "Tu cumpleaños" }],
  ["10-18", "Marina", {texto: "¡Feliz cumpleaños Marina!", lista: "Tu cumpleaños" }],
  ["10-20", "Elisa", {texto: "¡Feliz cumpleaños Elisa!", lista: "Tu cumpleaños" }],
  // Noviembre
  // Diciembre
];
