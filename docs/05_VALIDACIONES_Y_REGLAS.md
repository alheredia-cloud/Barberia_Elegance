# 📏 05. VALIDACIONES Y REGLAS DE NEGOCIO

Análisis del módulo de integridad de datos encargado de prevenir errores de entrada.

## 🛡️ El Motor de Validaciones (`assets/js/validations.js`)
Este archivo centraliza todas las reglas que el sistema debe cumplir para considerar un dato como válido.

### 📧 Validación de Correos
El sistema no acepta cualquier correo electrónico. Utiliza una **Expresión Regular (Regex)** para obligar el uso de dominios específicos:
- `@duoc.cl`
- `@profesor.duoc.cl`
- `@gmail.com`

**Regex utilizada:** `/(@duoc\.cl|@profesor\.duoc\.cl|@gmail\.com)$/`

### 🆔 Validación del RUN
Para evitar errores en el registro de usuarios, el RUN debe cumplir estrictamente con:
- Solo números (del 0 al 9).
- Longitud entre 7 y 9 dígitos.
- **Prohibición total** de puntos y guiones.

**Regex utilizada:** `/^[0-9]{7,9}$/`

### 🔑 Validación de Contraseñas
Para mantener un estándar de seguridad básico, las contraseñas deben tener una longitud mínima de 4 y máxima de 10 caracteres.

### 📝 Validación de Textos
El sistema limita la longitud de los comentarios de contacto y nombres para evitar desbordamientos de datos en la interfaz:
- Nombres: Máximo 100 caracteres.
- Comentarios: Máximo 500 caracteres.

---
**Siguiente módulo sugerido:** [[06_PERSISTENCIA_DATOS]]