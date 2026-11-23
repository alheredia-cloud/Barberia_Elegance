import React from 'react';
import { Navbar, Nav, Container, Badge, Button, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/CartContext';
import { useAuth } from '../hooks/AuthContext';
import { NOMBRE_ROL } from '../utils/formato';

/** Menú principal: las opciones visibles dependen del rol del usuario autenticado. */
const AppNavbar = () => {
    const { cart } = useCart();
    const { user, isAuthenticated, hasRole, logout } = useAuth();
    const navigate = useNavigate();

    const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const esPersonal = hasRole('ADMIN', 'VENDEDOR');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="py-3 shadow">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-uppercase d-flex align-items-center">
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
                        <Nav.Link as={NavLink} to="/" end className="px-3">Inicio</Nav.Link>
                        <Nav.Link as={NavLink} to="/servicios" className="px-3">Servicios</Nav.Link>
                        <Nav.Link as={NavLink} to="/nosotros" className="px-3">Nosotros</Nav.Link>
                        <Nav.Link as={NavLink} to="/blog" className="px-3">Blog</Nav.Link>
                        <Nav.Link as={NavLink} to="/contacto" className="px-3">Contacto</Nav.Link>

                        {/* El personal interno no compra: el carrito solo se muestra a clientes y visitantes */}
                        {!esPersonal && (
                            <Nav.Link as={NavLink} to="/carrito" className="px-3 position-relative">
                                🛒 Carrito
                                {cartCount > 0 && (
                                    <Badge pill bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle">
                                        {cartCount}
                                    </Badge>
                                )}
                            </Nav.Link>
                        )}

                        {hasRole('ADMIN') && (
                            <Nav.Link as={NavLink} to="/admin" className="px-3 text-info fw-bold">Panel Admin</Nav.Link>
                        )}
                        {hasRole('VENDEDOR') && (
                            <Nav.Link as={NavLink} to="/admin" className="px-3 text-info fw-bold">Panel Vendedor</Nav.Link>
                        )}

                        {isAuthenticated ? (
                            <NavDropdown
                                align="end"
                                className="ms-lg-3"
                                title={<span className="fw-bold text-warning">👤 {user.nombre.split(' ')[0]}</span>}
                                id="menu-usuario"
                            >
                                <NavDropdown.Header>
                                    {user.email}
                                    <div className="small">{NOMBRE_ROL[user.rol]}</div>
                                </NavDropdown.Header>
                                {hasRole('CLIENTE') && (
                                    <NavDropdown.Item as={Link} to="/mis-compras">Mis compras y citas</NavDropdown.Item>
                                )}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Button
                                variant="warning"
                                as={Link}
                                to="/login"
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
