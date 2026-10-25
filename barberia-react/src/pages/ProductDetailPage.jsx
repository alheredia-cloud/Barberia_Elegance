import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/CartContext';
import { useProducts } from '../hooks/ProductContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { products } = useProducts();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const foundProduct = products.find(p => p.id === parseInt(id));
        setProduct(foundProduct);
    }, [id, products]);

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

    return (
        <Container className="py-5">
            <Button
                variant="link"
                className="text-dark text-decoration-none mb-4 p-0"
                onClick={() => navigate('/servicios')}
            >
                ← Volver al catálogo
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
                        <h2 className="text-dark fw-bold mb-4">${product.precio}</h2>

                        <p className="lead text-secondary mb-4" style={{ fontSize: '1.2rem' }}>
                            {product.descripcion || 'Servicio profesional de alta calidad realizado por expertos barberos. Utilizamos las mejores técnicas y productos para asegurar un acabado impecable y elegante.'}
                        </p>

                        <div className="mb-4">
                            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'} fs-6 p-2`}>
                                {product.stock > 0 ? `En Stock: ${product.stock} disponibles` : 'Agotado'}
                            </span>
                        </div>

                        <div className="d-grid gap-3">
                            <Button
                                variant="dark"
                                size="lg"
                                className="fw-bold py-3 border-warning border-2 shadow"
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 0}
                            >
                                {product.stock === 0 ? 'No disponible' : 'Agregar al Carrito'}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetailPage;
