import React, { useState } from 'react';
import { Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap';
import PanelLayout from './PanelLayout';
import useApiData from '../../hooks/useApiData';
import { useProducts } from '../../hooks/ProductContext';
import { categoriasApi } from '../../services/barberia.api';
import { getErrorMessage } from '../../services/api';

/** CRUD de categorías (solo ADMIN): /api/v1/categorias. */
const CategoriasPanel = () => {
    const { data: categorias, loading, error, setError, reload } = useApiData(categoriasApi.listar);
    const { loadProducts } = useProducts();
    const [form, setForm] = useState(null);
    const [formError, setFormError] = useState('');

    const guardar = async (e) => {
        e.preventDefault();
        setFormError('');
        const body = { nombre: form.nombre, descripcion: form.descripcion, esServicio: form.esServicio };
        try {
            if (form.id) await categoriasApi.actualizar(form.id, body);
            else await categoriasApi.crear(body);
            setForm(null);
            reload();
            loadProducts();
        } catch (err) {
            setFormError(getErrorMessage(err));
        }
    };

    const eliminar = async (c) => {
        if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
        try {
            await categoriasApi.eliminar(c.id);
            reload();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <PanelLayout
            titulo="🏷️ Categorías"
            loading={loading}
            error={error}
            acciones={<Button variant="warning" className="fw-bold"
                onClick={() => { setFormError(''); setForm({ id: null, nombre: '', descripcion: '', esServicio: true }); }}>+ Nueva Categoría</Button>}
        >
            <Table responsive hover className="align-middle">
                <thead className="table-light">
                    <tr><th>Nombre</th><th>Descripción</th><th>Tipo</th><th className="text-center">Acciones</th></tr>
                </thead>
                <tbody>
                    {categorias.map((c) => (
                        <tr key={c.id}>
                            <td className="fw-bold">{c.nombre}</td>
                            <td className="small text-secondary">{c.descripcion || '-'}</td>
                            <td><Badge bg={c.esServicio ? 'info' : 'secondary'}>{c.esServicio ? 'Servicio (stock ilimitado)' : 'Producto físico'}</Badge></td>
                            <td className="text-center text-nowrap">
                                <Button variant="outline-primary" size="sm" className="me-2"
                                    onClick={() => { setFormError(''); setForm({ ...c, descripcion: c.descripcion ?? '' }); }}>Editar</Button>
                                <Button variant="outline-danger" size="sm" onClick={() => eliminar(c)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={!!form} onHide={() => setForm(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{form?.id ? 'Editar Categoría' : 'Nueva Categoría'}</Modal.Title>
                </Modal.Header>
                {form && (
                    <Form onSubmit={guardar}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="catNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control required maxLength={60} value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="catDescripcion">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control maxLength={255} value={form.descripcion}
                                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                            </Form.Group>
                            <Form.Check type="switch" id="catServicio" label="Es una categoría de servicios (stock ilimitado y requiere agendar)"
                                checked={form.esServicio} onChange={(e) => setForm({ ...form, esServicio: e.target.checked })} />
                            {formError && <Alert variant="danger" className="py-2 mt-3 mb-0">{formError}</Alert>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setForm(null)}>Cancelar</Button>
                            <Button variant="warning" type="submit" className="fw-bold text-dark">Guardar</Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>
        </PanelLayout>
    );
};

export default CategoriasPanel;
