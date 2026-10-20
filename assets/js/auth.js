const authService = {
    verificarSesion() {
        const email = localStorage.getItem('sesion_activa');
        const rol = localStorage.getItem('rol_activa');
        return { email, rol };
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
        localStorage.removeItem('sesion_activa');
        localStorage.removeItem('rol_activa');
        window.location.href = '/public/index.html';
    }
};
