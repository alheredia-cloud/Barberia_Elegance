import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AppFooter = () => {
    return (
        <footer className="bg-dark text-light py-5 mt-5 border-top border-warning border-4">
            <Container>
                <Row className="gy-4">
                    <Col md={4}>
                        <h4 className="text-warning fw-bold mb-4 text-uppercase">Barbería Elegance</h4>
                        <p className="text-secondary">
                            Más que un corte, una experiencia de estilo y distinción.
                            Expertos en tendencias clásicas y modernas.
                        </p>
                    </Col>
                    <Col md={4} className="ps-md-5">
                        <h5 className="text-warning mb-4">Enlaces Rápidos</h5>
                        <ul className="list-unstyled text-secondary">
                            <li><a href="/" className="text-decoration-none text-secondary hover-link">Inicio</a></li>
                            <li><a href="/servicios" className="text-decoration-none text-secondary hover-link">Nuestros Servicios</a></li>
                            <li><a href="/nosotros" className="text-decoration-none text-secondary hover-link">Quiénes Somos</a></li>
                            <li><a href="/contacto" className="text-decoration-none text-secondary hover-link">Contacto</a></li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5 className="text-warning mb-4">Ubicación</h5>
                        <p className="text-secondary">
                            Calle Elegance 123, Ciudad de la Moda<br />
                            Tel: +56 9 1234 5678<br />
                            Email: contacto@elegance.cl
                        </p>
                        <div className="mt-3">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.2!2d-70.6!3d-33.4!2m3!1f0!2f0!3f0!3m2!1i1020!2i860!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzNbS2VlbSAtIFB1ZW50byBTYXBl!5e0!3m2!1sen!2ssa!4v1600000000000"
                                width="100%"
                                height="150"
                                style={{ border: 0, borderRadius: '10px' }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </Col>
                </Row>
                <div className="text-center mt-5 pt-4 border-top border-secondary">
                    <small className="text-secondary">
                        © {new Date().getFullYear()} Barbería Elegance. Todos los derechos reservados.
                    </small>
                </div>
            </Container>
        </footer>
    );
};

export default AppFooter;
