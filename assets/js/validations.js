/*
   VALIDACIONES.JS
   Este archivo contiene todas las reglas de validación
   que pide la pauta de la evaluación.
*/

// Función para validar el correo electrónico
function validarCorreo(correo) {
    // El PDF pide que termine en @duoc.cl, @profesor.duoc.cl o @gmail.com
    var regex = /(@duoc\.cl|@profesor\.duoc\.cl|@gmail\.com)$/;
    return regex.test(correo);
}

// Función para validar la contraseña (4 a 10 caracteres)
function validarPassword(password) {
    return password.length >= 4 && password.length <= 10;
}

// Función para validar el RUN (7 a 9 dígitos, sin puntos ni guiones)
function validarRUN(run) {
    // El PDF pide estrictamente que NO tenga puntos ni guiones
    var regex = /^[0-9]{7,9}$/;
    return regex.test(run);
}

// Función para validar el comentario de contacto (máx 500)
function validarComentario(texto) {
    return texto.length <= 500;
}

// Función para validar el nombre de contacto (máx 100)
function validarNombre(nombre) {
    return nombre.length <= 100;
}
