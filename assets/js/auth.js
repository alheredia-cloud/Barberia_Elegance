const authService = {
    verificarSesion() {
        const email = localStorage.getItem('sesion_activa');
        const rol = localStorage.getItem('rol_activa');
        return { email, rol };
    },
    iniciarSesion(correo, password) {
        const usuarios = storageService.obtener('usuarios') || [];
        const usuario = usuarios.find(u => u.email === correo && u.password === password);

        if (usuario) {
            storageService.setSesion(usuario.email, usuario.rol);
            alert('Inicio de sesión exitoso');

            if (usuario.rol === 'Administrator' || usuario.rol === 'Seller') {
                window.location.href = '../admin/index.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            alert('Correo o contraseña incorrectos');
        }
    },
    actualizarInterfaz() {
        const { email, rol } = this.verificarSesion();
        const btnLogin = document.getElementById('btn-login');
        const btnRegistro = document.getElementById('btn-registro');
        const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

        if (email && rol) {
            if (btnLogin) btnLogin.style.display = 'none';
            if (btnRegistro) btnRegistro.style.display = 'none';
            if (btnCerrarSesion) btnCerrarSesion.style.display = 'block';
        } else {
            if (btnLogin) btnLogin.style.display = 'inline-block';
            if (btnRegistro) btnRegistro.style.display = 'inline-block';
            if (btnCerrarSesion) btnCerrarSesion.style.display = 'none';
        }
    },
    cerrarSesion() {
        storageService.cerrarSesion();
        window.location.href = 'public/index.html';
    }
};