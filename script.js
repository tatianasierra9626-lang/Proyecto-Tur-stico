/*
  ============================================
  SCRIPT.JS — Comportamiento e interactividad
  ============================================
  Aquí va todo el código que hace que la página
  REACCIONE a lo que el usuario hace (clics,
  scroll, formularios, etc). HTML define QUÉ
  existe, CSS define CÓMO se ve, JS define
  CÓMO SE COMPORTA.
*/


/* ============================================
   1. HEADER CON SOMBRA AL HACER SCROLL
   ============================================ */

// Paso 1: seleccionamos el elemento del header una sola vez
// y lo guardamos en una variable, para no tener que buscarlo
// en el DOM repetidamente (eso sería ineficiente).
const header = document.querySelector('header');

// Paso 2: escuchamos el evento 'scroll', que se dispara
// constantemente mientras el usuario mueve la rueda del mouse
// o desliza el dedo en el celular.
window.addEventListener('scroll', function () {

  // window.scrollY nos dice cuántos píxeles ha bajado el usuario
  // desde la parte superior de la página. Si es mayor a 10px,
  // consideramos que "ya hizo scroll".
  if (window.scrollY > 10) {
    header.classList.add('header-con-sombra');
  } else {
    header.classList.remove('header-con-sombra');
  }
  /*
    Nota importante: NO escribimos aquí el estilo de la sombra
    directamente (ej: header.style.boxShadow = "..."). En vez de
    eso, solo agregamos o quitamos una CLASE ('header-con-sombra').
    El estilo real de esa clase lo definimos en styles.css.
    Esto es la separación de responsabilidades: JS decide CUÁNDO,
    CSS decide CÓMO SE VE.
  */
});


/* ============================================
   2. MENÚ HAMBURGUESA (responsive, solo móvil)
   ============================================ */

// Seleccionamos el botón y el menú de navegación
const botonHamburguesa = document.querySelector('.boton-hamburguesa');
const menuNavegacion = document.querySelector('.menu-navegacion');

// Al hacer clic en el botón hamburguesa, alternamos (toggle) la
// clase 'menu-abierto' en el menú de navegación.
botonHamburguesa.addEventListener('click', function () {
  menuNavegacion.classList.toggle('menu-abierto');

  // Comprobamos si, DESPUÉS del toggle, el menú quedó abierto,
  // para poder actualizar el atributo de accesibilidad aria-expanded.
  const estaAbierto = menuNavegacion.classList.contains('menu-abierto');
  botonHamburguesa.setAttribute('aria-expanded', estaAbierto);
  /*
    classList.contains('clase') devuelve true o false según si el
    elemento tiene esa clase en este momento. Lo usamos para saber
    el estado actual justo después de hacer el toggle.
  */
});

// Seleccionamos TODOS los enlaces dentro del menú de navegación.
// querySelectorAll (con "All") devuelve una lista de elementos,
// a diferencia de querySelector que devuelve solo el primero.
const enlacesDelMenu = document.querySelectorAll('.menu-navegacion a');

// Recorremos cada enlace con forEach, y le agregamos un listener:
// al hacer clic en CUALQUIER enlace, cerramos el menú móvil.
enlacesDelMenu.forEach(function (enlace) {
  enlace.addEventListener('click', function () {
    menuNavegacion.classList.remove('menu-abierto');
    botonHamburguesa.setAttribute('aria-expanded', false);
  });
});


/* ============================================
   3. VALIDACIÓN DEL FORMULARIO DE CONTACTO
   ============================================ */

const formulario = document.querySelector('.formulario-contacto');
const mensajeConfirmacion = document.querySelector('.formulario-confirmacion');

// Escuchamos el evento 'submit', que se dispara cuando el usuario
// hace clic en el botón de enviar (type="submit") DENTRO de un <form>.
formulario.addEventListener('submit', function (evento) {

  evento.preventDefault();
  /*
    Por defecto, al enviar un formulario HTML, el navegador recarga
    la página (o navega a otra URL). preventDefault() cancela ese
    comportamiento por defecto, dándonos control total en JavaScript
    para decidir qué hacer con los datos (en este caso, solo vamos a
    validar y mostrar un mensaje, sin conectar a un servidor todavía).
  */

  // Validamos cada campo por separado, y guardamos si TODOS son válidos
  const nombreValido = validarCampo('nombre', function (valor) {
    return valor.trim().length >= 2;
    // .trim() quita espacios en blanco al inicio/final, para que
    // alguien no pueda "hacer trampa" escribiendo solo espacios
  }, 'Escribe tu nombre completo.');

  const correoValido = validarCampo('correo', function (valor) {
    // Expresión regular simple para verificar formato de correo:
    // algo@algo.algo
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patronCorreo.test(valor);
  }, 'Ingresa un correo electrónico válido.');

  const mensajeValido = validarCampo('mensaje', function (valor) {
    return valor.trim().length >= 10;
  }, 'Cuéntanos un poco más (mínimo 10 caracteres).');

  // Solo si los 3 campos son válidos, mostramos la confirmación
  if (nombreValido && correoValido && mensajeValido) {
    mensajeConfirmacion.textContent = '¡Gracias! Tu mensaje fue enviado. Te contactaremos pronto.';
    formulario.reset();
    // formulario.reset() limpia todos los campos, dejándolos vacíos
    // de nuevo, como si el usuario nunca hubiera escrito nada.
  } else {
    mensajeConfirmacion.textContent = '';
  }
});

/*
  Función reutilizable para validar un solo campo.
  Recibe:
  - nombreCampo: el valor de data-error-de (ej: 'nombre', 'correo')
  - funcionValidadora: una función que recibe el valor escrito y
    devuelve true (válido) o false (inválido)
  - textoError: el mensaje a mostrar si es inválido

  Crear una función reutilizable evita repetir la misma lógica 3
  veces (una por campo) — esto es el principio "no te repitas" (DRY)
  que ya mencionamos al hablar de variables CSS, ahora aplicado a JS.
*/
function validarCampo(nombreCampo, funcionValidadora, textoError) {
  const campo = document.querySelector('#' + nombreCampo);
  const contenedorCampo = campo.closest('.campo-formulario');
  const spanError = document.querySelector('[data-error-de="' + nombreCampo + '"]');

  const esValido = funcionValidadora(campo.value);

  if (esValido) {
    contenedorCampo.classList.remove('con-error');
    spanError.textContent = '';
  } else {
    contenedorCampo.classList.add('con-error');
    spanError.textContent = textoError;
  }

  return esValido;
}


/* ============================================
   4. CARRITO DE COMPRAS
   ============================================
   NOTA IMPORTANTE: los precios de los productos
   están en $0 como PLACEHOLDER (ver data-precio
   en cada botón "Agregar al carrito" en el HTML).
   No se ha inventado ningún precio real del
   negocio — cuando existan precios definidos,
   solo hay que actualizar esos data-precio.
*/

// ---- ESTADO ----
// Este array es la "fuente de la verdad" del carrito: en todo momento,
// lo que el usuario ve en pantalla es simplemente un reflejo de lo
// que hay guardado aquí. Cada producto agregado es un objeto con
// nombre, precio y cantidad.
let carrito = [];

// ---- SELECCIÓN DE ELEMENTOS DEL DOM ----
const botonesAgregar = document.querySelectorAll('.boton-agregar-carrito');
const botonCarrito = document.querySelector('.boton-carrito');
const carritoContador = document.querySelector('.carrito-contador');
const carritoPanel = document.querySelector('.carrito-panel');
const carritoOverlay = document.querySelector('.carrito-overlay');
const carritoCerrar = document.querySelector('.carrito-cerrar');
const carritoLista = document.querySelector('.carrito-lista');
const carritoVacioMensaje = document.querySelector('.carrito-vacio');
const carritoTotalValor = document.querySelector('.carrito-total-valor');
const carritoCheckout = document.querySelector('.carrito-checkout');

// ---- AGREGAR UN PRODUCTO AL CARRITO ----
botonesAgregar.forEach(function (boton) {
  boton.addEventListener('click', function () {

    // Leemos los data-attributes del botón que se hizo clic
    const nombre = boton.dataset.nombre;
    const precio = Number(boton.dataset.precio);
    /*
      boton.dataset.precio siempre llega como TEXTO (ej: "0"), aunque
      en el HTML se vea como un número. Number() lo convierte a un
      valor numérico real, necesario para poder sumarlo después.
    */

    // .find() busca en el array un elemento que cumpla una condición,
    // y devuelve ese elemento (o undefined si no existe ninguno).
    // Lo usamos para saber si este producto YA está en el carrito.
    const itemExistente = carrito.find(function (item) {
      return item.nombre === nombre;
    });

    if (itemExistente) {
      // Si ya existía, solo aumentamos su cantidad
      itemExistente.cantidad = itemExistente.cantidad + 1;
    } else {
      // Si no existía, lo agregamos como un nuevo objeto al array
      carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }

    renderizarCarrito();

    // Pequeña confirmación visual: el botón cambia de color un instante
    boton.classList.add('agregado');
    boton.textContent = 'Agregado ✓';
    setTimeout(function () {
      boton.classList.remove('agregado');
      boton.textContent = 'Agregar al carrito';
    }, 900);
    /*
      setTimeout ejecuta una función después de un tiempo determinado
      (aquí, 900 milisegundos = 0.9 segundos), sin bloquear el resto
      del código mientras tanto. Es la forma estándar en JavaScript
      de decir "haz esto, pero un poco más tarde".
    */
  });
});

// ---- RENDERIZAR EL CARRITO (dibujar el HTML según el estado) ----
function renderizarCarrito() {

  // 1. Actualizamos el contador (badge) del ícono del carrito.
  // .reduce() recorre el array y lo "reduce" a un solo valor —aquí,
  // la suma total de todas las cantidades.
  const totalProductos = carrito.reduce(function (acumulado, item) {
    return acumulado + item.cantidad;
  }, 0);
  // el "0" al final es el valor inicial del acumulado, antes de
  // empezar a sumar

  carritoContador.textContent = totalProductos;
  carritoContador.classList.toggle('oculto', totalProductos === 0);
  /*
    classList.toggle acepta un segundo parámetro opcional (una
    condición true/false) que fuerza el resultado: si la condición es
    true, AGREGA la clase; si es false, la QUITA. Es una forma más
    corta de escribir el if/else que usamos en el header con sombra.
  */

  // 2. Vaciamos la lista actual del carrito para volver a dibujarla
  // desde cero, según el estado actual (el patrón "estado → renderizar"
  // que explicamos antes de empezar).
  carritoLista.innerHTML = '';

  carritoVacioMensaje.style.display = carrito.length === 0 ? 'block' : 'none';

  // 3. Por cada producto en el carrito, creamos su bloque HTML
  carrito.forEach(function (item, indice) {

    const subtotal = item.precio * item.cantidad;

    // Creamos el contenedor de este producto
    const elementoItem = document.createElement('div');
    elementoItem.className = 'carrito-item';

    // template literals (comillas invertidas ``) nos permiten escribir
    // HTML como texto e insertar variables directamente con ${variable},
    // en vez de concatenar strings con el operador "+" (mucho más
    // legible para bloques de HTML como este)
    elementoItem.innerHTML = `
      <div class="carrito-item-info">
        <h5>${item.nombre}</h5>
        <p class="carrito-item-precio">$${subtotal} · ${item.cantidad} unidad(es)</p>
      </div>
      <div class="carrito-item-controles">
        <button class="carrito-restar" data-indice="${indice}">−</button>
        <button class="carrito-sumar" data-indice="${indice}">+</button>
        <button class="carrito-item-eliminar" data-indice="${indice}">🗑</button>
      </div>
    `;

    carritoLista.appendChild(elementoItem);
    /*
      appendChild agrega el elemento que creamos como "hijo" del
      contenedor .carrito-lista, insertándolo visualmente en la página.
    */
  });

  // 4. Calculamos y mostramos el total general del carrito
  const totalGeneral = carrito.reduce(function (acumulado, item) {
    return acumulado + (item.precio * item.cantidad);
  }, 0);
  carritoTotalValor.textContent = '$' + totalGeneral;

  // 5. Conectamos los botones +/- y eliminar que ACABAMOS de crear.
  // Es importante hacerlo aquí (después de crearlos), porque son
  // elementos nuevos que no existían cuando la página cargó.
  conectarBotonesDeCantidad();

  // 6. Armamos el mensaje de WhatsApp con el resumen del pedido
  actualizarLinkDeWhatsApp(totalGeneral);
}

// ---- BOTONES +/- Y ELIMINAR DE CADA PRODUCTO EN EL CARRITO ----
function conectarBotonesDeCantidad() {

  document.querySelectorAll('.carrito-sumar').forEach(function (boton) {
    boton.addEventListener('click', function () {
      const indice = Number(boton.dataset.indice);
      carrito[indice].cantidad = carrito[indice].cantidad + 1;
      renderizarCarrito();
    });
  });

  document.querySelectorAll('.carrito-restar').forEach(function (boton) {
    boton.addEventListener('click', function () {
      const indice = Number(boton.dataset.indice);
      carrito[indice].cantidad = carrito[indice].cantidad - 1;

      // Si la cantidad llega a 0, eliminamos el producto por completo
      // del carrito en vez de dejarlo con cantidad 0
      if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
        /*
          .splice(indice, 1) elimina 1 elemento del array en la
          posición "indice". Es el método estándar de JavaScript para
          quitar un elemento de un array por su posición.
        */
      }
      renderizarCarrito();
    });
  });

  document.querySelectorAll('.carrito-item-eliminar').forEach(function (boton) {
    boton.addEventListener('click', function () {
      const indice = Number(boton.dataset.indice);
      carrito.splice(indice, 1);
      renderizarCarrito();
    });
  });
}

// ---- ARMAR EL MENSAJE DE WHATSAPP CON EL RESUMEN DEL PEDIDO ----
function actualizarLinkDeWhatsApp(totalGeneral) {

  if (carrito.length === 0) {
    carritoCheckout.href = '[LINK WHATSAPP]';
    return;
  }

  let textoMensaje = 'Hola, quisiera hacer este pedido:%0A%0A';
  // %0A es el código de "salto de línea" dentro de una URL — un
  // salto de línea normal (\n) no funciona directamente en un enlace

  carrito.forEach(function (item) {
    textoMensaje += '• ' + item.nombre + ' x' + item.cantidad + '%0A';
  });

  textoMensaje += '%0ATotal estimado: $' + totalGeneral;
  textoMensaje += '%0A%0A(Precios por confirmar con el parador)';

  carritoCheckout.href = '[LINK WHATSAPP]' + '?text=' + textoMensaje;
  /*
    Los enlaces de WhatsApp aceptan un parámetro "?text=" con un
    mensaje precargado, para que la persona no tenga que escribir
    su pedido desde cero — solo confirmar y enviar.
  */
}

// ---- ABRIR Y CERRAR EL PANEL DEL CARRITO ----
function abrirCarrito() {
  carritoPanel.classList.add('abierto');
  carritoOverlay.classList.add('activo');
}

function cerrarCarrito() {
  carritoPanel.classList.remove('abierto');
  carritoOverlay.classList.remove('activo');
}

botonCarrito.addEventListener('click', abrirCarrito);
carritoCerrar.addEventListener('click', cerrarCarrito);
carritoOverlay.addEventListener('click', cerrarCarrito);
// Hacemos que el overlay también cierre el carrito al hacer clic,
// ya que cubre toda la pantalla fuera del panel — un patrón de UX
// muy común ("clic afuera para cerrar")

// Renderizamos una vez al cargar la página, para que el carrito
// arranque en su estado vacío correcto (contador oculto, mensaje
// de "carrito vacío" visible)
renderizarCarrito();
