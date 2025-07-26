// backend/index.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt'); 

const app = express();
app.use(cors());
app.use(express.json());


app.post('/api/login', async (req, res) => {
  const { correo_electronico, contrasena } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuario WHERE correo_electronico = $1',
      [correo_electronico]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Correo no encontrado' });
    }

    const user = result.rows[0];

   
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      userId: user.id,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
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
    const query = 'DELETE FROM usuario WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar usuario' });
  }
});


app.listen(3000, () => {
  console.log('Servidor backend en http://localhost:3000');
});
