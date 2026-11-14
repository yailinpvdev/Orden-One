const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Página principal de la API
app.get("/", (req, res) => {
  res.json({
    mensaje: "Bienvenido a OrdenOne",
    estado: "Servidor funcionando",
  });
});

// Comprobar la API
app.get("/api/test", (req, res) => {
  res.json({
    mensaje: "La API de OrdenOne funciona correctamente",
  });
});

// Comprobar la conexión con PostgreSQL
app.get("/api/test-db", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW() AS fecha_servidor");

    res.json({
      mensaje: "Conexión con PostgreSQL exitosa",
      fecha: resultado.rows[0].fecha_servidor,
    });
  } catch (error) {
    console.error("Error de conexión con PostgreSQL:", error.message);

    res.status(500).json({
      mensaje: "No se pudo conectar con PostgreSQL",
    });
  }
});

// Consultar los clientes registrados
app.get("/api/clientes", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id_cliente, nombre_completo, telefono, email, estado
       FROM cliente
       WHERE id_negocio = $1
       ORDER BY id_cliente DESC`,
      [1],
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar clientes:", error.message);

    res.status(500).json({
      mensaje: "No se pudieron consultar los clientes",
    });
  }
});

// Registrar un cliente nuevo
app.post("/api/clientes", async (req, res) => {
  try {
    const { nombre_completo, telefono, email } = req.body;

    if (typeof nombre_completo !== "string" || !nombre_completo.trim()) {
      return res.status(400).json({
        mensaje: "El nombre completo es obligatorio",
      });
    }

    const resultado = await pool.query(
      `INSERT INTO cliente
        (id_negocio, nombre_completo, telefono, email, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_cliente, nombre_completo, telefono, email, estado`,
      [
        1,
        nombre_completo.trim(),
        telefono?.trim() || null,
        email?.trim() || null,
        "Activo",
      ],
    );

    res.status(201).json({
      mensaje: "Cliente registrado correctamente",
      cliente: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al registrar cliente:", error.message);

    res.status(500).json({
      mensaje: "No se pudo registrar el cliente",
    });
  }
});

// Actualizar los datos de un cliente
app.put("/api/clientes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre_completo, telefono, email } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensaje: "El identificador del cliente no es válido",
      });
    }

    if (typeof nombre_completo !== "string" || !nombre_completo.trim()) {
      return res.status(400).json({
        mensaje: "El nombre completo es obligatorio",
      });
    }

    const resultado = await pool.query(
      `UPDATE cliente
       SET nombre_completo = $1,
           telefono = $2,
           email = $3
       WHERE id_cliente = $4
         AND id_negocio = $5
       RETURNING id_cliente, nombre_completo, telefono, email, estado`,
      [
        nombre_completo.trim(),
        telefono?.trim() || null,
        email?.trim() || null,
        id,
        1,
      ],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontró el cliente",
      });
    }

    res.json({
      mensaje: "Cliente actualizado correctamente",
      cliente: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar cliente:", error.message);

    res.status(500).json({
      mensaje: "No se pudo actualizar el cliente",
    });
  }
});

/* =========================================
   MÓDULO DE EMPLEADOS
========================================= */

// Consultar los empleados registrados
app.get("/api/empleados", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id_empleado, nombre_completo, telefono, email, cargo, estado
       FROM empleado
       WHERE id_negocio = $1
       ORDER BY id_empleado DESC`,
      [1],
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar empleados:", error.message);

    res.status(500).json({
      mensaje: "No se pudieron consultar los empleados",
    });
  }
});

// Registrar un empleado nuevo
app.post("/api/empleados", async (req, res) => {
  try {
    const { nombre_completo, telefono, email, cargo } = req.body;

    if (typeof nombre_completo !== "string" || !nombre_completo.trim()) {
      return res.status(400).json({
        mensaje: "El nombre completo es obligatorio",
      });
    }

    if (typeof cargo !== "string" || !cargo.trim()) {
      return res.status(400).json({
        mensaje: "El cargo es obligatorio",
      });
    }

    const resultado = await pool.query(
      `INSERT INTO empleado
        (id_negocio, nombre_completo, telefono, email, cargo, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id_empleado, nombre_completo, telefono, email, cargo, estado`,
      [
        1,
        nombre_completo.trim(),
        typeof telefono === "string" ? telefono.trim() || null : null,
        typeof email === "string" ? email.trim() || null : null,
        cargo.trim(),
        "Activo",
      ],
    );

    res.status(201).json({
      mensaje: "Empleado registrado correctamente",
      empleado: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al registrar empleado:", error.message);

    res.status(500).json({
      mensaje: "No se pudo registrar el empleado",
    });
  }
});

// Actualizar los datos de un empleado
app.put("/api/empleados/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre_completo, telefono, email, cargo } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensaje: "El identificador del empleado no es válido",
      });
    }

    if (typeof nombre_completo !== "string" || !nombre_completo.trim()) {
      return res.status(400).json({
        mensaje: "El nombre completo es obligatorio",
      });
    }

    if (typeof cargo !== "string" || !cargo.trim()) {
      return res.status(400).json({
        mensaje: "El cargo es obligatorio",
      });
    }

    const resultado = await pool.query(
      `UPDATE empleado
       SET nombre_completo = $1,
           telefono = $2,
           email = $3,
           cargo = $4
       WHERE id_empleado = $5
         AND id_negocio = $6
       RETURNING id_empleado, nombre_completo, telefono, email, cargo, estado`,
      [
        nombre_completo.trim(),
        typeof telefono === "string" ? telefono.trim() || null : null,
        typeof email === "string" ? email.trim() || null : null,
        cargo.trim(),
        id,
        1,
      ],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontró el empleado",
      });
    }

    res.json({
      mensaje: "Empleado actualizado correctamente",
      empleado: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar empleado:", error.message);

    res.status(500).json({
      mensaje: "No se pudo actualizar el empleado",
    });
  }
});

/* =========================================
   MÓDULO DE SERVICIOS
========================================= */

// Consultar los servicios registrados
app.get("/api/servicios", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id_servicio, nombre, descripcion, precio_base,
              duracion_estimada, estado
       FROM servicio
       WHERE id_negocio = $1
       ORDER BY id_servicio DESC`,
      [1],
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar servicios:", error.message);

    res.status(500).json({
      mensaje: "No se pudieron consultar los servicios",
    });
  }
});

// Registrar un servicio nuevo
app.post("/api/servicios", async (req, res) => {
  try {
    const { nombre, descripcion, precio_base, duracion_estimada } = req.body;

    if (typeof nombre !== "string" || !nombre.trim()) {
      return res.status(400).json({
        mensaje: "El nombre del servicio es obligatorio",
      });
    }

    const precio = Number(precio_base);
    const duracion = Number(duracion_estimada);

    if (
      precio_base === "" ||
      precio_base == null ||
      !Number.isFinite(precio) ||
      precio < 0
    ) {
      return res.status(400).json({
        mensaje: "El precio debe ser un número igual o mayor que cero",
      });
    }

    if (
      duracion_estimada === "" ||
      duracion_estimada == null ||
      !Number.isInteger(duracion) ||
      duracion < 1
    ) {
      return res.status(400).json({
        mensaje: "La duración debe ser un número entero mayor que cero",
      });
    }

    const resultado = await pool.query(
      `INSERT INTO servicio
        (id_negocio, nombre, descripcion, precio_base,
         duracion_estimada, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id_servicio, nombre, descripcion, precio_base,
                 duracion_estimada, estado`,
      [
        1,
        nombre.trim(),
        typeof descripcion === "string" ? descripcion.trim() || null : null,
        precio,
        duracion,
        "Activo",
      ],
    );

    res.status(201).json({
      mensaje: "Servicio registrado correctamente",
      servicio: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al registrar servicio:", error.message);

    res.status(500).json({
      mensaje: "No se pudo registrar el servicio",
    });
  }
});

// Actualizar los datos de un servicio
app.put("/api/servicios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, precio_base, duracion_estimada } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensaje: "El identificador del servicio no es válido",
      });
    }

    if (typeof nombre !== "string" || !nombre.trim()) {
      return res.status(400).json({
        mensaje: "El nombre del servicio es obligatorio",
      });
    }

    const precio = Number(precio_base);
    const duracion = Number(duracion_estimada);

    if (
      precio_base === "" ||
      precio_base == null ||
      !Number.isFinite(precio) ||
      precio < 0
    ) {
      return res.status(400).json({
        mensaje: "El precio debe ser un número igual o mayor que cero",
      });
    }

    if (
      duracion_estimada === "" ||
      duracion_estimada == null ||
      !Number.isInteger(duracion) ||
      duracion < 1
    ) {
      return res.status(400).json({
        mensaje: "La duración debe ser un número entero mayor que cero",
      });
    }

    const resultado = await pool.query(
      `UPDATE servicio
       SET nombre = $1,
           descripcion = $2,
           precio_base = $3,
           duracion_estimada = $4
       WHERE id_servicio = $5
         AND id_negocio = $6
       RETURNING id_servicio, nombre, descripcion, precio_base,
                 duracion_estimada, estado`,
      [
        nombre.trim(),
        typeof descripcion === "string" ? descripcion.trim() || null : null,
        precio,
        duracion,
        id,
        1,
      ],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontró el servicio",
      });
    }

    res.json({
      mensaje: "Servicio actualizado correctamente",
      servicio: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar el servicio:", error.message);

    res.status(500).json({
      mensaje: "No se pudo actualizar el servicio",
    });
  }
});

/* =========================================
   MÓDULO DE CITAS
========================================= */

// Consultar citas registradas
app.get("/api/citas", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT
        c.id_cita,
        c.id_cliente,
c.id_empleado,
        cl.nombre_completo AS cliente,
        e.nombre_completo AS empleado,
        c.fecha,
        c.hora,
        c.estado,
        c.observaciones,
        ARRAY_AGG(DISTINCT s.nombre) FILTER (WHERE s.nombre IS NOT NULL) AS servicios,
ARRAY_AGG(DISTINCT cs.id_servicio) FILTER (WHERE cs.id_servicio IS NOT NULL) AS id_servicios
      FROM cita c
      INNER JOIN cliente cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN empleado e ON c.id_empleado = e.id_empleado
      LEFT JOIN cita_servicio cs ON c.id_cita = cs.id_cita
      LEFT JOIN servicio s ON cs.id_servicio = s.id_servicio
      WHERE c.id_negocio = $1
     GROUP BY
    c.id_cita,
    c.id_cliente,
    c.id_empleado,
    cl.nombre_completo,
    e.nombre_completo
      ORDER BY c.fecha DESC, c.hora DESC`,
      [1],
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar citas:", error.message);

    res.status(500).json({
      mensaje: "No se pudieron consultar las citas",
    });
  }
});

// Registrar una nueva cita
app.post("/api/citas", async (req, res) => {
  const {
    id_cliente,
    id_empleado,
    fecha,
    hora,
    estado,
    observaciones,
    id_servicios,
  } = req.body;

  const conexion = await pool.connect();

  try {
    await conexion.query("BEGIN");

    const resultado = await conexion.query(
      `INSERT INTO cita (
        id_negocio,
        id_cliente,
        id_empleado,
        fecha,
        hora,
        estado,
        observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_cita`,
      [
        1,
        id_cliente,
        id_empleado || null,
        fecha,
        hora,
        estado,
        observaciones || null,
      ],
    );

    const id_cita = resultado.rows[0].id_cita;

    for (const id_servicio of id_servicios) {
      await conexion.query(
        `INSERT INTO cita_servicio (id_cita, id_servicio)
         VALUES ($1, $2)`,
        [id_cita, id_servicio],
      );
    }

    await conexion.query("COMMIT");

    res.status(201).json({
      mensaje: "Cita registrada correctamente",
      id_cita,
    });
  } catch (error) {
    await conexion.query("ROLLBACK");

    console.error("Error al registrar cita:", error.message);

    res.status(500).json({
      mensaje: "No se pudo registrar la cita",
    });
  } finally {
    conexion.release();
  }
});

// Editar una cita
app.put("/api/citas/:id", async (req, res) => {
  const { id } = req.params;
  const {
    id_cliente,
    id_empleado,
    fecha,
    hora,
    estado,
    observaciones,
    id_servicios,
  } = req.body;

  const conexion = await pool.connect();

  try {
    await conexion.query("BEGIN");

    const resultado = await conexion.query(
      `UPDATE cita
             SET id_cliente = $1,
                 id_empleado = $2,
                 fecha = $3,
                 hora = $4,
                 estado = $5,
                 observaciones = $6
             WHERE id_cita = $7 AND id_negocio = $8
             RETURNING id_cita`,
      [
        id_cliente,
        id_empleado || null,
        fecha,
        hora,
        estado,
        observaciones,
        id,
        1,
      ],
    );

    if (resultado.rowCount === 0) {
      await conexion.query("ROLLBACK");
      return res.status(404).json({
        mensaje: "No se encontró la cita",
      });
    }

    await conexion.query("DELETE FROM cita_servicio WHERE id_cita = $1", [id]);

    for (const id_servicio of id_servicios || []) {
      await conexion.query(
        `INSERT INTO cita_servicio (id_cita, id_servicio)
                 VALUES ($1, $2)`,
        [id, id_servicio],
      );
    }

    await conexion.query("COMMIT");

    res.json({
      mensaje: "Cita actualizada correctamente",
    });
  } catch (error) {
    await conexion.query("ROLLBACK");
    console.error("Error al editar cita:", error.message);

    res.status(500).json({
      mensaje: "No se pudo actualizar la cita",
    });
  } finally {
    conexion.release();
  }
});

// Cancelar una cita
app.patch("/api/citas/:id/cancelar", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `UPDATE cita
             SET estado = 'Cancelada'
             WHERE id_cita = $1 AND id_negocio = $2
             RETURNING id_cita`,
      [id, 1],
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        mensaje: "No se encontró la cita",
      });
    }

    res.json({
      mensaje: "Cita cancelada correctamente",
    });
  } catch (error) {
    console.error("Error al cancelar cita:", error.message);

    res.status(500).json({
      mensaje: "No se pudo cancelar la cita",
    });
  }
});

// Iniciar el servidor

// ==========================================
// MÓDULO DE ÓRDENES DE SERVICIO
// ==========================================

// Consultar órdenes registradas
app.get("/api/ordenes", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT
          o.id_orden,
          o.id_cliente,
          o.id_empleado,
          o.id_cita,
          o.fecha_servicio,
          o.observaciones,
          o.total,
          o.estado,
          c.nombre_completo AS cliente,
          e.nombre_completo AS empleado,
          COALESCE(
            json_agg(
              json_build_object(
                'id_servicio', d.id_servicio,
                'nombre', s.nombre,
                'cantidad', d.cantidad,
                'precio', d.precio_aplicado
              )
            ) FILTER (WHERE d.id_detalle IS NOT NULL),
            '[]'
          ) AS servicios
       FROM orden_servicio o
       INNER JOIN cliente c ON o.id_cliente = c.id_cliente
       INNER JOIN empleado e ON o.id_empleado = e.id_empleado
       LEFT JOIN detalle_orden d ON o.id_orden = d.id_orden
       LEFT JOIN servicio s ON d.id_servicio = s.id_servicio
       WHERE o.id_negocio = 1
       GROUP BY o.id_orden, c.nombre_completo, e.nombre_completo
       ORDER BY o.id_orden DESC`,
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar órdenes:", error.message);
    res.status(500).json({ mensaje: "No se pudieron consultar las órdenes" });
  }
});

// Registrar una nueva orden
app.post("/api/ordenes", async (req, res) => {
  const {
    id_cliente,
    id_empleado,
    id_cita,
    fecha_servicio,
    observaciones,
    detalles,
  } = req.body;

  if (
    !id_cliente ||
    !id_empleado ||
    !Array.isArray(detalles) ||
    detalles.length === 0
  ) {
    return res.status(400).json({
      mensaje:
        "Debes seleccionar un cliente, un empleado y al menos un servicio",
    });
  }

  const conexion = await pool.connect();

  try {
    await conexion.query("BEGIN");

    const cliente = await conexion.query(
      "SELECT id_cliente FROM cliente WHERE id_cliente = $1 AND id_negocio = 1 AND estado = 'Activo'",
      [id_cliente],
    );

    const empleado = await conexion.query(
      "SELECT id_empleado FROM empleado WHERE id_empleado = $1 AND id_negocio = 1 AND estado = 'Activo'",
      [id_empleado],
    );

    if (cliente.rowCount === 0 || empleado.rowCount === 0) {
      await conexion.query("ROLLBACK");
      return res
        .status(400)
        .json({ mensaje: "El cliente o empleado no es válido" });
    }

    if (id_cita) {
      const cita = await conexion.query(
        `SELECT id_cita FROM cita
         WHERE id_cita = $1
           AND id_negocio = 1
           AND id_cliente = $2
           AND estado NOT IN ('Cancelada', 'No asistió')
           AND NOT EXISTS (
             SELECT 1 FROM orden_servicio WHERE id_cita = $1
           )`,
        [id_cita, id_cliente],
      );

      if (cita.rowCount === 0) {
        await conexion.query("ROLLBACK");
        return res.status(400).json({
          mensaje:
            "La cita no existe, no corresponde al cliente o ya tiene una orden",
        });
      }
    }

    let total = 0;
    const serviciosValidados = [];

    for (const detalle of detalles) {
      const cantidad = Number(detalle.cantidad);
      const idServicio = Number(detalle.id_servicio);

      if (
        !Number.isInteger(cantidad) ||
        cantidad <= 0 ||
        !Number.isInteger(idServicio)
      ) {
        await conexion.query("ROLLBACK");
        return res
          .status(400)
          .json({ mensaje: "Los datos de los servicios no son válidos" });
      }

      const servicio = await conexion.query(
        `SELECT id_servicio, precio_base
         FROM servicio
         WHERE id_servicio = $1 AND id_negocio = 1 AND estado = 'Activo'`,
        [idServicio],
      );

      if (servicio.rowCount === 0) {
        await conexion.query("ROLLBACK");
        return res
          .status(400)
          .json({ mensaje: "Uno de los servicios no está disponible" });
      }

      const precio = Number(servicio.rows[0].precio_base);
      total += precio * cantidad;

      serviciosValidados.push({
        id_servicio: idServicio,
        cantidad,
        precio,
      });
    }

    const nuevaOrden = await conexion.query(
      `INSERT INTO orden_servicio
       (id_negocio, id_cliente, id_empleado, id_cita, fecha_servicio, observaciones, total)
       VALUES (1, $1, $2, $3, COALESCE($4::timestamp, CURRENT_TIMESTAMP), $5, $6)
       RETURNING id_orden`,
      [
        id_cliente,
        id_empleado,
        id_cita || null,
        fecha_servicio || null,
        observaciones || null,
        total,
      ],
    );

    const idOrden = nuevaOrden.rows[0].id_orden;

    for (const detalle of serviciosValidados) {
      await conexion.query(
        `INSERT INTO detalle_orden
         (id_orden, id_servicio, cantidad, precio_aplicado)
         VALUES ($1, $2, $3, $4)`,
        [idOrden, detalle.id_servicio, detalle.cantidad, detalle.precio],
      );
    }

    await conexion.query("COMMIT");

    res.status(201).json({
      mensaje: "Orden registrada correctamente",
      id_orden: idOrden,
      total,
    });
  } catch (error) {
    await conexion.query("ROLLBACK");
    console.error("Error al registrar orden:", error.message);
    res.status(500).json({ mensaje: "No se pudo registrar la orden" });
  } finally {
    conexion.release();
  }
});

// Editar una orden de servicio
app.put("/api/ordenes/:id", async (req, res) => {
  const conexion = await pool.connect();

  try {
    const { id } = req.params;
    const {
      id_cliente,
      id_empleado,
      id_cita,
      fecha_servicio,
      observaciones,
      detalles,
    } = req.body;

    if (
      !id_cliente ||
      !id_empleado ||
      !Array.isArray(detalles) ||
      detalles.length === 0
    ) {
      return res.status(400).json({
        mensaje: "Completa el cliente, empleado y al menos un servicio",
      });
    }

    await conexion.query("BEGIN");

    const orden = await conexion.query(
      `SELECT estado FROM orden_servicio
       WHERE id_orden = $1 AND id_negocio = 1
       FOR UPDATE`,
      [id],
    );

    if (orden.rows.length === 0) {
      await conexion.query("ROLLBACK");
      return res.status(404).json({ mensaje: "Orden no encontrada" });
    }

    if (["Completada", "Anulada"].includes(orden.rows[0].estado)) {
      await conexion.query("ROLLBACK");
      return res.status(400).json({
        mensaje: "No se pueden editar órdenes completadas o anuladas",
      });
    }

    if (id_cita) {
      const cita = await conexion.query(
        `SELECT id_cita FROM cita
         WHERE id_cita = $1 AND id_cliente = $2`,
        [id_cita, id_cliente],
      );

      if (cita.rows.length === 0) {
        await conexion.query("ROLLBACK");
        return res.status(400).json({
          mensaje: "La cita no corresponde al cliente seleccionado",
        });
      }

      const citaUsada = await conexion.query(
        `SELECT id_orden FROM orden_servicio
         WHERE id_cita = $1 AND id_orden <> $2`,
        [id_cita, id],
      );

      if (citaUsada.rows.length > 0) {
        await conexion.query("ROLLBACK");
        return res.status(400).json({
          mensaje: "Esta cita ya está asociada a otra orden",
        });
      }
    }

    let total = 0;

    for (const detalle of detalles) {
      const servicio = await conexion.query(
        `SELECT precio_base FROM servicio
         WHERE id_servicio = $1 AND id_negocio = 1 AND estado = 'Activo'`,
        [detalle.id_servicio],
      );

      if (servicio.rows.length === 0) {
        await conexion.query("ROLLBACK");
        return res.status(400).json({
          mensaje: "Uno de los servicios no está disponible",
        });
      }

      const cantidad = Number(detalle.cantidad);
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        await conexion.query("ROLLBACK");
        return res.status(400).json({
          mensaje: "La cantidad debe ser un número entero mayor que cero",
        });
      }

      total += Number(servicio.rows[0].precio_base) * cantidad;
    }

    await conexion.query(
      `UPDATE orden_servicio
       SET id_cliente = $1,
           id_empleado = $2,
           id_cita = $3,
           fecha_servicio = COALESCE($4::timestamp, fecha_servicio),
           observaciones = $5,
           total = $6
       WHERE id_orden = $7 AND id_negocio = 1`,
      [
        id_cliente,
        id_empleado,
        id_cita || null,
        fecha_servicio || null,
        observaciones || null,
        total,
        id,
      ],
    );

    await conexion.query("DELETE FROM detalle_orden WHERE id_orden = $1", [id]);

    for (const detalle of detalles) {
      const servicio = await conexion.query(
        `SELECT precio_base FROM servicio
         WHERE id_servicio = $1 AND id_negocio = 1 AND estado = 'Activo'`,
        [detalle.id_servicio],
      );

      await conexion.query(
        `INSERT INTO detalle_orden
         (id_orden, id_servicio, cantidad, precio_aplicado)
         VALUES ($1, $2, $3, $4)`,
        [
          id,
          detalle.id_servicio,
          Number(detalle.cantidad),
          servicio.rows[0].precio_base,
        ],
      );
    }

    await conexion.query("COMMIT");

    res.json({ mensaje: "Orden actualizada correctamente" });
  } catch (error) {
    await conexion.query("ROLLBACK");
    console.error("Error al editar orden:", error);
    res.status(500).json({ mensaje: "No se pudo actualizar la orden" });
  } finally {
    conexion.release();
  }
});

// Cambiar el estado de una orden
app.patch("/api/ordenes/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ["Registrada", "Completada", "Anulada"];

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ mensaje: "Estado no válido" });
    }

    const resultado = await pool.query(
      `UPDATE orden_servicio
       SET estado = $1
       WHERE id_orden = $2 AND id_negocio = 1
       RETURNING id_orden, estado`,
      [estado, id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: "Orden no encontrada" });
    }

    res.json({
      mensaje: "Estado actualizado correctamente",
      orden: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({ mensaje: "No se pudo cambiar el estado" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor OrdenOne ejecutándose en http://localhost:${PORT}`);
});
