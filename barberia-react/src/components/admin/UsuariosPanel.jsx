import React, { useState } from 'react';
import { Button, Table, Modal, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import PanelLayout from './PanelLayout';
import useApiData from '../../hooks/useApiData';
import { useAuth } from '../../hooks/AuthContext';
import { usuariosApi } from '../../services/barberia.api';
import { getErrorMessage } from '../../services/api';
import { NOMBRE_ROL, normalizarRut, rutValido } from '../../utils/formato';

const COLOR_ROL = { ADMIN: 'danger', VENDEDOR: 'primary', CLIENTE: 'secondary' };
const VACIO = { id: null, nombre: '', rut: '', email: '', password: '', rol: 'CLIENTE', activo: true };

/** Administración de usuarios y roles (solo ADMIN): /api/v1/usuarios. */
const UsuariosPanel = () => {
    const { user } = useAuth();
    const { data: usuarios, loading, error, setError, reload } = useApiData(usuariosApi.listar);
    const [busqueda, setBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState('TODOS');
    const [form, setForm] = useState(null);
    const [formError, setFormError] = useState('');

    const filtrados = usuarios.filter((u) => {
        const texto = `${u.nombre} ${u.email} ${u.rut}`.toLowerCase();
        return texto.includes(busqueda.toLowerCase()) && (filtroRol === 'TODOS' || u.rol === filtroRol);
    });

    const guardar = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!rutValido(form.rut)) {
            setFormError('El RUT ingresado no es válido');
            return;
        }
        const body = { ...form, rut: normalizarRut(form.rut), password: form.password || null };
        try {
            if (form.id) await usuariosApi.actualizar(form.id, body);
            else await usuariosApi.crear(body);
            setForm(null);
            reload();
        } catch (err) {
            setFormError(getErrorMessage(err));
        }
    };

    const eliminar = async (u) => {
        if (!window.confirm(`¿Eliminar al usuario ${u.email}?`)) return;
        try {
            await usuariosApi.eliminar(u.id);
            reload();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <PanelLayout titulo="👥 Gestión de Usuarios" loading={loading} error={error}
            acciones={<Button variant="warning" className="fw-bold"
                onClick={() => { setFormError(''); setForm({ ...VACIO }); }}>+ Nuevo Usuario</Button>}>
            <Row className="g-3 mb-4">
                <Col md={8}>
                    <Form.Control placeholder="Buscar por nombre, email o RUT..." value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)} />
                </Col>
                <Col md={4}>
                    <Form.Select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
                        <option value="TODOS">Todos los Roles</option>
                        {Object.entries(NOMBRE_ROL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </Form.Select>
                </Col>
            </Row>

            <Table responsive hover className="align-middle">
                <thead className="table-light">
                    <tr><th>Nombre</th><th>Email</th><th>RUT</th><th>Rol</th><th>Estado</th><th className="text-center">Acciones</th></tr>
                </thead>
                <tbody>
                    {filtrados.length ? filtrados.map((u) => (
                        <tr key={u.id}>
                            <td className="fw-bold">{u.nombre}</td>
                            <td className="small">{u.email}</td>
                            <td className="text-nowrap small">{u.rut}</td>
                            <td><Badge bg={COLOR_ROL[u.rol]}>{NOMBRE_ROL[u.rol]}</Badge></td>
                            <td><Badge bg={u.activo ? 'success' : 'dark'}>{u.activo ? 'Activo' : 'Deshabilitado'}</Badge></td>
                            <td className="text-center text-nowrap">
                                <Button variant="outline-primary" size="sm" className="me-1"
                                    onClick={() => { setFormError(''); setForm({ ...u, password: '' }); }}>Editar</Button>
                                <Button variant="outline-danger" size="sm" disabled={u.email === user.email}
                                    onClick={() => eliminar(u)}>Eliminar</Button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="6" className="text-center py-4 text-muted">No se encontraron usuarios.</td></tr>
                    )}
                </tbody>
            </Table>

            <Modal show={!!form} onHide={() => setForm(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{form?.id ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
                </Modal.Header>
                {form && (
                    <Form onSubmit={guardar}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="usrNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control required maxLength={100} value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="usrRut">
                                        <Form.Label>RUT</Form.Label>
                                        <Form.Control required placeholder="12345678-5" value={form.rut}
                                            onChange={(e) => setForm({ ...form, rut: e.target.value })} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="usrRol">
                                        <Form.Label>Rol de Acceso</Form.Label>
                                        <Form.Select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                                            {Object.entries(NOMBRE_ROL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="usrEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" required value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="usrPassword">
                                <Form.Label>Contraseña {form.id && <small className="text-muted">(dejar vacía para mantener la actual)</small>}</Form.Label>
                                <Form.Control type="password" required={!form.id} minLength={6} value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            </Form.Group>
                            <Form.Check type="switch" id="usrActivo" label="Cuenta activa" checked={form.activo}
                                onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
                            {formError && <Alert variant="danger" className="py-2 mt-3 mb-0">{formError}</Alert>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setForm(null)}>Cancelar</Button>
                            <Button variant="warning" type="submit" className="fw-bold text-dark">Guardar Cambios</Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>
        </PanelLayout>
    );
};

export default UsuariosPanel;
