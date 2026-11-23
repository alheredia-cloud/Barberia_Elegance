import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/AuthContext';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../services/api';

const LoginPage = () => {
    const { login, user, isAuthenticated, sessionMessage } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    /** Personal interno va al panel; el cliente vuelve a la página que intentaba abrir. */
    const destino = (rol) =>
        rol === 'ADMIN' || rol === 'VENDEDOR' ? '/admin' : location.state?.from || '/';

    // Si ya hay sesión activa no tiene sentido mostrar el formulario
    if (isAuthenticated) {
        return <Navigate to={destino(user.rol)} replace />;
    }

    /** POST /api/v1/auth/login -> el backend valida la contraseña (BCrypt) y devuelve los JWT. */
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const usuario = await login(email.trim(), password);
            navigate(destino(usuario.rol), { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, 'Correo o contraseña incorrectos'));
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={5} lg={4}>
                    <Card className="border-0 shadow-lg p-4 text-center">
                        <div className="mb-4">
                            <h2 className="fw-bold text-uppercase">Iniciar <span className="text-warning">Sesión</span></h2>
                            <p className="text-secondary">Bienvenido de nuevo a Barbería Elegance</p>
                        </div>
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3 text-start">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="ejemplo@duoc.cl"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-4 text-start">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {!error && sessionMessage && <Alert variant="warning" className="py-2 small">{sessionMessage}</Alert>}
                            {!error && !sessionMessage && location.state?.from && (
                                <Alert variant="info" className="py-2 small">Inicia sesión para continuar.</Alert>
                            )}
                            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                            <Button variant="dark" type="submit" disabled={loading} className="w-100 fw-bold py-2 border-warning border-2">
                                {loading ? 'Verificando...' : 'Acceder'}
                            </Button>
                        </Form>
                        <div className="mt-4 text-secondary small">
                            ¿No tienes cuenta? <Link to="/registro" state={location.state} className="text-warning fw-bold text-decoration-none">Regístrate aquí</Link>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
