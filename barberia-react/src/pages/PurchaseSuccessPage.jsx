import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { boletasApi } from '../services/barberia.api';
import { formatCLP, formatFecha } from '../utils/formato';
import { ULTIMA_BOLETA_KEY } from './CheckoutPage';

/** Comprobante: muestra la boleta registrada en el backend (GET /api/v1/boletas/{id}). */
const PurchaseSuccessPage = () => {
    const navigate = useNavigate();
    const [recibo, setRecibo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = sessionStorage.getItem(ULTIMA_BOLETA_KEY);
        if (!id) {
            setLoading(false);
            return;
        }
        boletasApi.obtener(id)
            .then(setRecibo)
            .catch(() => setRecibo(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Container className="py-5 text-center"><Spinner animation="border" variant="warning" /></Container>;
    }

    if (!recibo) {
        return (
            <Container className="py-5 text-center">
                <h2 className="fw-bold">No se encontró un recibo reciente</h2>
                <Button variant="dark" className="mt-3" onClick={() => navigate('/')}>Volver al Inicio</Button>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="border-0 shadow-lg overflow-hidden">
                        <div className="bg-dark text-warning text-center py-4 border-bottom border-warning border-4">
                            <h2 className="fw-bold text-uppercase mb-0">Comprobante de Pago</h2>
                            <small className="text-light">Barbería Elegance - Estilo y Distinción</small>
                        </div>
                        <Card.Body className="p-4 bg-light">
                            <div className="text-center mb-4">
                                <div className="display-4 text-success mb-2">✓</div>
                                <h4 className="fw-bold">¡Compra Exitosa!</h4>
                                <p className="text-secondary small">Gracias por confiar en nosotros</p>
                            </div>

                            <div className="mb-4 p-3 bg-white rounded-3 border shadow-sm">
                                <Row className="gy-2">
                                    <Col xs={6} className="text-secondary small">Cliente:</Col>
                                    <Col xs={6} className="text-end fw-bold">{recibo.nombreCliente}</Col>
                                    <Col xs={6} className="text-secondary small">Fecha:</Col>
                                    <Col xs={6} className="text-end fw-bold">{formatFecha(recibo.fecha)}</Col>
                                    <Col xs={6} className="text-secondary small">N° Boleta:</Col>
                                    <Col xs={6} className="text-end fw-bold">#{recibo.id}</Col>
                                    <Col xs={6} className="text-secondary small">Método de pago:</Col>
                                    <Col xs={6} className="text-end fw-bold text-capitalize">{recibo.metodoPago}</Col>
                                </Row>
                            </div>

                            <h6 className="fw-bold text-uppercase mb-3">Detalle:</h6>
                            <div className="mb-4">
                                {recibo.detalles.map((item) => (
                                    <div key={item.id} className="d-flex justify-content-between mb-2 border-bottom pb-1 small">
                                        <span>{item.producto} x{item.cantidad}</span>
                                        <span className="fw-bold">{formatCLP(item.subtotal)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-between align-items-center p-3 bg-dark text-light rounded-3 shadow">
                                <h5 className="mb-0 fw-bold text-warning">TOTAL PAGADO:</h5>
                                <h4 className="mb-0 fw-bold text-warning">{formatCLP(recibo.total)}</h4>
                            </div>

                            <div className="text-center mt-5">
                                <Button variant="outline-dark" className="w-100 fw-bold py-2" onClick={() => window.print()}>
                                    Imprimir Recibo 🖨️
                                </Button>
                                <Button variant="dark" className="w-100 fw-bold py-2 mt-3 border-warning border-2" onClick={() => navigate('/mis-compras')}>
                                    Ver mis compras
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PurchaseSuccessPage;
