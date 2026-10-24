import React, { useState } from 'react';
import { Container, Table, Button, Card, Row, Col } from 'react-bootstrap';
import { useCart } from '../hooks/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <Container className="py-5 text-center">
                <div className="py-5">
                    <h2 className="display-5 fw-bold mb-4">Tu carrito está <span className="text-warning">vacío</span></h2>
                    <p className="text-secondary mb-5">Parece que aún no has seleccionado ningún servicio de barbería.</p>
                    <Button variant="dark" className="px-5 py-3 fw-bold border-warning border-2" onClick={() => navigate('/servicios')}>
                        Explorar Servicios
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="fw-bold text-uppercase mb-5 text-center">Tu <span className="text-warning">Pedido</span></h2>
            <Row className="gy-4">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm p-3">
                        <Table responsive hover className="align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Servicio</th>
                                    <th className="text-center">Cantidad</th>
                                    <th className="text-center">Precio</th>
                                    <th className="text-center">Subtotal</th>
                                    <th className="text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(item => (
                                    <tr key={item.id}>
                                        <td className="fw-bold">{item.nombre}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                <Button variant="outline-dark" size="sm" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                                                <span className="fw-bold">{item.cantidad}</span>
                                                <Button variant="outline-dark" size="sm" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                                            </div>
                                        </td>
                                        <td className="text-center">${item.precio}</td>
                                        <td className="text-center fw-bold">${(item.precio * item.cantidad).toFixed(2)}</td>
                                        <td className="text-center">
                                            <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>🗑️</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm p-4 bg-dark text-light">
                        <h4 className="fw-bold mb-4 text-warning text-uppercase">Resumen de Compra</h4>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Subtotal:</span>
                            <span className="fw-bold">${getTotal().toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Costo de Envío/Tasa:</span>
                            <span className="text-success fw-bold">Gratis</span>
                        </div>
                        <hr className="bg-secondary" />
                        <div className="d-flex justify-content-between mb-4">
                            <h5 className="fw-bold">Total:</h5>
                            <h5 className="fw-bold text-warning">${getTotal().toFixed(2)}</h5>
                        </div>
                        <div className="d-grid gap-2">
                            <Button variant="warning" className="fw-bold py-3 text-dark" onClick={() => navigate('/checkout')}>
                                Confirmar Pedido
                            </Button>
                            <Button variant="outline-light" className="py-2" onClick={clearCart}>
                                Vaciar Carrito
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;
