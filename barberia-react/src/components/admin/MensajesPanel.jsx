import React, { useState } from 'react';
import { Button, Table, Modal, Row, Col, Badge } from 'react-bootstrap';
import PanelLayout from './PanelLayout';
import useApiData from '../../hooks/useApiData';
import { mensajesApi } from '../../services/barberia.api';
import { getErrorMessage } from '../../services/api';
import { formatFecha } from '../../utils/formato';

/** Bandeja de mensajes de contacto (solo ADMIN): /api/v1/mensajes. */
const MensajesPanel = () => {
    const { data: mensajes, loading, error, setError, setData } = useApiData(mensajesApi.listar);
    const [seleccionado, setSeleccionado] = useState(null);

    const abrir = async (m) => {
        setSeleccionado(m);
        if (!m.leido) {
            try {
                const actualizado = await mensajesApi.marcarLeido(m.id, true);
                setData((lista) => lista.map((x) => (x.id === m.id ? actualizado : x)));
            } catch {
                /* no bloquea la lectura */
            }
        }
    };

    const eliminar = async (m) => {
        if (!window.confirm('¿Eliminar este mensaje?')) return;
        try {
            await mensajesApi.eliminar(m.id);
            setData((lista) => lista.filter((x) => x.id !== m.id));
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const vaciar = async () => {
        if (!window.confirm('¿Vaciar todos los mensajes?')) return;
        try {
            await mensajesApi.vaciar();
            setData([]);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <PanelLayout titulo="✉️ Bandeja de Mensajes" loading={loading} error={error}
            acciones={<Button variant="outline-danger" size="sm" onClick={vaciar} disabled={!mensajes.length}>Vaciar Bandeja</Button>}>
            <Table responsive hover className="align-middle">
                <thead className="table-light">
                    <tr><th>Fecha</th><th>Remitente</th><th>Mensaje</th><th>Estado</th><th className="text-center">Acciones</th></tr>
                </thead>
                <tbody>
                    {mensajes.length ? mensajes.map((m) => (
                        <tr key={m.id} className={m.leido ? '' : 'fw-semibold'}>
                            <td className="small text-muted">{formatFecha(m.fecha)}</td>
                            <td>
                                <div className="fw-bold">{m.nombre}</div>
                                <div className="small text-secondary">{m.email}</div>
                            </td>
                            <td>
                                <button type="button" className="btn btn-link p-0 text-truncate d-block" style={{ maxWidth: 220 }}
                                    onClick={() => abrir(m)}>{m.mensaje}</button>
                            </td>
                            <td><Badge bg={m.leido ? 'secondary' : 'danger'}>{m.leido ? 'Leído' : 'Nuevo'}</Badge></td>
                            <td className="text-center">
                                <Button variant="outline-danger" size="sm" onClick={() => eliminar(m)}>Eliminar</Button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" className="text-center py-4 text-muted">No hay mensajes pendientes.</td></tr>
                    )}
                </tbody>
            </Table>

            <Modal show={!!seleccionado} onHide={() => setSeleccionado(null)} centered size="lg">
                <Modal.Header closeButton><Modal.Title className="fw-bold">Detalle del Mensaje</Modal.Title></Modal.Header>
                {seleccionado && (
                    <Modal.Body className="p-4">
                        <Row className="mb-4">
                            <Col md={6}>
                                <small className="text-muted d-block">Remitente:</small>
                                <div className="fw-bold fs-5">{seleccionado.nombre}</div>
                                <div className="text-secondary">{seleccionado.email}</div>
                            </Col>
                            <Col md={6} className="text-md-end">
                                <small className="text-muted d-block">Fecha de Envío:</small>
                                <div className="fw-bold">{formatFecha(seleccionado.fecha)}</div>
                            </Col>
                        </Row>
                        <div className="p-4 bg-light rounded border" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: 150 }}>
                            {seleccionado.mensaje}
                        </div>
                    </Modal.Body>
                )}
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSeleccionado(null)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </PanelLayout>
    );
};

export default MensajesPanel;
