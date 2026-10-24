import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import storageService from '../services/storage.service';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.email || !formData.mensaje) {
            setStatus({ type: 'danger', message: 'Por favor, completa todos los campos.' });
            return;
        }

        // MIGRACIÓN VANILLA: Guardar mensaje en el localStorage vía storageService
        storageService.guardarMensaje(formData);

        setStatus({ type: 'success', message: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.' });
        setFormData({ nombre: '', email: '', mensaje: '' });
    };

    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold text-uppercase">Contacto <span className="text-warning">Con Nosotros</span></h2>
                <div className="bg-warning mx-auto" style={{ height: '3px', width: '60px' }}></div>
            </div>

            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="border-0 shadow-lg p-4">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control
                                    name="nombre"
                                    type="text"
                                    placeholder="Tu nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control
                                    name="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Mensaje</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="mensaje"
                                    placeholder="Escribe tu mensaje aquí..."
                                    value={formData.mensaje}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            {status.message && (
                                <Alert variant={status.type} className="py-2 small text-center">
                                    {status.message}
                                </Alert>
                            )}
                            <Button variant="dark" type="submit" className="w-100 fw-bold py-2 border-warning border-2">
                                Enviar Mensaje
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactPage;
