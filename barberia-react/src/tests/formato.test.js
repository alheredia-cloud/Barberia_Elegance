import { describe, it, expect } from 'vitest';
import { formatCLP, normalizarRut, rutValido } from '../utils/formato';

describe('Utilidades de formato y validación', () => {
    it('valida el RUT con dígito verificador (módulo 11)', () => {
        expect(rutValido('12345678-5')).toBe(true);
        expect(rutValido('12.345.678-5')).toBe(true);
        expect(rutValido('11111111-1')).toBe(true);
        expect(rutValido('12345678-9')).toBe(false);
        expect(rutValido('abc')).toBe(false);
    });

    it('normaliza el RUT al formato que espera el backend', () => {
        expect(normalizarRut('12.345.678-5')).toBe('12345678-5');
        expect(normalizarRut('123456785')).toBe('12345678-5');
        expect(normalizarRut('7654321k')).toBe('7654321-K');
    });

    it('formatea montos en pesos chilenos', () => {
        expect(formatCLP(15000)).toBe('$15.000');
        expect(formatCLP(null)).toBe('$0');
    });
});
