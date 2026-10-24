import React from 'react';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { useCart } from '../hooks/CartContext';

const AppNavbar = () => {
    const { cart } = useCart();

    // LEER DIRECTAMENTE DEL STORAGE - LA VERDAD ABSOLUTA
    const user = localStorage.getItem('sesion_activa');
    const role = localStorage.getItem('rol_activa');

    const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

    // Función de cierre de sesión RADICAL e INDEPENDIENTE
    const handleLogout = () => {
        localStorage.removeItem('sesion_activa');
        localStorage.removeItem('rol_activa');
        window.location.reload(); // Forzar reinicio total de la app
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="py-3 shadow">
            <Container>
                <Navbar.Brand href="/" className="fw-bold fs-3 text-uppercase d-flex align-items-center">
                    <img
                        src="/imagenes/logo barberia.png"
                        alt="Logo Elegance"
                        style={{ height: '60px', width: 'auto', marginRight: '15px' }}
                    />
                    Barbería <span className="text-warning ms-1">Elegance</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link href="/" className="px-3">Inicio</Nav.Link>
                        <Nav.Link href="/servicios" className="px-3">Servicios</Nav.Link>
                        <Nav.Link href="/nosotros" className="px-3">Nosotros</Nav.Link>
                        <Nav.Link href="/blog" className="px-3">Blog</Nav.Link>

                        <Nav.Link href="/carrito" className="px-3 position-relative">
                            🛒 Carrito
                            {cartCount > 0 && (
                                <Badge pill bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle">
                                    {cartCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        {user ? (
                            <>
                                {role === 'Administrator' && (
                                    <Nav.Link href="/admin" className="px-3 text-info fw-bold">Panel Admin</Nav.Link>
                                )}
                                <Button
                                    variant="outline-light"
                                    onClick={handleLogout}
                                    className="ms-lg-3 px-4 py-2 fw-bold"
                                >
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="warning"
                                onClick={() => window.location.href = '/login'}
                                className="ms-lg-3 px-4 py-2 fw-bold text-dark"
                            >
                                Iniciar Sesión
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
