import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import storageService from '../services/storage.service';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        email: '',
        password: '',
        rol: 'Cliente'
    });
    const [error, setError] = useState('');

    // Reglas de Validación migradas de validations.js Vanilla
    const validarCorreo = (email) => {
        const regex = /(@duoc\.cl|@profesor\.duoc\.cl|@gmail\.com)$/;
        return regex.test(email);
    };

    const validarRUN = (rut) => {
        const regex = /^[0-9]{7,8}[0-9kK]{1}$/;
        return regex.test(rut);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        // Validaciones estrictas de la pauta/Vanilla
        if (!validarCorreo(formData.email)) {
            setError('El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return;
        }
        if (!validarRUN(formData.rut)) {
            setError('El RUT debe contener entre 7 y 9 dígitos numéricos (sin puntos ni guiones)');
            return;
        }
        if (formData.password.length < 4 || formData.password.length > 10) {
            setError('La contraseña debe tener entre 4 y 10 caracteres');
            return;
        }

        // Lógica de almacenamiento migrada
        const usuarios = storageService.obtener('usuarios') || [];

        if (usuarios.find(u => u.email === formData.email)) {
            setError('Este correo electrónico ya está registrado');
            return;
        }

        const nuevoUsuario = {
            email: formData.email,
            rut: formData.rut,
            rol: formData.rol,
            password: formData.password
        };

        usuarios.push(nuevoUsuario);
        storageService.guardar('usuarios', usuarios);

        alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
        navigate('/login');
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
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control
                                    name="nombre"
                                    type="text"
                                    placeholder="Juan Pérez"
                                    required
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Row>
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>RUT (Sin puntos ni guiones)</Form.Label>
                                        <Form.Control
                                            name="rut"
                                            type="text"
                                            placeholder="12345678"
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control
                                    name="email"
                                    type="email"
                                    placeholder="usuario@duoc.cl"
                                    required
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="********"
                                    required
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                            <Button variant="dark" type="submit" className="w-100 fw-bold py-2 border-warning border-2">
                                Registrarse
                            </Button>
                        </Form>
                        <div className="mt-4 text-center text-secondary small">
                            ¿Ya tienes cuenta? <a href="/login" className="text-warning fw-bold text-decoration-none">Inicia sesión aquí</a>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
