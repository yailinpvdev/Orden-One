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
app.listen(PORT, () => {
  console.log(`Servidor OrdenOne ejecutándose en http://localhost:${PORT}`);
});
