import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/** Se muestra cuando un usuario autenticado intenta entrar a una sección que su rol no permite. */
const NoAutorizadoPage = () => (
    <Container className="py-5 text-center">
        <div className="display-1 mb-3">🔒</div>
        <h2 className="fw-bold">Acceso <span className="text-warning">restringido</span></h2>
        <p className="text-secondary mb-4">Tu cuenta no tiene permisos para ver esta sección.</p>
        <Button as={Link} to="/" variant="dark" className="px-5 fw-bold border-warning border-2">
            Volver al inicio
        </Button>
    </Container>
);

export default NoAutorizadoPage;
