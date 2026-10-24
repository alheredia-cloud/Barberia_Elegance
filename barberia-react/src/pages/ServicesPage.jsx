import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import storageService from '../services/storage.service';

const ServicesPage = () => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('Todos');

    useEffect(() => {
        // FUERZA LA CARGA DE DATOS ACTUALIZADOS PARA ASEGURAR LAS IMÁGENES
        storageService.inicializarDatos();
        const allProducts = storageService.obtener('productos') || [];
        setProducts(allProducts);
    }, []);

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
