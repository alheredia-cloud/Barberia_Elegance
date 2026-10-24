import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import storageService from '../services/storage.service';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Lógica migrada de auth.js Vanilla
        const usuarios = storageService.obtener('usuarios') || [];
        const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

        if (usuarioEncontrado) {
            login(usuarioEncontrado.email, usuarioEncontrado.rol);
            if (usuarioEncontrado.rol === 'Administrator' || usuarioEncontrado.rol === 'Seller') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            setError('Correo o contraseña incorrectos');
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
                            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                            <Button variant="dark" type="submit" className="w-100 fw-bold py-2 border-warning border-2">
                                Acceder
                            </Button>
                        </Form>
                        <div className="mt-4 text-secondary small">
                            ¿No tienes cuenta? <a href="/registro" className="text-warning fw-bold text-decoration-none">Regístrate aquí</a>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
