import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { getErrorMessage } from '../services/api';
import { normalizarRut, rutValido } from '../utils/formato';

/**
 * Registro de clientes: POST /api/v1/auth/register.
 * El rol NO se envía: el backend siempre crea la cuenta como CLIENTE.
 * Las validaciones del frontend mejoran la experiencia; el backend vuelve a validar todo.
 */
const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register } = useAuth();
    const [formData, setFormData] = useState({ nombre: '', rut: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validarCorreo = (email) => /(@duoc\.cl|@profesor\.duoc\.cl|@gmail\.com)$/.test(email);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!validarCorreo(formData.email)) {
            setError('El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return;
        }
        if (!rutValido(formData.rut)) {
            setError('El RUT ingresado no es válido (ej: 12345678-5)');
            return;
        }
        if (formData.password.length < 6 || formData.password.length > 50) {
            setError('La contraseña debe tener entre 6 y 50 caracteres');
            return;
        }

        setLoading(true);
        try {
            await register({
                nombre: formData.nombre.trim(),
                rut: normalizarRut(formData.rut),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });
            navigate(location.state?.from || '/', { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, 'No se pudo crear la cuenta'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="border-0 shadow-lg p-4">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-uppercase">Crear <span className="text-warning">Cuenta</span></h2>
                            <p className="text-secondary">Únete a la comunidad de Barbería Elegance</p>
                        </div>
                        <Form onSubmit={handleRegister}>
                            <Form.Group className="mb-3" controlId="nombre">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control name="nombre" type="text" placeholder="Juan Pérez" required
                                    maxLength={100} value={formData.nombre} onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="rut">
                                <Form.Label>RUT</Form.Label>
                                <Form.Control name="rut" type="text" placeholder="12345678-5" required
                                    value={formData.rut} onChange={handleInputChange} />
                                <Form.Text muted>Con o sin puntos y guion.</Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control name="email" type="email" placeholder="usuario@duoc.cl" required
                                    value={formData.email} onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="password">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control name="password" type="password" placeholder="Mínimo 6 caracteres" required
                                    value={formData.password} onChange={handleInputChange} />
                            </Form.Group>
                            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                            <Button variant="dark" type="submit" disabled={loading} className="w-100 fw-bold py-2 border-warning border-2">
                                {loading ? 'Creando cuenta...' : 'Registrarse'}
                            </Button>
                        </Form>
                        <div className="mt-4 text-center text-secondary small">
                            ¿Ya tienes cuenta? <Link to="/login" className="text-warning fw-bold text-decoration-none">Inicia sesión aquí</Link>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
