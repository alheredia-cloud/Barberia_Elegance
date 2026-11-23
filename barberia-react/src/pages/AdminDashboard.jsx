import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { NOMBRE_ROL } from '../utils/formato';
import ResumenPanel from '../components/admin/ResumenPanel';
import ProductosPanel from '../components/admin/ProductosPanel';
import CategoriasPanel from '../components/admin/CategoriasPanel';
import OrdenesPanel from '../components/admin/OrdenesPanel';
import AgendaPanel from '../components/admin/AgendaPanel';
import MensajesPanel from '../components/admin/MensajesPanel';
import UsuariosPanel from '../components/admin/UsuariosPanel';

/**
 * Secciones del panel y roles que pueden verlas.
 * ADMIN: acceso total. VENDEDOR: solo productos y órdenes (lectura); el resto ni siquiera se muestra.
 */
export const SECCIONES = [
    { id: 'dashboard', label: '🏠 Dashboard', roles: ['ADMIN'], Componente: ResumenPanel },
    { id: 'productos', label: '📦 Productos', roles: ['ADMIN', 'VENDEDOR'], Componente: ProductosPanel },
    { id: 'categorias', label: '🏷️ Categorías', roles: ['ADMIN'], Componente: CategoriasPanel },
    { id: 'ordenes', label: '🧾 Órdenes', roles: ['ADMIN', 'VENDEDOR'], Componente: OrdenesPanel },
    { id: 'agenda', label: '📅 Agenda', roles: ['ADMIN'], Componente: AgendaPanel },
    { id: 'mensajes', label: '✉️ Mensajes', roles: ['ADMIN'], Componente: MensajesPanel },
    { id: 'usuarios', label: '👥 Usuarios', roles: ['ADMIN'], Componente: UsuariosPanel },
];

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const visibles = SECCIONES.filter((s) => s.roles.includes(user.rol));
    const [activeTab, setActiveTab] = useState(visibles[0].id);
    const seccion = visibles.find((s) => s.id === activeTab) || visibles[0];
    const soloLectura = user.rol !== 'ADMIN';

    return (
        <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '90vh' }}>
            <Row>
                <Col md={4} lg={3} xl={2} className="mb-4">
                    <Card className="shadow-sm border-0 bg-dark text-white overflow-hidden">
                        <Card.Body className="p-0">
                            <div className="p-4 text-center bg-dark border-bottom border-secondary">
                                <h5 className="fw-bold text-uppercase mb-1">
                                    {user.rol === 'ADMIN' ? 'Admin' : 'Vendedor'} <span className="text-warning">Panel</span>
                                </h5>
                                <small className="text-secondary">{user.nombre} · {NOMBRE_ROL[user.rol]}</small>
                            </div>
                            <Nav className="flex-column p-2">
                                {visibles.map((s) => (
                                    <Nav.Link
                                        key={s.id}
                                        onClick={() => setActiveTab(s.id)}
                                        className={`py-3 px-3 mb-1 rounded transition-all ${seccion.id === s.id ? 'bg-warning text-dark fw-bold' : 'text-white'}`}
                                    >
                                        {s.label}
                                    </Nav.Link>
                                ))}
                            </Nav>
                            <div className="p-3 d-grid gap-2">
                                <Button variant="outline-light" className="py-2" onClick={() => navigate('/')}>
                                    Volver al Sitio
                                </Button>
                                <Button variant="outline-danger" className="py-2" onClick={() => { logout(); navigate('/login'); }}>
                                    Cerrar Sesión
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8} lg={9} xl={10}>
                    <seccion.Componente soloLectura={soloLectura} />
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
