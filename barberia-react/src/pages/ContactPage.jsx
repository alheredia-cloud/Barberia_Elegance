import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { mensajesApi } from '../services/barberia.api';
import { getErrorMessage } from '../services/api';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [enviando, setEnviando] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.email || !formData.mensaje) {
            setStatus({ type: 'danger', message: 'Por favor, completa todos los campos.' });
            return;
        }

        // Validación de Email (Sello Duoc: @duoc.cl, @gmail.com, etc.)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|gmail\.com|outlook\.com|hotmail\.com|yahoo\.com)$/;
        if (!emailRegex.test(formData.email)) {
            setStatus({
                type: 'danger',
                message: 'Por favor, ingresa un correo electrónico válido (@duoc.cl, @gmail.com, @outlook.com, etc.).'
            });
            return;
        }

        // POST /api/v1/mensajes (endpoint público)
        setEnviando(true);
        try {
            await mensajesApi.enviar(formData);
            setStatus({ type: 'success', message: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.' });
            setFormData({ nombre: '', email: '', mensaje: '' });
        } catch (err) {
            setStatus({ type: 'danger', message: getErrorMessage(err, 'No se pudo enviar el mensaje') });
        } finally {
            setEnviando(false);
        }
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
                            <Button variant="dark" type="submit" disabled={enviando} className="w-100 fw-bold py-2 border-warning border-2">
                                {enviando ? 'Enviando...' : 'Enviar Mensaje'}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactPage;
