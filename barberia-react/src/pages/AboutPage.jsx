import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const AboutPage = () => {
    return (
        <Container className="py-5">
            <Row className="align-items-center gy-5">
                <Col md={6}>
                    <Image
                        src="/imagenes/sobre nosotros.jpe"
                        alt="Barbería Elegance Interior"
                        className="img-fluid rounded-4 shadow"
                    />
                </Col>
                <Col md={6} className="ps-md-5">
                    <h2 className="fw-bold text-uppercase mb-4">Sobre <span className="text-warning">Nosotros</span></h2>
                    <p className="lead text-secondary">
                        En Barbería Elegance, no solo cortamos el cabello; esculpimos la imagen del hombre moderno.
                        Nuestra pasión es rescatar la tradición de la barbería clásica fusionándola con las tendencias más actuales.
                    </p>
                    <p className="text-secondary">
                        Fundada con la visión de crear un espacio de relajación y estilo, nos hemos convertido en el referente de la ciudad
                        gracias a nuestro compromiso con la excelencia y el detalle. Cada cliente es tratado como un caballero,
                        recibiendo una atención personalizada que va más allá de un simple corte.
                    </p>
                    <div className="mt-4 d-flex gap-4">
                        <div className="text-center">
                            <h3 className="fw-bold text-warning mb-0">10+</h3>
                            <small className="text-secondary">Años de Experiencia</small>
                        </div>
                        <div className="text-center">
                            <h3 className="fw-bold text-warning mb-0">5k+</h3>
                            <small className="text-secondary">Clientes Felices</small>
                        </div>
                        <div className="text-center">
                            <h3 className="fw-bold text-warning mb-0">12</h3>
                            <small className="text-secondary">Barberos Expertos</small>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutPage;
