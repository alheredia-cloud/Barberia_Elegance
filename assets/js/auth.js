/*
   AUTH.JS
   Lógica para el Registro y Login de Usuarios
*/

// Función para manejar el registro
function manejarRegistro(evento) {
    evento.preventDefault(); // Evita que la página se recargue

    var nombre = document.getElementById("nombre").value;
    var correo = document.getElementById("correo").value;
    var password = document.getElementById("password").value;

    // Usamos las funciones de validations.js
    if (!validarCorreo(correo)) {
        alert("Error: El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
        return;
    }

    if (!validarPassword(password)) {
        alert("Error: La contraseña debe tener entre 4 y 10 caracteres");
        return;
    }

    // Si todo está bien, guardamos el usuario en localStorage para simular una base de datos
    var usuario = {
        nombre: nombre,
        correo: correo,
        password: password,
        rol: "Client" // Por defecto es cliente
    };

    localStorage.setItem("usuario_" + correo, JSON.stringify(usuario));
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    window.location.href = "login.html";
}

// Función para manejar el login
function manejarLogin(evento) {
    evento.preventDefault();

    var correo = document.getElementById("correo").value;
    var password = document.getElementById("password").value;

    // Buscamos al usuario en el localStorage
    var datosUsuario = localStorage.getItem("usuario_" + correo);

    if (datosUsuario) {
        var usuario = JSON.parse(datosUsuario);
        if (usuario.password === password) {
            // Guardamos la sesión activa
            localStorage.setItem("sesion_activa", usuario.correo);
            localStorage.setItem("rol_activa", usuario.rol);

            alert("Bienvenido " + usuario.nombre);
            window.location.href = "index.html";
        } else {
            alert("Error: Contraseña incorrecta");
        }
    } else {
        alert("Error: El usuario no existe");
    }
}

// Asignar los eventos cuando cargue la página
window.onload = function() {
    var formReg = document.getElementById("formRegistro");
    if (formReg) {
        formReg.onsubmit = manejarRegistro;
    }

    var formLog = document.getElementById("formLogin");
    if (formLog) {
        formLog.onsubmit = manejarLogin;
    }
};
