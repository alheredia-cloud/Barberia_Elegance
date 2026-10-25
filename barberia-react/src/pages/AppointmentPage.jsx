import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import storageService from '../services/storage.service';
import { useCart } from '../hooks/CartContext';

const AppointmentPage = () => {
    const { cart } = useCart();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState({
        fecha: '',
        hora: '',
        notas: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (e) => {
        setAppointment({ ...appointment, [e.target.name]: e.target.value });
    };

    const handleConfirmAppointment = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        setTimeout(() => {
            try {
                // 1. Guardar la cita en la agenda global del Admin
                const citasActuales = storageService.obtener('citas_agenda') || [];
                const nuevaCita = {
                    cliente: 'Cliente Reciente', // Se podría mejorar obteniendo el nombre del usuario activo
                    fecha: appointment.fecha,
                    hora: appointment.hora,
                    notas: appointment.notas,
                    servicios: servicesInCart.map(s => s.nombre)
                };
                // Intentamos obtener el nombre del cliente desde el recibo que acabamos de crear en Checkout
                const recibo = storageService.obtener('ultimo_recibo');
                if (recibo && recibo.cliente) {
                    nuevaCita.cliente = recibo.cliente;
                }

                citasActuales.push(nuevaCita);
                storageService.guardar('citas_agenda', citasActuales);

                // 2. Actualizar la cita en el recibo individual
                if (recibo) {
                    const reciboConCita = {
                        ...recibo,
                        cita: appointment
                    };
                    storageService.guardarSimple('ultimo_recibo', JSON.stringify(reciboConCita));
                }

                setIsProcessing(false);
                navigate('/compra-exitosa');
            } catch (error) {
                console.error("Error al guardar la cita:", error);
                setIsProcessing(false);
            }
        }, 1000);
    };

    // Filtrar solo los servicios que requieren cita (no son de la categoría 'Productos')
    // Usamos el recibo guardado en el storage ya que el carrito fue limpiado en el Checkout
    const recibo = storageService.obtener('ultimo_recibo') || {};
    const cartItems = recibo.productos || [];
    const servicesInCart = cartItems.filter(item => item.categoria !== 'Productos');

    if (servicesInCart.length === 0) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="warning">No hay servicios que requieran agendamiento en tu compra.</Alert>
                <Button variant="dark" onClick={() => navigate('/')}>Volver al Inicio</Button>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="border-0 shadow-lg p-4">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-uppercase">Agendar <span className="text-warning">Cita</span></h2>
                            <p className="text-secondary">Por favor, elige la fecha y hora para tus servicios</p>
                        </div>

                        <div className="mb-4 p-3 bg-light rounded border">
                            <h6 className="fw-bold mb-2">Servicios a agendar:</h6>
                            <ul className="small mb-0">
                                {servicesInCart.map(s => (
                                    <li key={s.id}>{s.nombre} (x{s.cantidad})</li>
                                ))}
                            </ul>
                        </div>

                        <Form onSubmit={handleConfirmAppointment}>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="fw-bold">Fecha</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="fecha"
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="fw-bold">Hora</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="hora"
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Notas Adicionales (Opcional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="notas"
                                    placeholder="Cualquier detalle adicional que debamos saber..."
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button
                                    variant="warning"
                                    type="submit"
                                    className="fw-bold py-3 text-dark"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Agendando...' : 'Confirmar Cita'}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AppointmentPage;
