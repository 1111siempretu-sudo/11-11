/* Datos de la página "Nuestro primer año".
   Reconstruido: edita aquí los textos, fechas y fotos a tu gusto. */
window.NOSOTROS = {
  nombre: 'Mi Razón mas Bonita',
  inicio: '2025-11-11',        // el día en que empezó todo
  aniversario: '2026-11-11',   // el primer aniversario

  // Los 11 recuerdos (cinta de fotos y tambor). pos = enfoque de la foto.
  fotos: [
    { src: 'img2/r01.jpg', pos: '54% 50%', fecha: '2025-09-06', titulo: 'Donde comenzó todo', frase: ['Aunque el cielo esté gris,', 'a tu lado siempre sale el sol.'] },
    { src: 'img2/r02.jpg', pos: '76% 50%', fecha: '2025-09-06', titulo: 'Tu risa', frase: ['Tu risa es mi canción favorita,', 'no la apagues nunca.'] },
    { src: 'img2/r03.jpg', pos: '29% 50%', fecha: '2025-09-11', titulo: 'Aquella tarde', frase: ['Contigo hasta el parque', 'se vuelve el mejor plan.'] },
    { src: 'img2/r04.jpg', pos: '40% 50%', fecha: '2025-09-12', titulo: 'Ese beso', frase: ['Un beso tuyo', 'y se detiene todo el reloj.'] },
    { src: 'img2/r05.jpg', pos: '52% 50%', fecha: '2025-09-13', titulo: 'Nuestra primera salida', frase: ['Perdernos entre el verde', 'también es encontrarnos.'] },
    { src: 'img2/r06.jpg', pos: '50% 50%', fecha: '2025-09-13', titulo: 'Este hermoso momento', frase: ['En medio del bosque', 'mi lugar favorito eres tú.'] },
    { src: 'img2/r07.jpg', pos: '48% 50%', fecha: '2025-10-09', titulo: '& cada día de mi vida', frase: ['Cualquier cena es especial', 'si me toca verte al frente.'] },
    { src: 'img2/r08.jpg', pos: '48% 50%', fecha: '2025-10-09', titulo: 'me has fascinado cada vez más', frase: ['Hasta tus muecas', 'me enamoran un poquito más.'] },
    { src: 'img2/r09.jpg', pos: '50% 31%', fecha: '2025-12-09', titulo: 'como aquel primer día', frase: ['Frío afuera, abrigo adentro:', 'así me siento contigo.'] },
    { src: 'img2/r10.jpg', pos: '43% 50%', fecha: '2025-12-16', titulo: 'Mi amor sonríe estamos juntos', frase: ['Aunque me mires de lado,', 'yo te miro de frente y feliz.'] },
    { src: 'img2/r11.jpg', pos: '68% 50%', fecha: '2025-12-21', titulo: 'Yo sabía que al final me ibas a amar', frase: ['Una tarde sencilla', 'que guardé en el corazón.'] }
  ],

  // Collage de la izquierda y de la derecha (junto al video). Ninguna foto se repite en toda la página.
  collage:  ['img2/c017.jpg', 'img2/c0.jpg', 'img2/g03.jpg', 'img2/g04.jpg', 'img2/c22.jpg',
            'img2/n01.jpg', 'img2/n02.jpg', 'img2/n10.jpg', 'img2/n11.jpg', 'img2/n13.jpg', 'img2/n14.jpg', 'img2/n17.jpg', 'img2/n09.jpg', 'img2/n21.jpg',
            'img2/m01.jpg', 'img2/m02.jpg', 'img2/m03.jpg', 'img2/m07.jpg',
            'img2/p06.jpg', 'img2/p08.jpg', 'img2/p09.jpg', 'img2/p01.jpg'],
  collageR: ['img2/c021.jpg', 'img2/g08.jpg', 'img2/n03.jpg', 'img2/n04.jpg', 'img2/n15.jpg', 'img2/m06.jpg', 'img2/p03.jpg', 'img2/p12.jpg'],

  // Proporciones alto/ancho de las fotos (para acomodar el collage)
  ratios: { g01: 2.256, g02: 1.777, g03: 2.256, g04: 1.0, g05: 1.0, g07: 1.57, g08: 2.256,
    n01: 1.37, n02: 1.37, n03: 0.75, n04: 0.75, n05: 0.562, n06: 0.562, n07: 0.562, n08: 0.75, n09: 0.75, n10: 1.333, n11: 1.333, n12: 0.443, n13: 1.333, n14: 1.333, n15: 0.75, n16: 0.75, n17: 1.333, n18: 0.75, n19: 0.75, n20: 0.75, n21: 1.0,
    m01: 2.255, m02: 2.255, m03: 1.333, m04: 0.443, m05: 1.0, m06: 1.778, m07: 1.333, m08: 0.75, m09: 0.75, m10: 0.75, m11: 0.75,
    p01: 1.0, p02: 0.75, p03: 1.0, p04: 0.443, p05: 0.443, p06: 2.256, p07: 0.443, p08: 1.333, p09: 1.333, p10: 0.75, p11: 0.75, p12: 1.0, p13: 0.75, p14: 0.75, p15: 0.443, p16: 0.943 },

  // Cintas que se desplazan (miniaturas en img2/t/)
  cintaA: ['c11', 'c12', 'c08', 'c09', 'g09', 'c02', 'n05', 'n06', 'n07', 'n12', 'm04', 'm05', 'm08', 'p04', 'p05', 'p07', 'p15', 'p16'],
  cintaB: ['c10', 'c16', 'c018', 'g10', 'c017', 'n08', 'n16', 'n18', 'n19', 'n20', 'm09', 'm10', 'm11', 'p02', 'p10', 'p11', 'p13', 'p14'],

  // Las 8 cartas clásicas (las otras 356 las genera cartas364.js)
  cartas: [
    { titulo: 'Para cuando me extrañes',     texto: ['Cierra los ojos un momento.', 'Aunque no esté, mi pensamiento te va buscando.', 'Pronto nos vemos y te abrazo largo.'], firma: 'Tuyo siempre' },
    { titulo: 'Para cuando dudes de ti',     texto: ['Si supieras lo que yo veo en ti,', 'no volverías a dudar ni un segundo.', 'Eres más fuerte y más bonita de lo que crees.'], firma: 'Tu fan número uno' },
    { titulo: 'Para cuando estés feliz',     texto: ['Qué bonito verte feliz.', 'Se me contagia hasta el alma.', 'Quédate así, que el mundo se ve mejor.'], firma: 'Con todo mi amor' },
    { titulo: 'Para un día difícil',         texto: ['Hoy el mundo pesa más de lo normal,', 'pero tú sigues de pie y eso me enorgullece.', 'Yo cargo contigo lo que haga falta.'], firma: 'Tu persona favorita' },
    { titulo: 'Para cuando quieras reír',    texto: ['Ven, que tengo guardados', 'todos nuestros chistes malos para ti.', 'Prometo reírme primero.'], firma: 'Tu compañero de vida' },
    { titulo: 'Para antes de dormir',        texto: ['Que la luna te cuente que pienso en ti.', 'Descansa, mi vida.', 'Mañana el día lo escribimos juntos.'], firma: 'Quien más te quiere' },
    { titulo: 'Para recordar por qué te elijo', texto: ['Por tu risa, por tu forma de quererme,', 'por cómo haces ligero lo difícil.', 'Te elijo hoy y todos los días.'], firma: 'Con el corazón en la mano' },
    { titulo: 'Para nuestro primer año',     texto: ['Un año y sigo sin creer mi suerte.', 'Gracias por quedarte, por reír, por construir.', 'Lo mejor de mí empezó contigo.'], firma: 'Siempre tuyo' }
  ],

  // Piropos del jardín
  piropos: [
    'Si tus ojos fueran estrellas, yo viviría en el cielo.',
    'No eres de este mundo, pero qué suerte la mía que viniste al mío.',
    'Contigo hasta el lunes sabe a sábado.',
    'Me quedo con tu risa, tu abrazo y tu manera de mirarme.',
    'Eres mi casualidad favorita.',
    'Tu nombre es mi palabra preferida.',
    'Si me das a elegir entre el universo y tú, ya sabes la respuesta.',
    'Cada rosa de este jardín es un día que elegí quererte.',
    'Eres la razón por la que sonrío mirando el celular.',
    'Contigo aprendí que el hogar también puede ser una persona.',
    'Ni el mejor atardecer le llega a tu sonrisa.',
    'Te quiero hoy, mañana y en todos los planes que se me ocurran.'
  ]
};
