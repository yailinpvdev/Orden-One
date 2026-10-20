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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor OrdenOne ejecutándose en http://localhost:${PORT}`);
});
