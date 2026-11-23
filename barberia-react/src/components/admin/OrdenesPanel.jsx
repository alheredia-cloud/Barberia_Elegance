import React, { useState } from 'react';
import { Button, Table, Modal, Row, Col, Badge, Form } from 'react-bootstrap';
import PanelLayout from './PanelLayout';
import useApiData from '../../hooks/useApiData';
import { useProducts } from '../../hooks/ProductContext';
import { boletasApi } from '../../services/barberia.api';
import { getErrorMessage } from '../../services/api';
import { formatCLP, formatFecha } from '../../utils/formato';

/**
 * Órdenes (boletas): GET /api/v1/boletas y /boletas/{id}.
 * VENDEDOR: lista y detalle. ADMIN: además puede anular (repone stock) o eliminar.
 */
const OrdenesPanel = ({ soloLectura }) => {
    const { data: boletas, loading, error, setError, reload } = useApiData(boletasApi.listar);
    const { loadProducts } = useProducts();
    const [detalle, setDetalle] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const verDetalle = async (id) => {
        try {
            setDetalle(await boletasApi.obtener(id));
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const anular = async (b) => {
        if (!window.confirm(`¿Anular la boleta #${b.id}? El stock de los productos será repuesto.`)) return;
        try {
            const actualizada = await boletasApi.cambiarEstado(b.id, 'ANULADA');
            setDetalle(actualizada);
            reload();
            loadProducts();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const filtradas = boletas.filter((b) =>
        `${b.id} ${b.nombreCliente} ${b.emailUsuario}`.toLowerCase().includes(busqueda.toLowerCase()));

    return (
        <PanelLayout titulo="🧾 Órdenes de Compra" loading={loading} error={error}
            acciones={<Button variant="outline-dark" size="sm" onClick={reload}>Actualizar</Button>}>
            <Form.Control className="mb-3" placeholder="Buscar por N°, cliente o correo..." value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)} />
            <Table responsive hover className="align-middle">
                <thead className="table-light">
                    <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Ítems</th><th>Total</th><th>Estado</th><th className="text-center">Acciones</th></tr>
                </thead>
                <tbody>
                    {filtradas.length ? filtradas.map((b) => (
                        <tr key={b.id}>
                            <td className="fw-bold">#{b.id}</td>
                            <td className="small">{formatFecha(b.fecha)}</td>
                            <td>
                                <div className="fw-bold">{b.nombreCliente}</div>
                                <div className="small text-secondary">{b.emailUsuario}</div>
                            </td>
                            <td>{b.detalles.reduce((acc, d) => acc + d.cantidad, 0)}</td>
                            <td className="fw-bold">{formatCLP(b.total)}</td>
                            <td><Badge bg={b.estado === 'PAGADA' ? 'success' : 'secondary'}>{b.estado}</Badge></td>
                            <td className="text-center">
                                <Button variant="outline-dark" size="sm" onClick={() => verDetalle(b.id)}>Ver detalle</Button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="7" className="text-center py-4 text-muted">No hay órdenes registradas.</td></tr>
                    )}
                </tbody>
            </Table>

            <Modal show={!!detalle} onHide={() => setDetalle(null)} centered size="lg">
                <Modal.Header closeButton><Modal.Title className="fw-bold">Boleta #{detalle?.id}</Modal.Title></Modal.Header>
                {detalle && (
                    <Modal.Body>
                        <Row className="mb-3 small gy-1">
                            <Col md={6}><span className="text-muted">Cliente:</span> <b>{detalle.nombreCliente}</b></Col>
                            <Col md={6}><span className="text-muted">RUT:</span> {detalle.rutCliente || '-'}</Col>
                            <Col md={6}><span className="text-muted">Cuenta:</span> {detalle.emailUsuario}</Col>
                            <Col md={6}><span className="text-muted">Fecha:</span> {formatFecha(detalle.fecha)}</Col>
                            <Col md={6}><span className="text-muted">Dirección:</span> {detalle.direccion || '-'}</Col>
                            <Col md={6}><span className="text-muted">Pago:</span> <span className="text-capitalize">{detalle.metodoPago}</span></Col>
                            <Col md={6}><span className="text-muted">Estado:</span> <Badge bg={detalle.estado === 'PAGADA' ? 'success' : 'secondary'}>{detalle.estado}</Badge></Col>
                        </Row>
                        <Table size="sm" bordered>
                            <thead className="table-light"><tr><th>Producto</th><th>Cant.</th><th>P. unitario</th><th>Subtotal</th></tr></thead>
                            <tbody>
                                {detalle.detalles.map((d) => (
                                    <tr key={d.id}>
                                        <td>{d.producto} {d.esServicio && <Badge bg="info" text="dark">servicio</Badge>}</td>
                                        <td>{d.cantidad}</td>
                                        <td>{formatCLP(d.precioUnitario)}</td>
                                        <td className="fw-bold">{formatCLP(d.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot><tr><td colSpan="3" className="text-end fw-bold">Total</td><td className="fw-bold">{formatCLP(detalle.total)}</td></tr></tfoot>
                        </Table>
                    </Modal.Body>
                )}
                <Modal.Footer>
                    {!soloLectura && detalle?.estado === 'PAGADA' && (
                        <Button variant="outline-danger" onClick={() => anular(detalle)}>Anular boleta</Button>
                    )}
                    <Button variant="secondary" onClick={() => setDetalle(null)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </PanelLayout>
    );
};

export default OrdenesPanel;
