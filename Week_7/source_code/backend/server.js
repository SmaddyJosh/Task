import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// AUTHENTICATION ROUTES (Week 7)

app.post('/api/signup', async (req, res) => {
  const { username, password, role } = req.body;
  const userRole = role || 'client'; // Default to client if no role provided

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const query = 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)';
    db.query(query, [username, passwordHash, userRole], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.status(201).json({ message: 'User added successfully!' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role
    });
  });
});

// MOVIE CRUD ROUTES (Week 6)

// Create
app.post('/api/movies', authenticateToken, (req, res) => {
  const { title, genre } = req.body;
  const query = 'INSERT INTO movies (title, genre) VALUES (?, ?)';

  db.query(query, [title, genre], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ message: 'Movie added successfully!', id: result.insertId });
  });
});

// Read
app.get('/api/movies', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM movies';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(200).json(results);
  });
});

// Update
app.put('/api/movies/:id', authenticateToken, (req, res) => {
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
app.delete('/api/movies/:id', authenticateToken, (req, res) => {
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
