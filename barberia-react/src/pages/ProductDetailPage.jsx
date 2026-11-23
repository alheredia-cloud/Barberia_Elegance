import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/CartContext';
import { useAuth } from '../hooks/AuthContext';
import { productosApi } from '../services/barberia.api';
import { normalizarProducto } from '../hooks/ProductContext';
import { formatCLP } from '../utils/formato';

/** Detalle de producto: GET /api/v1/productos/{id} (datos siempre actualizados desde el backend). */
const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { hasRole } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        productosApi.obtener(id)
            .then((p) => setProduct(normalizarProducto(p)))
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <Container className="py-5 text-center"><Spinner animation="border" variant="warning" /></Container>;
    }

    if (!product) {
        return (
            <Container className="py-5 text-center">
                <h2 className="fw-bold">Producto no encontrado</h2>
                <Button variant="dark" className="mt-3" onClick={() => navigate('/servicios')}>
                    Volver a Servicios
                </Button>
            </Container>
        );
    }

    const agotado = product.stock === 0;
    const esPersonal = hasRole('ADMIN', 'VENDEDOR');

    return (
        <Container className="py-5">
            <Button variant="link" className="text-dark text-decoration-none mb-4 p-0" onClick={() => navigate(-1)}>
                ← Volver
            </Button>

            <Row className="gy-5">
                <Col md={6} className="text-center">
                    <Card className="border-0 shadow-lg overflow-hidden">
                        <Card.Img
                            src={product.imagen}
                            alt={product.nombre}
                            className="img-fluid"
                            style={{ maxHeight: '500px', objectFit: 'cover' }}
                        />
                    </Card>
                </Col>
                <Col md={6}>
                    <div className="ps-md-4">
                        <Badge bg="warning" text="dark" className="mb-2 px-3 py-2 fw-bold">
                            {product.categoria}
                        </Badge>
                        <h1 className="display-4 fw-bold mb-3">{product.nombre}</h1>
                        <h2 className="text-dark fw-bold mb-4">{formatCLP(product.precio)}</h2>

                        <p className="lead text-secondary mb-4" style={{ fontSize: '1.2rem' }}>
                            {product.descripcion || 'Servicio profesional de alta calidad realizado por expertos barberos.'}
                        </p>

                        <div className="mb-4">
                            {product.esServicio ? (
                                <span className="badge bg-info text-dark fs-6 p-2">Servicio · requiere agendar hora</span>
                            ) : (
                                <span className={`badge ${agotado ? 'bg-danger' : 'bg-success'} fs-6 p-2`}>
                                    {agotado ? 'Agotado' : `En Stock: ${product.stock} disponibles`}
                                </span>
                            )}
                        </div>

                        {!esPersonal && (
                            <div className="d-grid gap-3">
                                <Button
                                    variant="dark"
                                    size="lg"
                                    className="fw-bold py-3 border-warning border-2 shadow"
                                    onClick={() => addToCart(product)}
                                    disabled={agotado}
                                >
                                    {agotado ? 'No disponible' : 'Agregar al Carrito'}
                                </Button>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetailPage;
