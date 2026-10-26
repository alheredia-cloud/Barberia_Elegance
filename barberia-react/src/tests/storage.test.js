import { describe, it, expect, beforeEach } from 'vitest';
import storageService from '../services/storage.service';

describe('Pruebas del servicio de almacenamiento (storageService)', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('debe guardar y recuperar datos correctamente', () => {
    const datosPrueba = { nombre: 'Producto de Prueba', precio: 1000 };
    storageService.guardar('productos', datosPrueba);

    const recuperados = storageService.obtener('productos');
    expect(recuperados).toEqual(datosPrueba);
  });

  it('debe retornar null al intentar recuperar datos inexistentes', () => {
    const recuperados = storageService.obtener('claveInexistente');
    expect(recuperados).toBeNull();
  });

  it('debe manejar valores simples con guardarSimple y obtenerSimple', () => {
    storageService.guardarSimple('sesionActiva', 'usuario@prueba.com');
    const recuperados = storageService.obtenerSimple('sesionActiva');
    expect(recuperados).toBe('usuario@prueba.com');
  });

  it('debe inicializar los datos por defecto correctamente', () => {
    storageService.inicializarDatos();
    const productos = storageService.obtener('productos');
    expect(productos).not.toBeNull();
    expect(productos.length).toBeGreaterThan(0);
  });

  it('debe gestionar el agendamiento de citas correctamente', () => {
    const cita = { cliente: 'Cliente de Prueba', fecha: '2026-12-01', hora: '10:00', servicios: ['Corte'] };
    storageService.guardarCita(cita);

    const citas = storageService.obtenerCitas();
    expect(citas).toEqual(expect.arrayContaining([expect.objectContaining(cita)]));
  });
});
