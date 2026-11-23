import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { boletasApi, citasApi } from '../services/barberia.api';
import { getErrorMessage } from '../services/api';
import { ULTIMA_BOLETA_KEY } from './CheckoutPage';

/** Bloques de 30 minutos dentro del horario de atención (09:00 - 20:00). */
const BLOQUES = Array.from({ length: 22 }, (_, i) => {
    const min = 9 * 60 + i * 30;
    return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
});

const hoyISO = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
};

/**
 * Agendamiento: lee la boleta recién creada (GET /boletas/{id}), consulta las horas ocupadas
 * (GET /citas/disponibilidad) y registra la cita (POST /citas) asociada a la boleta.
 */
const AppointmentPage = () => {
    const navigate = useNavigate();
    const [boleta, setBoleta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState({ fecha: '', hora: '', notas: '' });
    const [ocupadas, setOcupadas] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const id = sessionStorage.getItem(ULTIMA_BOLETA_KEY);
        if (!id) {
            setLoading(false);
            return;
        }
        boletasApi.obtener(id)
            .then(setBoleta)
            .catch((e) => setError(getErrorMessage(e)))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!appointment.fecha) return;
        citasApi.disponibilidad(appointment.fecha)
            .then((horas) => setOcupadas(horas.map((h) => h.slice(0, 5))))
            .catch(() => setOcupadas([]));
    }, [appointment.fecha]);

    const servicios = useMemo(() => (boleta?.detalles || []).filter((d) => d.esServicio), [boleta]);

    const bloquesDisponibles = useMemo(() => {
        const ahora = new Date();
        const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
        return BLOQUES.filter((b) => !(appointment.fecha === hoyISO() && b <= horaActual));
    }, [appointment.fecha]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAppointment((a) => ({ ...a, [name]: value, ...(name === 'fecha' ? { hora: '' } : {}) }));
    };

    const handleConfirmAppointment = async (e) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);
        try {
            await citasApi.crear({
                nombreCliente: boleta.nombreCliente,
                fecha: appointment.fecha,
                hora: appointment.hora,
                notas: appointment.notas,
                servicios: servicios.map((s) => s.producto),
                boletaId: boleta.id,
            });
            navigate('/compra-exitosa');
        } catch (err) {
            setError(getErrorMessage(err, 'No se pudo agendar la cita'));
            if (err.response?.status === 409) {
                citasApi.disponibilidad(appointment.fecha).then((h) => setOcupadas(h.map((x) => x.slice(0, 5))));
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return <Container className="py-5 text-center"><Spinner animation="border" variant="warning" /></Container>;
    }

    if (servicios.length === 0) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="warning">{error || 'No hay servicios que requieran agendamiento en tu compra.'}</Alert>
                <Button variant="dark" onClick={() => navigate('/')}>Volver al Inicio</Button>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="border-0 shadow-lg p-4">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-uppercase">Agendar <span className="text-warning">Cita</span></h2>
                            <p className="text-secondary">Elige la fecha y hora para tus servicios (boleta #{boleta.id})</p>
                        </div>

                        <div className="mb-4 p-3 bg-light rounded border">
                            <h6 className="fw-bold mb-2">Servicios a agendar:</h6>
                            <ul className="small mb-0">
                                {servicios.map((s) => (
                                    <li key={s.id}>{s.producto} (x{s.cantidad})</li>
                                ))}
                            </ul>
                        </div>

                        <Form onSubmit={handleConfirmAppointment}>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="fecha">
                                        <Form.Label className="fw-bold">Fecha</Form.Label>
                                        <Form.Control type="date" name="fecha" min={hoyISO()} required
                                            value={appointment.fecha} onChange={handleInputChange} />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="hora">
                                        <Form.Label className="fw-bold">Hora</Form.Label>
                                        <Form.Select name="hora" required value={appointment.hora}
                                            onChange={handleInputChange} disabled={!appointment.fecha}>
                                            <option value="">{appointment.fecha ? 'Selecciona una hora' : 'Elige primero la fecha'}</option>
                                            {bloquesDisponibles.map((b) => (
                                                <option key={b} value={b} disabled={ocupadas.includes(b)}>
                                                    {b}{ocupadas.includes(b) ? ' (ocupada)' : ''}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4" controlId="notas">
                                <Form.Label className="fw-bold">Notas Adicionales (Opcional)</Form.Label>
                                <Form.Control as="textarea" rows={3} name="notas" maxLength={500}
                                    placeholder="Cualquier detalle adicional que debamos saber..."
                                    value={appointment.notas} onChange={handleInputChange} />
                            </Form.Group>

                            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                            <div className="d-grid">
                                <Button variant="warning" type="submit" className="fw-bold py-3 text-dark" disabled={isProcessing}>
                                    {isProcessing ? 'Agendando...' : 'Confirmar Cita'}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AppointmentPage;
