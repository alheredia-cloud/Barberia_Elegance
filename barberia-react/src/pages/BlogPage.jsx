import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
    const navigate = useNavigate();

    // Datos de ejemplo para el blog, simulando la estructura de la web Vanilla
    const posts = [
        {
            id: 1,
            titulo: 'Tendencias de Barba 2026',
            resumen: 'Descubre los estilos que dominarán este año y cómo mantener tu barba impecable.',
            imagen: 'https://via.placeholder.com/400x250?text=Tendencias+2026',
            fecha: '15 Oct, 2026'
        },
        {
            id: 2,
            titulo: 'El Arte del Afeitado Clásico',
            resumen: 'Por qué la navaja libre sigue siendo la mejor opción para un acabado perfecto.',
            imagen: 'https://via.placeholder.com/400x250?text=Afeitado+Clasico',
            fecha: '10 Oct, 2026'
        },
        {
            id: 3,
            titulo: 'Cuidado del Cabello Masculino',
            resumen: 'Consejos prácticos para elegir el producto adecuado según tu tipo de cabello.',
            imagen: 'https://via.placeholder.com/400x250?text=Cuidado+Cabello',
            fecha: '05 Oct, 2026'
        }
    ];

    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold text-uppercase">Nuestro <span className="text-warning">Blog</span></h2>
                <div className="bg-warning mx-auto" style={{ height: '3px', width: '60px' }}></div>
                <p className="text-secondary mt-3">Consejos, tendencias y secretos del mundo de la barbería profesional.</p>
            </div>

            <Row className="g-4">
                {posts.map(post => (
                    <Col key={post.id} md={4}>
                        <Card className="h-100 border-0 shadow-sm transition-all overflow-hidden card-producto">
                            <Card.Img variant="top" src={post.imagen} />
                            <Card.Body className="d-flex flex-column">
                                <small className="text-muted mb-2">{post.fecha}</small>
                                <Card.Title className="fw-bold mb-3">{post.titulo}</Card.Title>
                                <Card.Text className="text-secondary mb-4">
                                    {post.resumen}
                                </Card.Text>
                                <div className="mt-auto">
                                    <Button
                                        variant="outline-dark"
                                        className="fw-bold py-2 w-100"
                                        onClick={() => alert('Próximamente: Detalle de la noticia')}
                                    >
                                        Leer más
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default BlogPage;
