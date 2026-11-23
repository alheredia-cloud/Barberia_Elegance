import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import PanelLayout from './PanelLayout';
import useApiData from '../../hooks/useApiData';
import { citasApi } from '../../services/barberia.api';
import { getErrorMessage } from '../../services/api';

/** Agenda centralizada (solo ADMIN): GET /api/v1/citas, DELETE /citas/{id}. */
const AgendaPanel = () => {
    const [fecha, setFecha] = useState('');
    const { data: citas, loading, error, setError, setData } = useApiData(() => citasApi.listar());

    const filtrar = async (valor) => {
        setFecha(valor);
        try {
            setData(await citasApi.listar(valor || undefined));
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const cancelar = async (c) => {
        if (!window.confirm(`¿Cancelar la cita de ${c.nombreCliente} (${c.fecha} ${c.hora.slice(0, 5)})?`)) return;
        try {
            await citasApi.eliminar(c.id);
            setData((lista) => lista.filter((x) => x.id !== c.id));
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <PanelLayout titulo="📅 Agenda de Citas" loading={loading} error={error}
            acciones={<Form.Control type="date" size="sm" value={fecha} onChange={(e) => filtrar(e.target.value)} />}>
            <Table responsive hover className="align-middle">
                <thead className="table-light">
                    <tr><th>Cliente</th><th>Fecha</th><th>Hora</th><th>Servicios</th><th>Notas</th><th>Boleta</th><th className="text-center">Acciones</th></tr>
                </thead>
                <tbody>
                    {citas.length ? citas.map((c) => (
                        <tr key={c.id}>
                            <td>
                                <div className="fw-bold">{c.nombreCliente}</div>
                                {c.emailUsuario && <div className="small text-secondary">{c.emailUsuario}</div>}
                            </td>
                            <td>{c.fecha}</td>
                            <td>{c.hora.slice(0, 5)}</td>
                            <td>{c.servicios.map((s) => <span key={s} className="badge bg-info text-dark me-1">{s}</span>)}</td>
                            <td className="small">{c.notas || '-'}</td>
                            <td>{c.boletaId ? `#${c.boletaId}` : '-'}</td>
                            <td className="text-center">
                                <Button variant="outline-danger" size="sm" onClick={() => cancelar(c)}>Cancelar</Button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="7" className="text-center py-4 text-muted">No hay citas agendadas.</td></tr>
                    )}
                </tbody>
            </Table>
        </PanelLayout>
    );
};

export default AgendaPanel;
