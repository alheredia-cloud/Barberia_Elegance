import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/ProductContext';

const ServicesPage = () => {
    const { products } = useProducts();
    const [filter, setFilter] = useState('Todos');

    // Ya no necesitamos el useEffect que cargaba productos del storageService,
    // ya que el ProductContext se encarga de ello globalmente.

    const filteredProducts = filter === 'Todos'
        ? products
        : products.filter(p => p.categoria === filter);

    // Extraer categorías únicas dinámicamente
    const categories = ['Todos', ...new Set(products.map(p => p.categoria))];

    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold text-uppercase">Nuestros <span className="text-warning">Servicios</span></h2>
                <div className="bg-warning mx-auto" style={{ height: '3px', width: '60px' }}></div>
            </div>

            {/* Filtros de Categoría */}
            <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
                {categories.map(cat => (
                    <Button
                        key={cat}
                        variant={filter === cat ? 'warning' : 'outline-dark'}
                        className={`fw-bold px-4 py-2 rounded-pill ${filter === cat ? 'text-dark' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            <Row className="g-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <Col key={product.id} xs={12} sm={6} md={4}>
                            <ProductCard product={product} />
                        </Col>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <p className="text-secondary">No hay servicios disponibles en esta categoría.</p>
                    </div>
                )}
            </Row>
        </Container>
    );
};

export default ServicesPage;
