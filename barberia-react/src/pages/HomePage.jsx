import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import storageService from '../services/storage.service';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const allProducts = storageService.obtener('productos') || [];
        // Tomamos los primeros 3 como destacados
        setFeaturedProducts(allProducts.slice(0, 3));
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <header className="bg-dark text-light py-5 text-center shadow-lg" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/imagenes/baner.jpg?v=1")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <h1 className="display-3 fw-bold text-uppercase mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    El Arte del <span className="text-warning">Estilo Clásico</span>
                </h1>
                <p className="lead mb-4 px-3" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                    Expertos en cortes, barba y cuidado personal para el hombre moderno.
                </p>
                <Button variant="warning" size="lg" className="fw-bold px-5 py-3 text-dark shadow" href="/servicios">
                    Ver Servicios
                </Button>
            </header>

            {/* Featured Products Section */}
            <Container className="py-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-uppercase">Servicios <span className="text-warning">Destacados</span></h2>
                    <div className="bg-warning mx-auto" style={{ height: '3px', width: '60px' }}></div>
                </div>
                <Row className="g-4">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map(product => (
                            <Col key={product.id} xs={12} sm={6} md={4}>
                                <ProductCard product={product} />
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center">
                            <p>Cargando servicios destacados...</p>
                        </Col>
                    )}
                </Row>
            </Container>

            {/* Promo Section */}
            <div className="bg-light py-5 border-top border-bottom">
                <Container className="text-center">
                    <h3 className="fw-bold mb-4">¿Por qué elegir Barbería Elegance?</h3>
                    <Row className="g-4">
                        <Col md={4}>
                            <div className="p-4 shadow-sm bg-white rounded-3">
                                <div className="fs-1 mb-3">✂️</div>
                                <h5 className="fw-bold">Maestros Barberos</h5>
                                <p className="text-secondary">Técnicas avanzadas en corte y afeitado tradicional.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="p-4 shadow-sm bg-white rounded-3">
                                <div className="fs-1 mb-3">🌟</div>
                                <h5 className="fw-bold">Atención Premium</h5>
                                <p className="text-secondary">Un ambiente relajante diseñado para tu comodidad.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="p-4 shadow-sm bg-white rounded-3">
                                <div className="fs-1 mb-3">📅</div>
                                <h5 className="fw-bold">Citas Rápidas</h5>
                                <p className="text-//secondary">Gestión eficiente de tiempos para tu conveniencia.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default HomePage;
