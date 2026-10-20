
-- Base de datos OrdenOne
-- Estructura inicial de las tablas

-- 1. Negocio
CREATE TABLE negocio (
    id_negocio SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo_negocio VARCHAR(100),
    telefono VARCHAR(30),
    email VARCHAR(150),
    direccion VARCHAR(200),
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo'
);

-- 2. Empleado
CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    id_negocio INTEGER NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(150),
    cargo VARCHAR(100),
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',

    CONSTRAINT fk_empleado_negocio
        FOREIGN KEY (id_negocio)
        REFERENCES negocio(id_negocio)
);

-- 3. Usuario
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_empleado INTEGER NOT NULL UNIQUE,
    email_login VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',

    CONSTRAINT fk_usuario_empleado
        FOREIGN KEY (id_empleado)
        REFERENCES empleado(id_empleado),

    CONSTRAINT chk_usuario_rol
        CHECK (rol IN ('Administrador', 'Empleado'))
);

-- 4. Cliente
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    id_negocio INTEGER NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(150),
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',

    CONSTRAINT fk_cliente_negocio
        FOREIGN KEY (id_negocio)
        REFERENCES negocio(id_negocio)
);

-- 5. Servicio
CREATE TABLE servicio (
    id_servicio SERIAL PRIMARY KEY,
    id_negocio INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_base NUMERIC(12,2) NOT NULL CHECK (precio_base >= 0),
    duracion_estimada INTEGER,
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',

    CONSTRAINT fk_servicio_negocio
        FOREIGN KEY (id_negocio)
        REFERENCES negocio(id_negocio),

    CONSTRAINT chk_servicio_duracion
        CHECK (duracion_estimada IS NULL OR duracion_estimada > 0)
);

-- 6. Cita
CREATE TABLE cita (
    id_cita SERIAL PRIMARY KEY,
    id_negocio INTEGER NOT NULL,
    id_cliente INTEGER NOT NULL,
    id_empleado INTEGER,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Programada',
    observaciones TEXT,

    CONSTRAINT fk_cita_negocio
        FOREIGN KEY (id_negocio)
        REFERENCES negocio(id_negocio),

    CONSTRAINT fk_cita_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente),

    CONSTRAINT fk_cita_empleado
        FOREIGN KEY (id_empleado)
        REFERENCES empleado(id_empleado),

    CONSTRAINT chk_cita_estado
        CHECK (estado IN (
            'Programada', 'Confirmada', 'Atendida',
            'Cancelada', 'No asistió'
        ))
);

-- 7. CitaServicio
CREATE TABLE cita_servicio (
    id_cita_servicio SERIAL PRIMARY KEY,
    id_cita INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,

    CONSTRAINT fk_cita_servicio_cita
        FOREIGN KEY (id_cita)
        REFERENCES cita(id_cita),

    CONSTRAINT fk_cita_servicio_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES servicio(id_servicio),

    CONSTRAINT uq_cita_servicio
        UNIQUE (id_cita, id_servicio)
);

-- 8. OrdenServicio
CREATE TABLE orden_servicio (
    id_orden SERIAL PRIMARY KEY,
    id_negocio INTEGER NOT NULL,
    id_cliente INTEGER NOT NULL,
    id_empleado INTEGER NOT NULL,
    id_cita INTEGER UNIQUE,
    fecha_servicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'Registrada',

    CONSTRAINT fk_orden_negocio
        FOREIGN KEY (id_negocio)
        REFERENCES negocio(id_negocio),

    CONSTRAINT fk_orden_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente),

    CONSTRAINT fk_orden_empleado
        FOREIGN KEY (id_empleado)
        REFERENCES empleado(id_empleado),

    CONSTRAINT fk_orden_cita
        FOREIGN KEY (id_cita)
        REFERENCES cita(id_cita),

    CONSTRAINT chk_orden_estado
        CHECK (estado IN ('Registrada', 'Completada', 'Anulada'))
);

-- 9. DetalleOrden
CREATE TABLE detalle_orden (
    id_detalle SERIAL PRIMARY KEY,
    id_orden INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_aplicado NUMERIC(12,2) NOT NULL CHECK (precio_aplicado >= 0),
    observacion TEXT,

    CONSTRAINT fk_detalle_orden
        FOREIGN KEY (id_orden)
        REFERENCES orden_servicio(id_orden),

    CONSTRAINT fk_detalle_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES servicio(id_servicio),

    CONSTRAINT chk_detalle_cantidad
        CHECK (cantidad > 0)
);

-- 10. Pago
CREATE TABLE pago (
    id_pago SERIAL PRIMARY KEY,
    id_orden INTEGER NOT NULL,
    fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto NUMERIC(12,2) NOT NULL CHECK (monto > 0),
    metodo VARCHAR(30) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Registrado',

    CONSTRAINT fk_pago_orden
        FOREIGN KEY (id_orden)
        REFERENCES orden_servicio(id_orden),

    CONSTRAINT chk_pago_metodo
        CHECK (metodo IN (
            'Efectivo', 'Tarjeta', 'Transferencia', 'Nequi', 'Otro'
        )),

    CONSTRAINT chk_pago_estado
        CHECK (estado IN ('Registrado', 'Anulado'))
);

-- 11. Seguimiento
CREATE TABLE seguimiento (
    id_seguimiento SERIAL PRIMARY KEY,
    id_negocio INTEGER NOT NULL,
    id_cliente INTEGER NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(150) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    observacion TEXT,

    CONSTRAINT fk_seguimiento_negocio
        FOREIGN KEY (id_negocio)
        REFERENCES negocio(id_negocio),

    CONSTRAINT fk_seguimiento_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente),

    CONSTRAINT chk_seguimiento_estado
        CHECK (estado IN ('Pendiente', 'Realizado', 'Cancelado'))
);

-- 12. Horario
CREATE TABLE horario (
    id_horario SERIAL PRIMARY KEY,
    id_empleado INTEGER NOT NULL,
    dia_semana VARCHAR(15) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,

    CONSTRAINT fk_horario_empleado
        FOREIGN KEY (id_empleado)
        REFERENCES empleado(id_empleado),

    CONSTRAINT chk_horario_dia
        CHECK (dia_semana IN (
            'Lunes', 'Martes', 'Miercoles', 'Jueves',
            'Viernes', 'Sabado', 'Domingo'
        )),

    CONSTRAINT chk_horario_horas
        CHECK (hora_fin > hora_inicio)
);
