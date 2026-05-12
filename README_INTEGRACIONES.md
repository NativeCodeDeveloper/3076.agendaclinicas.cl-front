# AgendaClínica 1.0.2 — Guía de Integraciones y Nuevas Funcionalidades

> **Para:** Equipo técnico (NativeCode) y desarrolladores futuros  
> **Estado:** Funcionalidades implementadas en frontend. Columnas de BD marcadas con `[PENDIENTE BD]` requieren migración antes de persistir datos.

---

## Índice

1. [Resumen de lo implementado](#1-resumen-de-lo-implementado)
2. [Migraciones de Base de Datos requeridas](#2-migraciones-de-base-de-datos-requeridas)
3. [Endpoints de Backend a actualizar](#3-endpoints-de-backend-a-actualizar)
4. [Componentes nuevos](#4-componentes-nuevos)
5. [Buenas prácticas de seguridad](#5-buenas-prácticas-de-seguridad)
6. [Cómo ejecutar las migraciones](#6-cómo-ejecutar-las-migraciones)

---

## 1. Resumen de lo implementado

### 1.1 Rediseño visual premium (Apple / SaaS clínico)
- **Sidebar persistente**: menú lateral con acordeones que recuerdan su estado entre navegaciones (`sessionStorage`). El acordeón de la sección activa se abre automáticamente al entrar a cualquier ruta.
- **Paleta unificada**: fondo `#FAFAFB`, tarjetas `rounded-[28px]`, color primario `#6E56CF` (violeta) en toda la app.
- **AppointmentCard**: tarjetas de cita en calendario con tipo de consulta, modalidad y badges de estado/pago.
- **Calendarios (ambos)**: vista mes con "ver más" desplegable, vista semana/día con step=15min, scroll fijo a las 9:00.

### 1.2 Modalidad de atención por profesional `[PENDIENTE BD]`
Cada profesional puede configurar si atiende `presencial`, `online` o `ambas`.  
Visible en: **Configuración → Agenda & Servicios → Profesionales**.

### 1.3 Tipo de consulta y modalidad en reservas `[PENDIENTE BD]`
Al crear una cita desde el calendario, el operador puede:
- Seleccionar el **tipo de consulta** (dropdown con prestaciones del sistema).
- Indicar si es **Presencial** o **Online**.

Estos datos se muestran en las tarjetas del calendario y en el drawer de detalle.

### 1.4 Formateo universal de RUT chileno
- **Display**: en todos los listados, fichas, documentos y vistas, el RUT se muestra como `19.168.408-7`.
- **Input**: `RutInput` formatea automáticamente mientras el usuario escribe, valida 9 caracteres.
- El valor enviado al backend siempre es el RUT limpio sin puntos ni guión (`191684087`).

### 1.5 Teléfono con prefijo +569 integrado
- `PhoneInput`: muestra `+569` como prefijo fijo no editable.
- El usuario ingresa solo los 8 dígitos.
- El padre recibe `+56912345678` completo.
- Valida exactamente 8 dígitos.

### 1.6 Días bloqueados en agenda pública
En `/agendaEspecificaProfersional/[id_profesional]`, los días con bloqueo de jornada completa (09:00–22:00) aparecen en gris y no son seleccionables.

### 1.7 PDF de Presupuesto clínico
El PDF generado en la sección de Presupuesto de Tratamiento ahora tiene estilo de documento médico real:
- Solo colores neutros (negro, grises).
- Líneas de firma para profesional y paciente.
- Notas clínicas estándar (vigencia 30 días, IVA, contacto).
- Folio único por documento.

### 1.8 Botón "Carpeta del Paciente"
Presente en:
- `/dashboard/paciente/[id_paciente]`
- `/dashboard/NuevaFicha/[id_paciente]`
- `/dashboard/recetaPacientes/[id_paciente]`

Navega directamente a `/dashboard/FichasPacientes/[id_paciente]`.

---

## 2. Migraciones de Base de Datos requeridas

> ⚠️ **Ejecutar en orden.** Respaldar la BD antes de aplicar cambios.  
> El frontend ya envía estos campos; sin la migración simplemente se ignorarán.

### 2.1 Modalidad de atención del profesional

```sql
-- Tabla: profesionales
ALTER TABLE profesionales
  ADD COLUMN modalidad_atencion VARCHAR(20) NOT NULL DEFAULT 'ambas'
  COMMENT 'Valores: presencial | online | ambas';

-- Verificar
DESCRIBE profesionales;
```

### 2.2 Tipo de consulta y modalidad en reservas

```sql
-- Tabla: reservaciones (o la tabla que use el sistema para reservas)
ALTER TABLE reservaciones
  ADD COLUMN nombre_prestacion VARCHAR(255) NULL
  COMMENT 'Tipo de consulta seleccionado al agendar (ej: Consulta inicial, Control)',
  ADD COLUMN modalidad VARCHAR(20) NOT NULL DEFAULT 'presencial'
  COMMENT 'Modalidad de la atención: presencial | online';

-- Verificar
DESCRIBE reservaciones;
```

---

## 3. Endpoints de Backend a actualizar

Una vez aplicadas las migraciones, actualizar los siguientes endpoints:

### 3.1 Profesionales

| Endpoint | Cambio requerido |
|---|---|
| `POST /profesionales/insertarProfesional` | Aceptar y guardar `modalidad_atencion` |
| `POST /profesionales/actualizarProfesional` | Aceptar y actualizar `modalidad_atencion` |
| `GET /profesionales/seleccionarTodosProfesionales` | Retornar `modalidad_atencion` |
| `POST /profesionales/seleccionarProfesional` | Retornar `modalidad_atencion` |

**Ejemplo de body esperado (insertar/actualizar):**
```json
{
  "nombreProfesional": "Dr. Juan Pérez",
  "descripcionProfesional": "Médico general",
  "modalidad_atencion": "ambas"
}
```

### 3.2 Reservaciones / Agendamientos

> **Contexto clave:** el API ya hace JOIN con la tabla `profesionales` y retorna `nombreProfesional`
> en cada reserva. El mecanismo es exactamente el mismo para `nombre_prestacion` y `modalidad` —
> solo hay que agregar las columnas a `reservaciones` y sumarlas al SELECT.

#### Estado actual del objeto reserva (lo que devuelve el API hoy)

```json
{
  "id_reserva": 123,
  "nombrePaciente": "María",
  "apellidoPaciente": "López",
  "rut": "191684087",
  "telefono": "+56912345678",
  "email": "maria@correo.cl",
  "fechaInicio": "2026-05-20",
  "horaInicio": "09:00:00",
  "estadoReserva": "confirmada",
  "nombreProfesional": "Dra. Paula Madariaga"
}
```

> `nombreProfesional` ya llega porque el backend hace JOIN con la tabla `profesionales`.
> `nombre_prestacion` y `modalidad` NO llegan aún — falta la columna en `reservaciones`.

#### Por qué no aparece la prestación aunque la tabla `serviciosProfesionales` ya exista

La tabla de servicios (`serviciosProfesionales`) ya existe con todos los servicios creados.
El problema es que **la tabla `reservaciones` no tiene una columna que registre qué servicio
se eligió para esa reserva específica**. Sin esa columna, el backend no puede hacer el JOIN.

Es el mismo principio que con `nombreProfesional`: sin la columna `id_profesional` en
`reservaciones`, tampoco podría aparecer el nombre del profesional.

#### Endpoints a actualizar

| Endpoint | Cambio requerido |
|---|---|
| `POST /reservaPacientes/insertarReserva` | Aceptar `nombre_prestacion`, `modalidad` y guardarlos |
| `POST /reservaPacientes/insertarReservaPacienteFicha` | Ídem (usado desde la web pública) |
| `POST /reservaPacientes/actualizarReservacion` | Aceptar y actualizar ambos campos |
| `GET /reservaPacientes/seleccionarReservados` | Agregar `r.nombre_prestacion`, `r.modalidad` al SELECT |
| `POST /reservaPacientes/seleccionarPorProfesional` | Ídem |
| `POST /reservaPacientes/seleccionarEspecifica` | Ídem |

#### Ejemplo: cómo quedaría la query de SELECT (pseudocódigo)

```sql
-- ANTES (retorna solo los campos básicos + JOIN con profesionales):
SELECT r.*, p.nombreProfesional
FROM reservaciones r
JOIN profesionales p ON r.id_profesional = p.id_profesional

-- DESPUÉS (suma los nuevos campos):
SELECT r.*, p.nombreProfesional, r.nombre_prestacion, r.modalidad
FROM reservaciones r
JOIN profesionales p ON r.id_profesional = p.id_profesional
```

#### El frontend ya envía los datos (no requiere más cambios en front)

Desde el **dashboard** (AppointmentDrawer):
```javascript
nombre_prestacion: "Consulta inicial",  // seleccionado en el drawer
modalidad: "presencial"                 // toggle Online/Presencial
```

Desde la **web pública** (formularioReservaProfesional):
```javascript
nombre_prestacion: servicioSeleccionado, // el servicio que eligió el paciente
modalidad: "presencial"                  // por defecto (extensible)
```

El **AppointmentCard** ya lee automáticamente el campo cuando llega:
```javascript
const prestacion = reserva?.nombre_prestacion ?? "";  // ← ya funciona al recibir el dato
const profesional = reserva?._nombreProfesional ?? ""; // ← lookup local, ya funciona
```

#### Ejemplo de body completo al insertar reserva

```json
{
  "nombrePaciente": "María",
  "apellidoPaciente": "López",
  "rut": "191684087",
  "telefono": "+56912345678",
  "email": "maria@correo.cl",
  "fechaInicio": "2026-05-20",
  "horaInicio": "09:00:00",
  "fechaFinalizacion": "2026-05-20",
  "horaFinalizacion": "09:45:00",
  "estadoReserva": "reservada",
  "id_profesional": 3,
  "nombre_prestacion": "Consulta inicial",
  "modalidad": "presencial"
}
```

---

## 4. Componentes nuevos

### `src/Componentes/RutInput.jsx`
Input con autoformateo de RUT chileno en tiempo real.

```jsx
// Uso:
import { RutInput } from "@/Componentes/RutInput";

<RutInput
  value={rut}           // valor limpio: "191684087"
  onChange={(clean) => setRut(clean)}  // devuelve "191684087"
  label="RUT del Paciente"
/>
```

### `src/Componentes/PhoneInput.jsx`
Input de teléfono con prefijo `+569` fijo.

```jsx
import { PhoneInput } from "@/Componentes/PhoneInput";

<PhoneInput
  value={telefono}              // "+56912345678" o "12345678"
  onChange={(full) => setTelefono(full)}  // devuelve "+56912345678"
  label="Teléfono"
/>
```

### `src/app/dashboard/SidebarNav.jsx`
Navegación del sidebar como componente cliente. Persiste estado de acordeones en `sessionStorage` y resalta la ruta activa.

### `src/app/dashboard/UserMenu.jsx`
Menú de usuario en el footer del sidebar. Muestra nombre, rol y avatar del usuario Clerk. Opciones: **Volver a página web** y **Cerrar Sesión**.

---

## 5. Buenas prácticas de seguridad

### Datos de pacientes (RIESGO ALTO)
- Los RUTs y teléfonos viajan limpios al backend. **Nunca mostrar RUT sin formatear en logs**.
- En el backend, sanitizar y validar todos los campos antes de guardar en BD.
- El campo `nombre_prestacion` es texto libre — usar `sanitize` o `strip_tags` en el backend antes de guardar.

### Autenticación y roles
- El dashboard usa **Clerk** como proveedor de autenticación.
- Los metadatos de rol (`rol` o `role`) viven en `user.publicMetadata` de Clerk.
- Las rutas del dashboard están protegidas por el middleware `src/middleware.ts`.
- **No exponer rutas de API al público**: verificar que todos los endpoints de `/reservaPacientes`, `/pacientes`, `/profesionales` requieran token de sesión.

### Variables de entorno
```env
# .env.local — NUNCA subir al repositorio
NEXT_PUBLIC_API_URL=https://tu-backend.com/api
NEXT_PUBLIC_EMPRESA_NOMBRE=NombreClinica
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```
- `NEXT_PUBLIC_*` son visibles en el cliente. **No poner secrets aquí**.
- `CLERK_SECRET_KEY` va solo en el servidor.

### BD
- Crear un usuario de BD con permisos mínimos (solo las tablas necesarias).
- No usar `root` en producción.
- Habilitar SSL en la conexión a la BD.
- Respaldar la BD antes de cada migración.

---

## 6. Cómo ejecutar las migraciones

### Paso 1 — Respaldar la base de datos

```bash
# MySQL / MariaDB
mysqldump -u usuario -p nombre_bd > backup_$(date +%Y%m%d).sql
```

### Paso 2 — Conectarse a la BD

```bash
mysql -u usuario -p nombre_bd
```

### Paso 3 — Ejecutar las migraciones en orden

```sql
-- 1. Modalidad del profesional
ALTER TABLE profesionales
  ADD COLUMN modalidad_atencion VARCHAR(20) NOT NULL DEFAULT 'ambas';

-- 2. Campos en reservaciones
ALTER TABLE reservaciones
  ADD COLUMN nombre_prestacion VARCHAR(255) NULL,
  ADD COLUMN modalidad VARCHAR(20) NOT NULL DEFAULT 'presencial';

-- 3. Verificar
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('profesionales', 'reservaciones')
  AND COLUMN_NAME IN ('modalidad_atencion', 'nombre_prestacion', 'modalidad');
```

### Paso 4 — Actualizar el backend

1. En el controlador de `insertarProfesional`: recibir y guardar `modalidad_atencion`.
2. En el controlador de `insertarReserva`: recibir y guardar `nombre_prestacion` y `modalidad`.
3. En todos los SELECT de reservas: incluir `nombre_prestacion` y `modalidad` en el `SELECT`.
4. Reiniciar el servicio del backend.

### Paso 5 — Verificar en el dashboard

1. Ir a **Configuración → Profesionales** → seleccionar un profesional → verificar que muestra las opciones de modalidad.
2. Ir al **Calendario → Nueva Reserva** → crear una cita → verificar que los campos "Tipo de consulta" y "Modalidad" aparecen y se guardan.
3. Ver la tarjeta de esa cita en el calendario → verificar que muestra el tipo de consulta y la modalidad.

---

## Lista rápida de lo nuevo

| Feature | Estado frontend | Requiere BD | Detalle |
|---|---|---|---|
| Sidebar persistente (acordeones) | ✅ Completo | No | sessionStorage + usePathname |
| Tema Apple premium unificado | ✅ Completo | No | bg-[#FAFAFB], rounded-[28px], violeta #6E56CF |
| Profesional en tarjeta de cita | ✅ Completo | No | Lookup local en listaProfesionales |
| Tipo de consulta (prestación) en tarjeta | ✅ Frontend listo | **Sí** | ALTER TABLE + SELECT en backend |
| Modalidad online/presencial en tarjeta | ✅ Frontend listo | **Sí** | ALTER TABLE + SELECT en backend |
| Modalidad por profesional (config) | ✅ Frontend listo | **Sí** | ALTER TABLE profesionales |
| RutInput con autoformateo | ✅ Completo | No | Formato XX.XXX.XXX-X en tiempo real |
| PhoneInput +569 integrado | ✅ Completo | No | Prefijo fijo, 8 dígitos restantes |
| formatRut en toda la app | ✅ Completo | No | Todos los listados, fichas y vistas |
| Días bloqueados grises en agenda web | ✅ Completo | No | Fetch bloqueosPorProfesional al cargar |
| PDF presupuesto clínico | ✅ Completo | No | Sin gradientes, firmas, notas clínicas |
| Botón "Carpeta del Paciente" | ✅ Completo | No | En paciente, NuevaFicha, recetaPacientes |
| UserMenu con avatar Clerk | ✅ Completo | No | Volver al sitio + Cerrar Sesión |
| Calendarios mejorados | ✅ Completo | No | step=15min, scroll 9:00, "ver más" custom |

### ¿Por qué prestación y modalidad requieren BD si serviciosProfesionales ya existe?

La tabla `serviciosProfesionales` contiene el **catálogo** de servicios disponibles.
Lo que falta es la columna en `reservaciones` que registre **cuál servicio eligió ese
paciente en esa reserva específica**. Es el mismo principio que `nombreProfesional`:
el API ya hace JOIN con `profesionales` porque `reservaciones.id_profesional` existe.
Cuando exista `reservaciones.nombre_prestacion`, el mismo JOIN retornará el servicio
y el AppointmentCard lo mostrará automáticamente — sin más cambios en el frontend.

---

*Generado por NativeCode — AgendaClínica 1.0.2 — 2026*
