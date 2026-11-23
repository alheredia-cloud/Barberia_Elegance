import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/CartContext';
import { useAuth } from '../hooks/AuthContext';
import { useProducts } from '../hooks/ProductContext';
import { boletasApi } from '../services/barberia.api';
import { getErrorMessage } from '../services/api';
import { formatCLP, normalizarRut, rutValido } from '../utils/formato';

export const ULTIMA_BOLETA_KEY = 'ultima_boleta_id';

/**
 * Checkout: envía POST /api/v1/boletas solo con productoId y cantidad.
 * El backend valida stock, toma los precios desde la BD, calcula el total y descuenta stock.
 */
const CheckoutPage = () => {
    const { cart, getTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { loadProducts } = useProducts();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombreCliente: user?.nombre || '',
        rutCliente: user?.rut || '',
        direccion: '',
        metodoPago: 'transferencia',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

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
        setError('');
        if (formData.rutCliente && !rutValido(formData.rutCliente)) {
            setError('El RUT ingresado no es válido');
            return;
        }
        setIsProcessing(true);
        try {
            const boleta = await boletasApi.crear({
                ...formData,
                rutCliente: formData.rutCliente ? normalizarRut(formData.rutCliente) : null,
                items: cart.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
            });
            sessionStorage.setItem(ULTIMA_BOLETA_KEY, String(boleta.id));
            clearCart();
            loadProducts(); // refresca el stock mostrado en la tienda
            navigate(boleta.requiereCita ? '/agendar' : '/compra-exitosa');
        } catch (err) {
            setError(getErrorMessage(err, 'No se pudo procesar el pago'));
        } finally {
            setIsProcessing(false);
        }
    };

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
                                    <Form.Group controlId="nombreCliente">
                                        <Form.Label>Nombre Completo</Form.Label>
                                        <Form.Control
                                            name="nombreCliente"
                                            type="text"
                                            placeholder="Ej: Juan Pérez"
                                            required
                                            value={formData.nombreCliente}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="rutCliente">
                                        <Form.Label>RUT</Form.Label>
                                        <Form.Control
                                            name="rutCliente"
                                            type="text"
                                            placeholder="12345678-9"
                                            required
                                            value={formData.rutCliente}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="emailCliente">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control type="email" value={user?.email || ''} readOnly disabled />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="direccion">
                                <Form.Label>Dirección / Referencia</Form.Label>
                                <Form.Control
                                    name="direccion"
                                    type="text"
                                    placeholder="Calle Falsa 123"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="metodoPago">
                                <Form.Label>Método de Pago</Form.Label>
                                <Form.Select name="metodoPago" value={formData.metodoPago} onChange={handleInputChange}>
                                    <option value="transferencia">Transferencia Bancaria</option>
                                    <option value="efectivo">Efectivo en Local</option>
                                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                                </Form.Select>
                            </Form.Group>
                            {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                            <div className="d-grid">
                                <Button variant="warning" type="submit" className="fw-bold py-3 text-dark" disabled={isProcessing}>
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
                            {cart.map((item) => (
                                <div key={item.id} className="d-flex justify-content-between mb-2">
                                    <span>{item.nombre} x{item.cantidad}</span>
                                    <span>{formatCLP(item.precio * item.cantidad)}</span>
                                </div>
                            ))}
                        </div>
                        <hr className="bg-secondary" />
                        <div className="d-flex justify-content-between mb-2">
                            <h5 className="fw-bold">Total a Pagar:</h5>
                            <h5 className="fw-bold text-warning">{formatCLP(getTotal())}</h5>
                        </div>
                        <small className="text-secondary">El total final lo confirma el servidor con los precios vigentes.</small>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;
