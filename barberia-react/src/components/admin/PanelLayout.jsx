import React from 'react';
import { Alert, Spinner } from 'react-bootstrap';

/** Contenedor común de cada sección del panel: título, acciones, carga y errores. */
const PanelLayout = ({ titulo, acciones, loading, error, children }) => (
    <div className="bg-white p-4 rounded shadow-sm border">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h3 className="fw-bold mb-0">{titulo}</h3>
            <div className="d-flex gap-2">{acciones}</div>
        </div>
        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
        {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
        ) : children}
    </div>
);

export default PanelLayout;
