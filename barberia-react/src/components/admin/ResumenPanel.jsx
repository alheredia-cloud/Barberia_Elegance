import React from 'react';
import { Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import useApiData from '../../hooks/useApiData';
import { dashboardApi } from '../../services/barberia.api';
import { formatCLP } from '../../utils/formato';

const Kpi = ({ titulo, valor, color }) => (
    <Col sm={6} xl={3}>
        <Card className={`shadow-sm border-0 text-center py-4 bg-white border-start border-${color} border-5 h-100`}>
            <Card.Body>
                <div className="text-muted text-uppercase small fw-bold">{titulo}</div>
                <h2 className="display-6 fw-bold mb-0">{valor}</h2>
            </Card.Body>
        </Card>
    </Col>
);

/** KPIs del negocio: GET /api/v1/dashboard/resumen (solo ADMIN). */
const ResumenPanel = () => {
    const { data: r, loading, error } = useApiData(dashboardApi.resumen, null);

    return (
        <div>
            <h3 className="fw-bold mb-4">Resumen General</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading || !r ? (
                !error && <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
            ) : (
                <Row className="g-4">
                    <Kpi titulo="Usuarios Registrados" valor={r.totalUsuarios} color="warning" />
                    <Kpi titulo="Clientes" valor={r.totalClientes} color="secondary" />
                    <Kpi titulo="Productos Activos" valor={r.totalProductos} color="info" />
                    <Kpi titulo="Valor Inventario" valor={formatCLP(r.valorInventario)} color="success" />
                    <Kpi titulo="Boletas Emitidas" valor={r.totalBoletas} color="primary" />
                    <Kpi titulo="Total Ventas" valor={formatCLP(r.totalVentas)} color="success" />
                    <Kpi titulo="Citas Agendadas" valor={r.totalCitas} color="info" />
                    <Kpi titulo="Mensajes sin leer" valor={r.mensajesNoLeidos} color="danger" />
                </Row>
            )}
            <div className="mt-5 p-4 bg-white rounded shadow-sm border">
                <h5 className="fw-bold mb-3">Bienvenido al Panel de Control de Barbería Elegance</h5>
                <p className="text-secondary mb-0">
                    Los datos se obtienen en tiempo real desde la API REST y la base de datos del sistema.
                </p>
            </div>
        </div>
    );
};

export default ResumenPanel;
