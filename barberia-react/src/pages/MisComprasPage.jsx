import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { boletasApi, citasApi } from '../services/barberia.api';
import { getErrorMessage } from '../services/api';
import { formatCLP, formatFecha } from '../utils/formato';

/** Historial del cliente: GET /boletas/mis-boletas y GET /citas/mis-citas. */
const MisComprasPage = () => {
    const [boletas, setBoletas] = useState([]);
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([boletasApi.misBoletas(), citasApi.misCitas()])
            .then(([b, c]) => {
                setBoletas(b);
                setCitas(c);
            })
            .catch((e) => setError(getErrorMessage(e)))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Container className="py-5 text-center"><Spinner animation="border" variant="warning" /></Container>;
    }

    return (
        <Container className="py-5">
            <h2 className="fw-bold text-uppercase mb-4 text-center">Mis <span className="text-warning">Compras</span></h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row className="gy-4">
                <Col lg={7}>
                    <Card className="border-0 shadow-sm p-3">
                        <h5 className="fw-bold mb-3">Boletas</h5>
                        <Table responsive hover className="align-middle mb-0">
                            <thead className="table-dark">
                                <tr><th>N°</th><th>Fecha</th><th>Detalle</th><th>Total</th><th>Estado</th></tr>
                            </thead>
                            <tbody>
                                {boletas.length ? boletas.map((b) => (
                                    <tr key={b.id}>
                                        <td className="fw-bold">#{b.id}</td>
                                        <td className="small">{formatFecha(b.fecha)}</td>
                                        <td className="small">{b.detalles.map((d) => `${d.producto} x${d.cantidad}`).join(', ')}</td>
                                        <td className="fw-bold">{formatCLP(b.total)}</td>
                                        <td><Badge bg={b.estado === 'PAGADA' ? 'success' : 'secondary'}>{b.estado}</Badge></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="text-center text-muted py-4">Aún no tienes compras.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
                <Col lg={5}>
                    <Card className="border-0 shadow-sm p-3">
                        <h5 className="fw-bold mb-3">Citas agendadas</h5>
                        <Table responsive className="align-middle mb-0">
                            <thead className="table-dark">
                                <tr><th>Fecha</th><th>Hora</th><th>Servicios</th></tr>
                            </thead>
                            <tbody>
                                {citas.length ? citas.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.fecha}</td>
                                        <td>{c.hora?.slice(0, 5)}</td>
                                        <td className="small">{c.servicios.join(', ')}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="text-center text-muted py-4">No tienes citas.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MisComprasPage;
