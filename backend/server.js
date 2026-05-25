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

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;

  const query = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';

  db.query(query, [username, password], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ message: 'User added successfully!' });
  });
});

app.post('/api/login', (req, res) => {
  res.status(200).json({
    message: 'Login successful',
    token: 'dummy-token-for-testing'
  });
});

app.post('/api/movies', (req, res) => {
  const { title, genre } = req.body;

  const query = 'INSERT INTO movies (title, genre) VALUES (?, ?)';

  db.query(query, [title, genre], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ message: 'Movie added successfully!' });
  });
});

app.get('/api/users', (req, res) => {
  const query = 'SELECT id, username FROM users';

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(200).json(results);
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
