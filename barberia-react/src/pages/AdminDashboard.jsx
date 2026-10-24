import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Table, Modal, Form } from 'react-bootstrap';
import storageService from '../services/storage.service';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        income: 0,
        messages: 0
    });

    // ESTADOS PARA LOS DATOS
    const [products, setProducts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    // ESTADOS PARA MODALES
    const [showProductModal, setShowProductModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ id: null, nombre: '', precio: '', stock: '', categoria: 'Cortes', imagen: '' });
    const [showUserModal, setShowUserModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({ id: null, email: '', rut: '', rol: 'User' });
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        updateStats();
        if (activeTab === 'products') loadProducts();
        if (activeTab === 'messages') loadMessages();
        if (activeTab === 'users') loadUsers();
    }, [activeTab]);

    const updateStats = () => {
        const usersList = storageService.obtener('usuarios') || [];
        const productsList = storageService.obtener('productos') || [];
        const messagesList = storageService.obtener('mensajes') || [];
        const totalInventoryValue = productsList.reduce((acc, p) => acc + (p.precio * p.stock), 0);

        setStats({
            users: usersList.length,
            products: productsList.length,
            income: totalInventoryValue,
            messages: messagesList.length
        });
    };

    const loadProducts = () => setProducts(storageService.obtener('productos') || []);
    const loadMessages = () => setMessages(storageService.obtener('mensajes') || []);
    const loadUsers = () => setUsers(storageService.obtener('usuarios') || []);

    const handleOpenProductModal = (product = { id: null, nombre: '', precio: '', stock: '', categoria: 'Cortes', imagen: '' }) => {
        setCurrentProduct(product);
        setShowProductModal(true);
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();
        const updatedProducts = [...products];
        const productData = {
            ...currentProduct,
            precio: Number(currentProduct.precio),
            stock: Number(currentProduct.stock)
        };

        if (productData.id) {
            const index = updatedProducts.findIndex(p => p.id === productData.id);
            updatedProducts[index] = productData;
        } else {
            productData.id = Date.now();
            updatedProducts.push(productData);
        }

        storageService.guardar('productos', updatedProducts);
        setProducts(updatedProducts);
        setShowProductModal(false);
        updateStats();
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            const updatedProducts = products.filter(p => p.id !== id);
            storageService.guardar('productos', updatedProducts);
            setProducts(updatedProducts);
            updateStats();
        }
    };

    const handleDeleteMessage = (index) => {
        if (window.confirm('¿Eliminar este mensaje?')) {
            const updatedMessages = [...messages];
            updatedMessages.splice(index, 1);
            storageService.guardar('mensajes', updatedMessages);
            setMessages(updatedMessages);
            updateStats();
        }
    };

    const handleOpenUserModal = (user = { email: '', rut: '', rol: 'User' }) => {
        setCurrentUser(user);
        setShowUserModal(true);
    };

    const handleSaveUser = (e) => {
        e.preventDefault();
        const updatedUsers = [...users];
        const userIndex = updatedUsers.findIndex(u => u.email === currentUser.email);

        if (userIndex !== -1) {
            updatedUsers[userIndex] = { ...currentUser };
        } else {
            updatedUsers.push({ ...currentUser });
        }

        storageService.guardar('usuarios', updatedUsers);
        setUsers(updatedUsers);
        setShowUserModal(false);
        updateStats();
    };

    const handleDeleteUser = (email) => {
        if (window.confirm(`¿Estás seguro de eliminar al usuario ${email}?`)) {
            const updatedUsers = users.filter(u => u.email !== email);
            storageService.guardar('usuarios', updatedUsers);
            setUsers(updatedUsers);
            updateStats();
        }
    };

    return (
        <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '90vh' }}>
            <Row>
                <Col md={3} lg={2} className="mb-4">
                    <Card className="shadow-sm border-0 bg-dark text-white overflow-hidden">
                        <Card.Body className="p-0">
                            <div className="p-4 text-center bg-dark border-bottom border-secondary">
                                <h4 className="fw-bold text-uppercase mb-0">Admin <span className="text-warning">Panel</span></h4>
                            </div>
                            <Nav className="flex-column p-2">
                                <Nav.Link
                                    onClick={() => setActiveTab('dashboard')}
                                    className={`py-3 px-3 mb-1 rounded text-white transition-all ${activeTab === 'dashboard' ? 'bg-warning text-dark fw-bold' : 'hover-bg-secondary'}`}
                                >
                                    🏠 Dashboard
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => setActiveTab('products')}
                                    className={`py-3 px-3 mb-1 rounded text-white transition-all ${activeTab === 'products' ? 'bg-warning text-dark fw-bold' : 'hover-bg-secondary'}`}
                                >
                                    📦 Productos
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => setActiveTab('messages')}
                                    className={`py-3 px-3 mb-1 rounded text-white transition-all ${activeTab === 'messages' ? 'bg-warning text-dark fw-bold' : 'hover-bg-secondary'}`}
                                >
                                    ✉️ Mensajes
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => setActiveTab('users')}
                                    className={`py-3 px-3 mb-1 rounded text-white transition-all ${activeTab === 'users' ? 'bg-warning text-dark fw-bold' : 'hover-bg-secondary'}`}
                                >
                                    👥 Usuarios
                                </Nav.Link>
                            </Nav>
                            <div className="p-3 mt-auto">
                                <Button
                                    variant="outline-light"
                                    className="w-100 py-2"
                                    onClick={() => navigate('/')}
                                >
                                    Volver al Sitio
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={9} lg={10}>
                    {activeTab === 'dashboard' && (
                        <div>
                            <h3 className="fw-bold mb-4">Resumen General</h3>
                            <Row className="g-4">
                                <Col md={3}>
                                    <Card className="shadow-sm border-0 text-center py-4 bg-white border-start border-warning border-5">
                                        <Card.Body>
                                            <div className="text-muted text-uppercase small fw-bold">Usuarios Registrados</div>
                                            <h2 className="display-6 fw-bold mb-0">{stats.users}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="shadow-sm border-0 text-center py-4 bg-white border-start border-info border-5">
                                        <Card.Body>
                                            <div className="text-muted text-uppercase small fw-bold">Productos Activos</div>
                                            <h2 className="display-6 fw-bold mb-0">{stats.products}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="shadow-sm border-0 text-center py-4 bg-white border-start border-success border-5">
                                        <Card.Body>
                                            <div className="text-muted text-uppercase small fw-bold">Valor Inventario</div>
                                            <h2 className="display-6 fw-bold mb-0">${stats.income.toLocaleString()}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="shadow-sm border-0 text-center py-4 bg-white border-start border-danger border-5">
                                        <Card.Body>
                                            <div className="text-muted text-uppercase small fw-bold">Mensajes Pendientes</div>
                                            <h2 className="display-6 fw-bold mb-0">{stats.messages}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <div className="mt-5 p-4 bg-white rounded shadow-sm border">
                                <h5 className="fw-bold mb-3">Bienvenido al Panel de Control de Barbería Elegance</h5>
                                <p className="text-secondary">Desde aquí puedes gestionar todo tu catálogo de servicios, responder a los clientes y monitorear el crecimiento de tu negocio en tiempo real.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="bg-white p-4 rounded shadow-sm border">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold mb-0">📦 Gestión de Productos y Servicios</h3>
                                <Button variant="warning" className="fw-bold" onClick={() => handleOpenProductModal()}>
                                    + Agregar Nuevo
                                </Button>
                            </div>
                            <Table responsive hover className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                <img src={p.imagen} alt={p.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
                                            </td>
                                            <td className="fw-bold">{p.nombre}</td>
                                            <td><span className="badge bg-secondary">{p.categoria}</span></td>
                                            <td>${p.precio.toLocaleString()}</td>
                                            <td>{p.stock}</td>
                                            <td className="text-center">
                                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenProductModal(p)}>Editar</Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteProduct(p.id)}>Eliminar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="bg-white p-4 rounded shadow-sm border">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold mb-0">✉️ Bandeja de Mensajes</h3>
                                <Button variant="outline-danger" size="sm" onClick={() => {
                                    if(window.confirm('¿Vaciar todos los mensajes?')) {
                                        storageService.guardar('mensajes', []);
                                        setMessages([]);
                                        updateStats();
                                    }
                                }}>Vaciar Bandeja</Button>
                            </div>
                            <Table responsive hover className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Remitente</th>
                                        <th>Mensaje</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.length > 0 ? messages.map((m, index) => (
                                        <tr key={index}>
                                            <td className="small text-muted">{m.fecha}</td>
                                            <td>
                                                <div className="fw-bold">{m.nombre}</div>
                                                <div className="small text-secondary">{m.email}</div>
                                            </td>
                                            <td>
                                                <div className="text-truncate" style={{ maxWidth: '200px', cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline' }}
                                                      onClick={() => { setSelectedMessage(m); setShowMessageModal(true); }}>
                                                    {m.mensaje}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteMessage(index)}>Eliminar</Button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">No hay mensajes pendientes.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-white p-4 rounded shadow-sm border">
                            <div className="d-flex justify-content-center align-items-center mb-4">
                                <h3 className="fw-bold mb-0">👥 Gestión de Usuarios Registrados</h3>
                            </div>
                            <Table responsive hover className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>RUT</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? users.map((u) => (
                                        <tr key={u.email}>
                                            <td>{u.rut}</td>
                                            <td className="fw-bold">{u.email}</td>
                                            <td><span className={`badge ${u.rol === 'Administrator' ? 'bg-info' : 'bg-secondary'}`}>{u.rol}</span></td>
                                            <td className="text-center">
                                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenUserModal(u)}>Editar Rol</Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(u.email)}>Eliminar</Button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">No hay usuarios registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Modal para Leer Mensaje Completo */}
            <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Detalle del Mensaje</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedMessage && (
                        <div className="container-fluid">
                            <Row className="mb-4">
                                <Col md={6}>
                                    <label className="text-muted small d-block">Remitente:</label>
                                    <div className="fw-bold fs-5">{selectedMessage.nombre}</div>
                                    <div className="text-secondary">{selectedMessage.email}</div>
                                </Col>
                                <Col md={6} className="text-md-end">
                                    <label className="text-muted small d-block">Fecha de Envío:</label>
                                    <div className="fw-bold">{selectedMessage.fecha}</div>
                                </Col>
                            </Row>
                            <div className="mb-0">
                                <label className="text-muted small d-block mb-2">Mensaje:</label>
                                <div className="p-4 bg-light rounded border shadow-sm" style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    minHeight: '200px',
                                    fontSize: '1.1rem',
                                    lineHeight: '1.6',
                                    color: '#333',
                                    overflowX: 'hidden'
                                }}>
                                    {selectedMessage.mensaje}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMessageModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Crear/Editar Producto */}
            <Modal show={showProductModal} onHider={() => setShowProductModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">
                        {currentProduct.id ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSaveProduct}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Servicio/Producto</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={currentProduct.nombre}
                                onChange={(e) => setCurrentProduct({...currentProduct, nombre: e.target.value})}
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio ($)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={currentProduct.precio}
                                        onChange={(e) => setCurrentProduct({...currentProduct, precio: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock Inicial</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        value={currentProduct.stock}
                                        onChange={(e) => setCurrentProduct({...currentProduct, stock: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select
                                value={currentProduct.categoria}
                                onChange={(e) => setCurrentProduct({...currentProduct, categoria: e.target.value})}
                            >
                                <option value="Cortes">Cortes</option>
                                <option value="Barba">Barba</option>
                                <option value="Combos">Combos</option>
                                <option value="Productos">Productos</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>URL de la Imagen</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="/imagenes/nombre-archivo.jpg"
                                value={currentProduct.imagen}
                                onChange={(e) => setCurrentProduct({...currentProduct, imagen: e.target.value})}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowProductModal(false)}>Cancelar</Button>
                        <Button variant="warning" type="submit" className="fw-bold text-dark">
                            {currentProduct.id ? 'Actualizar Producto' : 'Guardar Producto'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal para Crear/Editar Usuario */}
            <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">
                        {currentUser.id ? 'Editar Usuario' : 'Gestionar Usuario'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSaveUser}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Email (Identificador Único)</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                value={currentUser.email}
                                onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>RUT</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={currentUser.rut}
                                onChange={(e) => setCurrentUser({...currentUser, rut: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rol de Acceso</Form.Label>
                            <Form.Select
                                value={currentUser.rol}
                                onChange={(e) => setCurrentUser({...currentUser, rol: e.target.value})}
                            >
                                <option value="User">Usuario Estándar</option>
                                <option value="Administrator">Administrador</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUserModal(false)}>Cancelar</Button>
                        <Button variant="warning" type="submit" className="fw-bold text-dark">
                            Guardar Cambios
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
