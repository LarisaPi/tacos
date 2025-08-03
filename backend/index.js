// backend/index.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 🔍 Logger de todas las peticiones
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.url}`);
  next();
});

// Ruta raíz
app.get("/", (req, res) => {
  res.send("¡Backend está vivo en /!");
});

// Ruta de prueba de BD
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET contenido completo de inicio
app.get("/api/contenido-inicio", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contenido_inicio ORDER BY tipo, orden ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener contenido:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT para actualizar un bloque (portada o galería)
app.put("/api/contenido-inicio/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, texto, imagen } = req.body;
  try {
    const result = await pool.query(
      `UPDATE contenido_inicio
         SET titulo = $1,
             texto  = $2,
             imagen = $3
       WHERE id = $4
       RETURNING *`,
      [titulo, texto, imagen, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar contenido:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST para crear un nuevo bloque de galería
app.post("/api/contenido-inicio", async (req, res) => {
  const { tipo, titulo, texto, imagen, orden } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO contenido_inicio(tipo, titulo, texto, imagen, orden)
       VALUES($1, $2, $3, $4, $5)
       RETURNING *`,
      [tipo, titulo, texto, imagen, orden]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear contenido:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// 🔹 Obtener comentarios de un local específico
app.get("/api/locales/:localId/comentarios", async (req, res) => {
  const { localId } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.*, l.nombre_local AS local_nombre
       FROM comentarios c
       JOIN locales l ON l.id = c.local_id
       WHERE c.local_id = $1
       ORDER BY c.created_at DESC`,
      [localId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener comentarios:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Agregar comentario a un local
app.post("/api/locales/:localId/comentarios", async (req, res) => {
  const { localId } = req.params;
  const { texto, calificacion } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO comentarios(local_id, texto, calificacion)
       VALUES($1, $2, $3) RETURNING *`,
      [localId, texto, calificacion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al agregar comentario:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Eliminar comentario por ID
app.delete('/api/comentarios/:id', async (req, res) => {
  const { id } = req.params;
  const userId = Number(req.headers['x-user-id']);
  const role   = req.headers['x-user-role'];

  try {
    const { rows } = await pool.query(
      'SELECT usuario_id FROM comentarios WHERE id=$1',
      [id]
    );
    if (!rows.length) return res.status(404).end();

    const ownerId = rows[0].usuario_id;
    if (role !== 'admin' && userId !== ownerId) {
      return res.status(403).json({ error: 'Sin permiso' });
    }

    await pool.query('DELETE FROM comentarios WHERE id=$1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// —————————————————————————————————————————————————————————————
// GET /api/contenido-inicio
// Devuelve sabores (con id, sabor e imagen) y tacos (con id, sabor, precio, descripción, imagen)
// —————————————————————————————————————————————————————————————
app.get('/api/contenido-inicio', async (req, res) => {
  try {
    const saboresPromise = pool.query(
      'SELECT id, sabor, imagen FROM taco ORDER BY sabor'
    )
    const tacosPromise = pool.query(
      `SELECT
         id,
         sabor,
         descripcion,
         precio,
         imagen
       FROM taco
       ORDER BY sabor`
    )

    const [saboresRes, tacosRes] = await Promise.all([saboresPromise, tacosPromise])
    res.json({
      sabores: saboresRes.rows,
      tacos:   tacosRes.rows
    })
  } catch (err) {
    console.error('Error cargando contenido inicial:', err)
    res.status(500).json({ error: 'Error al cargar contenido inicial' })
  }
})

// —————————————————————————————————————————————————————————————
// GET /api/sabores
// Lista sabores con sus imágenes
// —————————————————————————————————————————————————————————————
app.get('/api/sabores', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        sabor   AS label,
        precio,
        imagen
      FROM taco
      ORDER BY sabor
    `)
    console.log('[GET /api/sabores] →', rows)  // debe salir con precio e imagen
    res.json(rows)
  } catch (err) {
    console.error('Error al obtener sabores:', err)
    res.status(500).json({ error: 'Error al obtener sabores.' })
  }
})

// —————————————————————————————————————————————————————————————
// GET /api/tacos
// Lista todos los tacos con precio, descripción e imagen
// —————————————————————————————————————————————————————————————
app.get('/api/tacos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        sabor,
        descripcion,
        precio,
        imagen
      FROM taco
      ORDER BY sabor
    `)
    res.json(rows)
  } catch (err) {
    console.error('Error al obtener tacos:', err)
    res.status(500).json({ error: 'Error al obtener tacos' })
  }
})

// —————————————————————————————————————————————————————————————
// POST /api/pedido
// Crea un nuevo pedido y calcula total en servidor
// —————————————————————————————————————————————————————————————
app.post('/api/pedido', async (req, res) => {
  const {
    id_cliente,
    nombre,
    telefono,
    direccion = {},
    fecha_entrega,
    hora_entrega,
    productos = []
  } = req.body

  if (
    !id_cliente ||
    !nombre ||
    !telefono ||
    !Array.isArray(productos) ||
    productos.length === 0
  ) {
    return res.status(400).json({ error: 'Datos de pedido incompletos' })
  }

  const {
    calle = '',
    colonia = '',
    ciudad = '',
    cp = '',
    estado = ''
  } = direccion

  const fechaHora =
    fecha_entrega && hora_entrega
      ? `${fecha_entrega} ${hora_entrega}`
      : new Date().toISOString()

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 1) Traer precios de los tacos
    const ids = productos.map(p => p.id_taco)
    const { rows: tacosDb } = await client.query(
      'SELECT id, precio FROM taco WHERE id = ANY($1)',
      [ids]
    )
    const precioMap = tacosDb.reduce((m, t) => {
      m[t.id] = t.precio
      return m
    }, {})

    // 2) Calcular total en servidor
    const totalCalculado = productos.reduce((sum, { id_taco, cantidad }) => {
      const precio = precioMap[id_taco]
      if (precio == null) throw new Error(`Taco ${id_taco} no encontrado`)
      if (cantidad <= 0) throw new Error(`Cantidad inválida para taco ${id_taco}`)
      return sum + precio * cantidad
    }, 0)

    // 3) Insertar pedido
    const insertPedidoSQL = `
      INSERT INTO pedido (
        fk_cliente,
        nombre_cliente,
        telefono,
        direccion_calle,
        direccion_colonia,
        direccion_ciudad,
        direccion_cp,
        direccion_estado,
        fecha,
        total
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id
    `
    const insertPedidoParams = [
      id_cliente,
      nombre,
      telefono,
      calle,
      colonia,
      ciudad,
      cp,
      estado,
      fechaHora,
      totalCalculado
    ]
    const { rows } = await client.query(insertPedidoSQL, insertPedidoParams)
    const idPedido = rows[0].id

    // 4) Insertar detalles
    const insertDetalleSQL = `
      INSERT INTO pedido_taco (fk_pedido, fk_taco, cantidad)
      VALUES ($1, $2, $3)
    `
    for (const { id_taco, cantidad } of productos) {
      await client.query(insertDetalleSQL, [idPedido, id_taco, cantidad])
    }

    await client.query('COMMIT')
    res.json({
      message: 'Pedido creado correctamente',
      id_pedido: idPedido,
      total: totalCalculado
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error al crear pedido:', err)
    res.status(500).json({ error: err.message || 'Error interno al guardar pedido' })
  } finally {
    client.release()
  }
})

// —————————————————————————————————————————————————————————————
// GET /api/pedidos
// Lista todos los pedidos (resumen sencillo)
// —————————————————————————————————————————————————————————————
app.get('/api/pedidos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        p.id,
        p.nombre_cliente,
        p.telefono,
        p.estado_id,                       -- <— lo añadimos
        p.total,
        COALESCE(SUM(pt.cantidad), 0) AS total_items
      FROM pedido p
      LEFT JOIN pedido_taco pt ON pt.fk_pedido = p.id
      GROUP BY p.id
      ORDER BY p.fecha DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error listando pedidos:', err);
    res.status(500).json({ error: 'Error al listar pedidos' });
  }
});

// —————————————————————————————————————————————————————————————
// GET /api/pedidos/full
// Pedidos completos con items (incluye imagen), estado y ubicación
// —————————————————————————————————————————————————————————————
async function fullPedidosHandler(req, res) {
  const { rol, id } = req.params  // `nombre` llega pero no se usa
  try {
    // Base del SELECT con vendedor y orden por ID ascendente
    let query = `
      SELECT
        p.id               AS id_pedido,
        ep.nombre          AS estado_envio,
        p.nombre_cliente   AS cliente,
        -- Vendedor asignado, si existe
        COALESCE(u.nombre || ' ' || u.apellidos, '') AS vendedor,
        p.telefono         AS telefono_cliente,
        TO_CHAR(p.fecha,'YYYY-MM-DD HH24:MI') AS fecha_hora,
        CONCAT_WS(', ',
          p.direccion_calle,
          p.direccion_colonia,
          'CP ' || p.direccion_cp,
          p.direccion_ciudad,
          p.direccion_estado
        ) AS ubicacion,
        COALESCE(
          json_agg(
            json_build_object(
              'sabor',    t.sabor,
              'cantidad', pt.cantidad
            )
          ) FILTER (WHERE pt.fk_taco IS NOT NULL),
          '[]'
        ) AS items,
        p.total
      FROM pedido p
      LEFT JOIN pedido_taco pt   ON pt.fk_pedido = p.id
      LEFT JOIN taco t           ON t.id        = pt.fk_taco
      LEFT JOIN estado_pedido ep ON ep.id       = p.estado_id
      -- LEFT JOIN a usuario y asignaciones para obtener vendedor
      LEFT JOIN asignaciones a   ON a.pedido_id = p.id
      LEFT JOIN usuario u        ON a.trabajador = u.nombre || ' ' || u.apellidos
    `

    const condiciones = []
    const valores     = []

    if (rol === 'cliente') {
      condiciones.push('p.fk_cliente = $1')
      valores.push(Number(id))
    }
    else if (rol === 'vendedor') {
      // filtrar por id de vendedor
      condiciones.push('u.id = $1')
      valores.push(Number(id))
    }
    // admin: sin condiciones

    if (condiciones.length) {
      query += ' WHERE ' + condiciones.join(' AND ')
    }
    // ordenar por id ascendente
    query += ' GROUP BY p.id, ep.nombre, u.nombre, u.apellidos ORDER BY p.id ASC'

    const { rows } = await pool.query(query, valores)
    res.json(rows)
  } catch (err) {
    console.error('Error al obtener pedidos full:', err)
    res.status(500).json({ error: 'Error al obtener pedidos' })
  }
}

// Rutas: opcional nombre al final
app.get('/api/pedidos/full/:rol/:id', fullPedidosHandler)
app.get('/api/pedidos/full/:rol/:id/:nombre', fullPedidosHandler)



// —————————————————————————————————————————————————————————————
// GET /api/pedidos/:id
// Cabecera de un pedido por id
// —————————————————————————————————————————————————————————————
app.get('/api/pedidos/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        nombre_cliente,
        telefono,
        direccion_calle,
        direccion_colonia,
        direccion_ciudad,
        direccion_cp,
        direccion_estado,
        TO_CHAR(fecha,'YYYY-MM-DD HH24:MI') AS fecha,
        total,
        estado_id
      FROM pedido
      WHERE id = $1
    `, [id])

    if (!rows.length) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error('Error al obtener pedido:', err)
    res.status(500).json({ error: 'Error al obtener pedido' })
  }
})

// —————————————————————————————————————————————————————————————
// GET /api/pedidos/:id/sabores
// Detalle de sabores con imagen, precio y cantidad por pedido
// —————————————————————————————————————————————————————————————
app.get('/api/pedidos/:id/sabores', async (req, res) => {
  const pedidoId = req.params.id
  try {
    const { rows } = await pool.query(`
      SELECT
        t.sabor      AS nombre,
        t.precio     AS precio,
        t.imagen     AS imagen,
        pt.cantidad  AS cantidad
      FROM pedido_taco pt
      JOIN taco t ON t.id = pt.fk_taco
      WHERE pt.fk_pedido = $1
    `, [pedidoId])
    res.json(rows)
  } catch (err) {
    console.error('Error al obtener sabores del pedido:', err)
    res.status(500).json({ error: 'Error al obtener sabores del pedido' })
  }
})



// —————————————————————————————————————————————————————————————
// GET /api/pedidos/usuario/:id
// Pedidos de un cliente con detalle de sabores (incluye imagen)
// —————————————————————————————————————————————————————————————
app.get('/api/pedidos/usuario/:id', async (req, res) => {
  const userId = req.params.id
  try {
    const { rows } = await pool.query(`
      SELECT
        p.id,
        p.fk_cliente,
        p.nombre_cliente,
        p.telefono,
        p.direccion_calle,
        p.direccion_colonia,
        p.direccion_ciudad,
        p.direccion_cp,
        p.direccion_estado,
        TO_CHAR(p.fecha,'YYYY-MM-DD HH24:MI') AS fecha,
        p.total,
        p.estado_id,
        COALESCE(
          json_agg(
            json_build_object(
              'sabor',    t.sabor,
              'precio',   t.precio,
              'imagen',   t.imagen,
              'cantidad', pd.cantidad,
              'subtotal', t.precio * pd.cantidad
            )
          ) FILTER (WHERE pd.fk_taco IS NOT NULL),
          '[]'
        ) AS sabores
      FROM pedido p
      LEFT JOIN pedido_taco pd ON pd.fk_pedido = p.id
      LEFT JOIN taco t        ON t.id       = pd.fk_taco
      WHERE p.fk_cliente = $1
      GROUP BY
        p.id, p.fk_cliente, p.nombre_cliente,
        p.telefono, p.direccion_calle, p.direccion_colonia,
        p.direccion_ciudad, p.direccion_cp, p.direccion_estado,
        p.fecha, p.total, p.estado_id
      ORDER BY p.fecha DESC
    `, [userId])
    res.json(rows)
  } catch (err) {
    console.error('Error al obtener pedidos del usuario:', err)
    res.status(500).json({ error: 'Error al obtener pedidos del usuario' })
  }
})

// —————————————————————————————————————————————————————————————
// PUT /api/pedidos/:id/estado
// Actualiza estado de un pedido
// —————————————————————————————————————————————————————————————
app.put('/api/pedidos/:id/estado', async (req, res) => {
  const { id } = req.params
  const { estado_id } = req.body

  if (!estado_id) {
    return res.status(400).json({ error: 'Debe indicar un estado_id válido' })
  }

  try {
    const result = await pool.query(
      `UPDATE pedido
         SET estado_id = $1
       WHERE id = $2
       RETURNING *`,
      [estado_id, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error al actualizar estado:', err)
    res.status(500).json({ error: 'Error al actualizar estado del pedido' })
  }
})

// —————————————————————————————————————————————————————————————
// POST /api/pedidos/asignar/:id
// Asigna un pedido a un trabajador
// —————————————————————————————————————————————————————————————
app.post('/api/pedidos/asignar/:id', async (req, res) => {
  const { id } = req.params;
  const { trabajador } = req.body;

  if (!trabajador) {
    return res.status(400).json({ error: 'Debe indicar un trabajador' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rowCount } = await client.query(
      `UPDATE pedido
         SET estado_id = 2
       WHERE id = $1
         AND estado_id = 1`,
      [id]
    );

    if (rowCount === 0) {
      await client.query('ROLLBACK');
      return res
        .status(404)
        .json({ error: 'Pedido no encontrado o no está pendiente de asignar' });
    }

    await client.query(
      `INSERT INTO asignaciones (pedido_id, trabajador)
       VALUES ($1, $2)`,
      [id, trabajador]
    );

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error asignando pedido:', error);
    res.status(500).json({ error: 'Error al asignar pedido' });
  } finally {
    client.release();
  }
});

// —————————————————————————————————————————————————————————————
// POST /api/pedidos/confirmar/:id
// Confirma un pedido asignado
// —————————————————————————————————————————————————————————————
app.post('/api/pedidos/confirmar/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Bloqueo para evitar condiciones de carrera y validar estado
    const assignRes = await client.query(
      `SELECT confirmado
         FROM asignaciones
        WHERE pedido_id = $1
        FOR UPDATE`,
      [id]
    );

    if (assignRes.rowCount === 0) {
      throw { status: 404, message: 'No existe asignación para este pedido' };
    }
    if (assignRes.rows[0].confirmado) {
      throw { status: 409, message: 'Pedido ya fue confirmado' };
    }

    await client.query(
      `UPDATE pedido
         SET estado_id = 1
       WHERE id = $1`,
      [id]
    );

    await client.query(
      `UPDATE asignaciones
         SET confirmado = TRUE
       WHERE pedido_id = $1`,
      [id]
    );

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error confirmando pedido:', err);
    const status = err.status || 500;
    const message = err.message || 'Error al confirmar pedido';
    res.status(status).json({ error: message });
  } finally {
    client.release();
  }
});

// GET /api/vendedores
app.get('/api/vendedores', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT nombre || ' ' || apellidos AS nombre_completo
      FROM usuario
      WHERE tipo_usuario = 'vendedor'
      ORDER BY nombre, apellidos
    `);

    // rows = [{ nombre_completo: 'Juan Pérez' }, ...]
    // convertimos a un array de strings
    const lista = rows.map(r => r.nombre_completo);
    res.json(lista);
  } catch (err) {
    console.error('Error al obtener vendedores:', err);
    res.status(500).json({ error: 'Error al obtener lista de vendedores' });
  }
});

// GET /api/asignaciones
app.get('/api/asignaciones', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        a.id, 
        a.pedido_id, 
        a.trabajador, 
        a.confirmado, 
        p.nombre_cliente 
      FROM asignaciones a
      JOIN pedido p ON p.id = a.pedido_id
      ORDER BY a.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener asignaciones:', err);
    res.status(500).json({ error: 'Error al obtener asignaciones' });
  }
});

// GET /api/pedidos/vendedor/:id
app.get('/api/pedidos/vendedor/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log('Buscando pedidos asignados para vendedor con id =', id);

  try {
    const sql = `
      SELECT
        p.id, p.nombre_cliente, p.estado_id,
        p.direccion_calle, p.direccion_colonia, p.direccion_ciudad, p.direccion_cp,
        p.telefono, p.fecha, p.total
      FROM asignaciones a
      JOIN pedido p ON a.pedido_id = p.id
      JOIN usuario u ON a.trabajador = u.nombre || ' ' || u.apellidos
      WHERE u.id = $1
        AND a.confirmado = true
    `;
    const { rows } = await pool.query(sql, [id]);
    console.log('Pedidos encontrados:', rows);
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching pedidos asignados:', err);
    return res.status(500).json({ error: err.message });
  }
});




// Listar solo sabores y precios (Cotizar)
// server.js (solo UNA vez app.get('/api/sabores'))



// Listar tacos
app.get("/api/tacos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM taco");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tacos:", error);
    res.status(500).json({ error: "Error al obtener tacos." });
  }
});

// Insertar taco
app.post("/api/tacos", async (req, res) => {
  const { sabor, precio, descripcion, fk_local = 1, imagen } = req.body;
  console.log("Datos recibidos taco:", req.body);

  try {
    const result = await pool.query(
      "INSERT INTO taco (sabor, precio, descripcion, fk_local, imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [sabor, precio, descripcion, fk_local, imagen]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error al insertar taco:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Obtener taco por ID
app.get("/api/tacos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM taco WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Taco no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener taco:", error);
    res.status(500).json({ error: "Error al obtener taco." });
  }
});

// Actualizar taco
app.put("/api/tacos/:id", async (req, res) => {
  const { id } = req.params;
  const { sabor, precio, descripcion, fk_local = 1, imagen } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE taco SET
        sabor = $1,
        precio = $2,
        descripcion = $3,
        fk_local = $4,
        imagen = $5
      WHERE id = $6
      RETURNING *;
      `,
      [sabor, precio, descripcion, fk_local, imagen, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Taco no encontrado" });
    }

    res.json({ success: true, taco: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar taco:", error);
    res.status(500).json({ success: false, error: "Error al actualizar taco." });
  }
});

// Eliminar taco
app.delete("/api/tacos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("BEGIN");

    // 🧹 Elimina referencias en pedido_taco que usen ese taco
    await pool.query("DELETE FROM pedido_taco WHERE fk_taco = $1;", [id]);
    console.log("🧺 Registros en pedido_taco eliminados para taco ID:", id);

    // 🌮 Elimina el taco
    const result = await pool.query(
      "DELETE FROM taco WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rowCount === 0) {
      await pool.query("ROLLBACK");
      console.log("⚠️ Taco no encontrado");
      return res.status(404).json({ success: false, message: "Taco no encontrado" });
    }

    await pool.query("COMMIT");
    console.log("✅ Taco eliminado:", result.rows[0]);
    res.json({ success: true, message: "Taco eliminado correctamente" });

  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("❌ Error al eliminar taco:", error);
    res.status(500).json({ success: false, error: "Error al eliminar taco" });
  }
});

// Listar locales
app.get('/api/locales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locales ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener locales:', error.message);
    res.status(500).json({ error: 'Error al obtener locales.' });
  }
});

// Insertar local
app.post("/api/locales", async (req, res) => {
  const {
    nombre,
    descripcion,
    calle,
    ciudad,
    codigo_postal,
    entre_calles,
    colonia,
    fotoLocal,
    imagenUbicacion,
    fk_vendedor = 1,
    estado_provincia_zona,
  } = req.body;

  console.log("📥 BODY recibido en POST:", req.body);

  try {
    const result = await pool.query(
      `INSERT INTO locales (
         nombre_local,
         descripcion,
         calle,
         ciudad,
         codigo_postal,
         entre_calles,
         colonia,
         foto_local,
         imagen_ubicacion,
         fk_vendedor,
         estado_provincia_zona
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        nombre,
        descripcion,
        calle,
        ciudad,
        codigo_postal,
        entre_calles,
        colonia,
        fotoLocal,
        imagenUbicacion,
        fk_vendedor,
        estado_provincia_zona,
      ]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Error al insertar local:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Obtener local por ID
app.get("/api/locales/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM locales WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Local no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener local:", error);
    res.status(500).json({ error: "Error al obtener local." });
  }
});

// Actualizar local
app.put("/api/locales/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    calle,
    ciudad,
    codigo_postal,
    entre_calles,
    colonia,
    fotoLocal,
    imagenUbicacion,
    fk_vendedor,
    estado_provincia_zona,
  } = req.body;

  console.log("📥 BODY recibido en PUT:", req.body);

  try {
    const result = await pool.query(
      `UPDATE locales SET
        nombre_local = $1,
        descripcion = $2,
        calle = $3,
        ciudad = $4,
        codigo_postal = $5,
        entre_calles = $6,
        colonia = $7,
        foto_local = $8,
        imagen_ubicacion = $9,
        fk_vendedor = $10,
        estado_provincia_zona = $11
      WHERE id = $12
      RETURNING *`,
      [
        nombre,
        descripcion,
        calle,
        ciudad,
        codigo_postal,
        entre_calles,
        colonia,
        fotoLocal,
        imagenUbicacion,
        fk_vendedor,
        estado_provincia_zona,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Local no encontrado" });
    }

    res.json({ success: true, local: result.rows[0] });
  } catch (error) {
    console.error("❌ Error al actualizar local:", error);
    res.status(500).json({ success: false, error: "Error al actualizar local." });
  }
});

// Eliminar local
app.delete("/api/locales/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM locales WHERE id = $1 RETURNING *;",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Local no encontrado" });
    }
    res.json({ success: true, message: "Local eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar local:", error);
    res.status(500).json({ success: false, error: "Error al eliminar local" });
  }
});


// 🔐 Login
app.post('/api/login', async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  try {
    // Traemos solo los datos necesarios (sin la contraseña)
    const { rows } = await pool.query(
      'SELECT id, nombre, apellidos, tipo_usuario FROM usuario WHERE correo_electronico = $1',
      [correo_electronico]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Correo no encontrado' });
    }

    const user = rows[0];
    // Ahora traemos el hash
    const { rows: pwRows } = await pool.query(
      'SELECT contrasena FROM usuario WHERE id = $1',
      [user.id]
    );
    const hash = pwRows[0].contrasena;
    const match = await bcrypt.compare(contrasena, hash);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Ésta es la respuesta completa que el front espera
    res.json({
      message: 'Inicio de sesión exitoso',
      userId: user.id,
      role: user.tipo_usuario,
      nombre: `${user.nombre} ${user.apellidos}`
    });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


app.post('/api/tacos', async (req, res) => {
  const { sabor, precio, descripcion } = req.body;
  console.log('Datos recibidos:', req.body);

  try {
    const query = `
      INSERT INTO taco (sabor, precio, descripcion, fk_local)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [sabor, precio, descripcion, 1]; 

    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al insertar taco:', error);
    res.status(500).json({ success: false, error: 'Error al insertar taco.' });
  }
});

// Ruta usuarios (foto_perfil opcional)
app.post('/api/usuarios', async (req, res) => {
  const {
    nombre,
    apellidos,
    contacto,
    tipo_usuario,
    calle,
    ciudad,
    codigo_postal,
    correo_electronico,
    contrasena,
    estado_provincia_zona,
    entre_calles,
    foto_perfil = null,  
  } = req.body;

  console.log('Datos recibidos usuario:', req.body);

  try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
    const query = `
      INSERT INTO usuario (
        nombre, apellidos, contacto, tipo_usuario, calle,
        ciudad, codigo_postal, correo_electronico, contrasena,
        estado_provincia_zona, entre_calles, foto_perfil
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    const values = [
    nombre, apellidos, contacto, tipo_usuario, calle,
    ciudad, codigo_postal, correo_electronico, hashedPassword,
    estado_provincia_zona, entre_calles, foto_perfil
  ];

    const result = await pool.query(query, values);
    res.json({ success: true, usuario: result.rows[0] });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    res.status(500).json({ success: false, error: 'Hubo un problema al registrar el usuario.' });
  }
});

app.get('/api/usuarios', async (req, res) => {
  try {
    // Selecciona solo las columnas que quieres
    const resultado = await pool.query(`
      SELECT 
        id, 
        nombre, 
        correo_electronico, 
        contacto, 
        ciudad, 
        tipo_usuario, 
        foto_perfil 
      FROM usuario
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error consultando usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});


// Obtener usuario por ID (todos los campos para editar)
app.get('/api/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const resultado = await pool.query(
      `SELECT
         id,
         nombre,
         apellidos,
         contacto,
         tipo_usuario,
         calle,
         ciudad,
         codigo_postal,
         correo_electronico,
         contrasena,
         estado_provincia_zona,
         entre_calles,
         foto_perfil
       FROM usuario
       WHERE id = $1`,
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error consultando usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});


// Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellidos,
    contacto,
    tipo_usuario,
    calle,
    ciudad,
    codigo_postal,
    correo_electronico,
    contrasena, // puede venir vacío
    estado_provincia_zona,
    entre_calles,
    foto_perfil
  } = req.body;

  try {
    let query = `
      UPDATE usuario SET
        nombre = $1,
        apellidos = $2,
        contacto = $3,
        tipo_usuario = $4,
        calle = $5,
        ciudad = $6,
        codigo_postal = $7,
        correo_electronico = $8,
        estado_provincia_zona = $9,
        entre_calles = $10,
        foto_perfil = $11`;

    const values = [
      nombre, apellidos, contacto, tipo_usuario, calle,
      ciudad, codigo_postal, correo_electronico,
      estado_provincia_zona, entre_calles, foto_perfil
    ];

    // Solo actualizamos la contraseña si viene y no está vacía
    if (contrasena && contrasena.trim() !== "") {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      query += `, contrasena = $12 WHERE id = $13 RETURNING *;`;
      values.push(hashedPassword, id);
    } else {
      query += ` WHERE id = $12 RETURNING *;`;
      values.push(id);
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, usuario: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar usuario' });
  }
});
// Eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');

    console.log('🔍 Intentando eliminar usuario con ID:', id);

    const usuario = await pool.query('SELECT tipo_usuario FROM usuario WHERE id = $1;', [id]);

    if (usuario.rows.length === 0) {
      await pool.query('ROLLBACK');
      console.log('⚠️ Usuario no encontrado');
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const tipo_usuario = usuario.rows[0].tipo_usuario;
    console.log('📌 Tipo detectado:', tipo_usuario);

    // 🧹 Elimina pedidos si existen
    await pool.query('DELETE FROM pedido WHERE fk_cliente = $1;', [id]);
    console.log('🧺 Pedidos relacionados eliminados (si había)');

    // 🗑️ Elimina el usuario
    const result = await pool.query(
      'DELETE FROM usuario WHERE id = $1 RETURNING *;',
      [id]
    );

    await pool.query('COMMIT');
    console.log('✅ Usuario eliminado:', result.rows[0]);

    return res.json({ success: true, message: 'Usuario eliminado correctamente' });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('❌ Error al eliminar usuario:', error);
    return res.status(500).json({ success: false, error: 'Error al eliminar usuario' });
  }
});


app.listen(3000, () => {
  console.log("Servidor backend en http://localhost:3000");
});