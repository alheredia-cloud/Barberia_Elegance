import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <Card className="h-100 border-0 shadow-sm card-producto transition-all">
            <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2 fw-bold">
                {product.categoria}
            </Badge>

            <Link to={`/producto/${product.id}`} className="text-decoration-none">
                <Card.Img
                    variant="top"
                    src={product.imagen || 'https://via.placeholder.com/300x200?text=Servicio+Barberia'}
                    className="product-img"
                />
            </Link>

            <Card.Body className="text-center d-flex flex-column">
                <Link to={`/producto/${product.id}`} className="text-decoration-none text-dark">
                    <Card.Title className="fw-bold fs-5 mb-2">{product.nombre}</Card.Title>
                </Link>

                <Card.Text className="text-secondary mb-3">
                    {product.descripcion || 'Servicio profesional de alta calidad para tu estilo.'}
                </Card.Text>

                <div className="mt-auto">
                    <h4 className="text-dark fw-bold mb-3">${product.precio}</h4>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-dark"
                            className="flex-grow-1 fw-bold py-2"
                            onClick={() => window.location.href = `/producto/${product.id}`}
                        >
                            Detalle
                        </Button>
                        <Button
                            variant="dark"
                            className="flex-grow-1 fw-bold py-2 border-warning border-2"
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0 ? 'Agotado' : 'Agregar'}
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
