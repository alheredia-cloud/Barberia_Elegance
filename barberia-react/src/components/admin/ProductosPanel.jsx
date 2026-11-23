import React, { useState } from 'react';
import { Button, Table, Modal, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import PanelLayout from './PanelLayout';
import useApiData from '../../hooks/useApiData';
import { useProducts } from '../../hooks/ProductContext';
import { categoriasApi, productosApi } from '../../services/barberia.api';
import { getErrorMessage } from '../../services/api';
import { formatCLP } from '../../utils/formato';

const VACIO = { id: null, nombre: '', descripcion: '', precio: '', stock: '', imagen: '', categoriaId: '' };

/**
 * Productos y servicios.
 * ADMIN: CRUD completo (POST/PUT/DELETE /productos). VENDEDOR (soloLectura): lista y detalle.
 */
const ProductosPanel = ({ soloLectura }) => {
    const { data: productos, loading, error, reload } = useApiData(() => productosApi.listar());
    const { data: categorias } = useApiData(categoriasApi.listar);
    const { loadProducts } = useProducts();
    const [form, setForm] = useState(null);
    const [detalle, setDetalle] = useState(null);
    const [formError, setFormError] = useState('');
    const [guardando, setGuardando] = useState(false);

    const categoriaSel = categorias.find((c) => String(c.id) === String(form?.categoriaId));
    const esServicio = categoriaSel?.esServicio ?? false;

    const abrir = (p) => {
        setFormError('');
        setForm(p ? { ...p, stock: p.stock ?? '', descripcion: p.descripcion ?? '', imagen: p.imagen ?? '' }
            : { ...VACIO, categoriaId: categorias[0]?.id ?? '' });
    };

    const guardar = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setFormError('');
        const body = {
            nombre: form.nombre,
            descripcion: form.descripcion,
            precio: Number(form.precio),
            stock: esServicio ? null : Number(form.stock),
            imagen: form.imagen,
            categoriaId: Number(form.categoriaId),
        };
        try {
            if (form.id) await productosApi.actualizar(form.id, body);
            else await productosApi.crear(body);
            setForm(null);
            reload();
            loadProducts(); // sincroniza la tienda
        } catch (err) {
            setFormError(getErrorMessage(err));
        } finally {
            setGuardando(false);
        }
    };

    const eliminar = async (p) => {
        if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return;
        try {
            await productosApi.eliminar(p.id);
            reload();
            loadProducts();
        } catch (err) {
            alert(getErrorMessage(err));
        }
    };

    return (
        <PanelLayout
            titulo="📦 Productos y Servicios"
            loading={loading}
            error={error}
            acciones={!soloLectura && (
                <Button variant="warning" className="fw-bold" onClick={() => abrir(null)}>+ Agregar Nuevo</Button>
            )}
        >
            {soloLectura && <Alert variant="info" className="py-2 small">Vista de solo lectura para el rol Vendedor.</Alert>}
            <Table responsive hover className="align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((p) => (
                        <tr key={p.id}>
                            <td><img src={p.imagen} alt={p.nombre} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 5 }} /></td>
                            <td className="fw-bold">{p.nombre}</td>
                            <td><Badge bg={p.esServicio ? 'info' : 'secondary'}>{p.categoria}</Badge></td>
                            <td>{formatCLP(p.precio)}</td>
                            <td>{p.ilimitado ? 'Ilimitado' : (
                                <span className={p.stock === 0 ? 'text-danger fw-bold' : ''}>{p.stock}</span>
                            )}</td>
                            <td className="text-center text-nowrap">
                                <Button variant="outline-dark" size="sm" className="me-2" onClick={() => setDetalle(p)}>Ver</Button>
                                {!soloLectura && (
                                    <>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => abrir(p)}>Editar</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => eliminar(p)}>Eliminar</Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Detalle */}
            <Modal show={!!detalle} onHide={() => setDetalle(null)} centered>
                <Modal.Header closeButton><Modal.Title className="fw-bold">{detalle?.nombre}</Modal.Title></Modal.Header>
                {detalle && (
                    <Modal.Body>
                        <img src={detalle.imagen} alt={detalle.nombre} className="img-fluid rounded mb-3" />
                        <p className="text-secondary">{detalle.descripcion || 'Sin descripción'}</p>
                        <Row className="small gy-1">
                            <Col xs={5} className="text-muted">ID</Col><Col xs={7}>{detalle.id}</Col>
                            <Col xs={5} className="text-muted">Categoría</Col><Col xs={7}>{detalle.categoria}</Col>
                            <Col xs={5} className="text-muted">Tipo</Col><Col xs={7}>{detalle.esServicio ? 'Servicio' : 'Producto físico'}</Col>
                            <Col xs={5} className="text-muted">Precio</Col><Col xs={7}>{formatCLP(detalle.precio)}</Col>
                            <Col xs={5} className="text-muted">Stock</Col><Col xs={7}>{detalle.ilimitado ? 'Ilimitado' : detalle.stock}</Col>
                        </Row>
                    </Modal.Body>
                )}
            </Modal>

            {/* Crear / editar (solo ADMIN) */}
            <Modal show={!!form} onHide={() => setForm(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{form?.id ? 'Editar Producto' : 'Agregar Nuevo Producto'}</Modal.Title>
                </Modal.Header>
                {form && (
                    <Form onSubmit={guardar}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="prodNombre">
                                <Form.Label>Nombre del Servicio/Producto</Form.Label>
                                <Form.Control required maxLength={100} value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="prodCategoria">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Select required value={form.categoriaId}
                                    onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}>
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}{c.esServicio ? ' (servicio)' : ''}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="prodPrecio">
                                        <Form.Label>Precio (CLP)</Form.Label>
                                        <Form.Control type="number" min={0} required value={form.precio}
                                            onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="prodStock">
                                        <Form.Label>Stock</Form.Label>
                                        <Form.Control
                                            type={esServicio ? 'text' : 'number'}
                                            min={0}
                                            required={!esServicio}
                                            disabled={esServicio}
                                            value={esServicio ? 'Ilimitado' : form.stock}
                                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="prodDescripcion">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control as="textarea" rows={2} maxLength={500} value={form.descripcion}
                                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="prodImagen">
                                <Form.Label>URL de la Imagen</Form.Label>
                                <Form.Control placeholder="/imagenes/nombre-archivo.jpg" value={form.imagen}
                                    onChange={(e) => setForm({ ...form, imagen: e.target.value })} />
                            </Form.Group>
                            {formError && <Alert variant="danger" className="py-2 mb-0">{formError}</Alert>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setForm(null)}>Cancelar</Button>
                            <Button variant="warning" type="submit" disabled={guardando} className="fw-bold text-dark">
                                {guardando ? 'Guardando...' : form.id ? 'Actualizar Producto' : 'Guardar Producto'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>
        </PanelLayout>
    );
};

export default ProductosPanel;
