import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'movie_tracker_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Successfully connected to MySQL database!');
  }
});

// MOVIE CRUD ROUTES (Week 6)

// Create
app.post('/api/movies', (req, res) => {
  const { title, genre } = req.body;
  const query = 'INSERT INTO movies (title, genre) VALUES (?, ?)';

  db.query(query, [title, genre], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ message: 'Movie added successfully!', id: result.insertId });
  });
});

// Read
app.get('/api/movies', (req, res) => {
  const query = 'SELECT * FROM movies';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(200).json(results);
  });
});

// Update
app.put('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title, genre } = req.body;
  const query = 'UPDATE movies SET title = ?, genre = ? WHERE id = ?';

  db.query(query, [title, genre, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json({ message: 'Movie updated successfully!' });
  });
});

// Delete
app.delete('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM movies WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json({ message: 'Movie deleted successfully!' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
