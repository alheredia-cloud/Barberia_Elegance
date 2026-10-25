import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useCart } from '../hooks/CartContext';
import { useNavigate } from 'react-router-dom';
import storageService from '../services/storage.service';

const CheckoutPage = () => {
    const { cart, getTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        email: '',
        direccion: '',
        metodoPago: 'transferencia'
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    if (cart.length === 0) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="warning">Tu carrito está vacío. Por favor, agrega servicios antes de pagar.</Alert>
                <Button variant="dark" onClick={() => navigate('/servicios')}>Ir a Servicios</Button>
            </Container>
        );
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        setTimeout(() => {
            try {
                // Lógica CRÍTICA: Actualizar el stock de los productos comprados
                cart.forEach(item => {
                    storageService.actualizarStock(item.id, item.cantidad);
                });

                // Guardar el recibo de la compra
                const recibo = {
                    id: Date.now(),
                    cliente: formData.nombre,
                    fecha: new Date().toLocaleString(),
                    total: getTotal(),
                    productos: cart
                };
                storageService.guardarSimple('ultimo_recibo', JSON.stringify(recibo));

                // DETERMINAR DESTINO ANTES DE LIMPIAR EL CARRITO
                const tieneServicios = cart.some(item => item.categoria !== 'Productos');

                // Limpiar carrito y finalizar
                clearCart();
                setIsProcessing(false);

                if (tieneServicios) {
                    navigate('/agendar');
                } else {
                    navigate('/compra-exitosa');
                }
            } catch (error) {
                console.error("Error al procesar el pago:", error);
                setIsProcessing(false);
            }
        }, 1500);
    };

    if (success) {
        return (
            <Container className="py-5 text-center">
                <Card className="border-0 shadow-lg p-5 bg-light">
                    <div className="display-1 text-success mb-4">✅</div>
                    <h2 className="fw-bold mb-3">¡Pago Confirmado!</h2>
                    <p className="lead mb-4">Gracias por confiar en Barbería Elegance. Tu cita/pedido ha sido procesado correctamente.</p>
                    <Button variant="dark" className="px-5 py-3 fw-bold" onClick={() => navigate('/')}>
                        Volver al Inicio
                    </Button>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="fw-bold text-uppercase mb-5 text-center">Finalizar <span className="text-warning">Compra</span></h2>
            <Row className="gy-4">
                <Col lg={7}>
                    <Card className="border-0 shadow-sm p-4">
                        <h4 className="fw-bold mb-4">Datos de Facturación</h4>
                        <Form onSubmit={handlePayment}>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Nombre Completo</Form.Label>
                                        <Form.Control
                                            name="nombre"
                                            type="text"
                                            placeholder="Ej: Juan Pérez"
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>RUT</Form.Label>
                                        <Form.Control
                                            name="rut"
                                            type="text"
                                            placeholder="12345678-9"
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
                                    placeholder="correo@ejemplo.com"
                                    required
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Dirección / Referencia</Form.Label>
                                <Form.Control
                                    name="direccion"
                                    type="text"
                                    placeholder="Calle Falsa 123"
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Método de Pago</Form.Label>
                                <Form.Select name="metodoPago" onChange={handleInputChange}>
                                    <option value="transferencia">Transferencia Bancaria</option>
                                    <option value="efectivo">Efectivo en Local</option>
                                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                                </Form.Select>
                            </Form.Group>
                            <div className="d-grid">
                                <Button
                                    variant="warning"
                                    type="submit"
                                    className="fw-bold py-3 text-dark"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Procesando Pago...' : 'Confirmar y Pagar'}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
                <Col lg={5}>
                    <Card className="border-0 shadow-sm p-4 bg-dark text-light">
                        <h4 className="fw-bold mb-4 text-warning text-uppercase">Resumen Final</h4>
                        <div className="mb-4">
                            {cart.map(item => (
                                <div key={item.id} className="d-flex justify-content-between mb-2">
                                    <span>{item.nombre} x{item.cantidad}</span>
                                    <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <hr className="bg-secondary" />
                        <div className="d-flex justify-content-between mb-4">
                            <h5 className="fw-bold">Total a Pagar:</h5>
                            <h5 className="fw-bold text-warning">${getTotal().toFixed(2)}</h5>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;
