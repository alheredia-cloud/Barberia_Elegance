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
            imagen: '/imagenes/Tendencias barba 2026.png',
            url: 'https://www.vogue.mx/articulo/mejores-cortes-de-cabello-de-hombres-en-2026',
            fecha: '15 Oct, 2026'
        },
        {
            id: 2,
            titulo: 'El Arte del Afeitado Clásico',
            resumen: 'Por qué la navaja libre sigue siendo la mejor opción para un acabado perfecto.',
            imagen: '/imagenes/El arte del afeitado clasico.jpg',
            url: 'https://www.blogmodahombre.com/por-que-el-afeitado-clasico-esta-de-vuelta-y-como-dominarlo/',
            fecha: '10 Oct, 2026'
        },
        {
            id: 3,
            titulo: 'Cuidado del Cabello Masculino',
            resumen: 'Consejos prácticos para elegir el producto adecuado según tu tipo de cabello.',
            imagen: '/imagenes/Cuidado del Cabello Masculino.jpg',
            url: 'https://www.lorealparis.cl/cuidado-facial-hombres/cuidado-de-la-barba?gad_source=1&gad_campaignid=17309641844&gbraid=0AAAAACrVon-PIelLyfmbDYuf12qsvJ0HE&gclid=Cj0KCQjw5P7UBhDaARIsAOSlS1NU9nFrmQhc_QObRzZSJWV4-zXuqfFiNpOuAMgx_xFzi5pZi_DPpzIaApiCEALw_wcB',
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
                                        onClick={() => window.open(post.url, '_blank')}
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
