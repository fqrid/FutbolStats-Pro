const express = require('express');
const pool = require('./config/db');

const app = express();
app.use(express.json());

// Inicializar la base de datos al arrancar (crear tabla y sembrar datos si está vacía)
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS equipos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        puntos INT DEFAULT 0,
        diferencia_goles INT DEFAULT 0
      );
    `);
    const res = await pool.query('SELECT COUNT(*) FROM equipos');
    if (parseInt(res.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO equipos (nombre, puntos, diferencia_goles) VALUES 
        ('ITP F.C.', 9, 5),
        ('Real Madrid', 6, 2),
        ('Barcelona F.C.', 4, 1),
        ('Arsenal', 3, -1);
      `);
      console.log('🌱 Base de datos inicializada y sembrada con datos de prueba.');
    }
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
};

initDB();

// Endpoint de Salud para Render (Health Check)
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'UP', database: 'CONNECTED' });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', error: error.message });
  }
});

// Obtener tabla de posiciones
app.get('/api/posiciones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM equipos ORDER BY puntos DESC, diferencia_goles DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tabla de posiciones' });
  }
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;