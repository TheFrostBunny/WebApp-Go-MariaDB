const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importer cors
require('dotenv').config({ path: '../.env' });

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(cors()); // Aktiver CORS for alle forespørsel
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected as ID', connection.threadId);
});

// Velkommen til API-et
app.get('/', (req, res) => {
  res.send('Velkommen til REST APIet!');
});

// Hent alle to-do-elementer
app.get('/todos', (req, res) => {
  connection.query('SELECT * FROM todos', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

// Legg til et nytt to-do-element
app.post('/todos', (req, res) => {
  const { task } = req.body;
  connection.query('INSERT INTO todos (task) VALUES (?)', [task], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(201).json({ id: results.insertId, task, completed: false });
  });
});

// Hent spesifikt to-do-element
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM todos WHERE id = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'To-do-element ikke funnet' });
    }
    res.json(results[0]);
  });
});

// Oppdater et to-do-element
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  connection.query('UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, id], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ message: 'To-do-element oppdatert' });
  });
});

// Slett et to-do-element
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM todos WHERE id = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ message: 'To-do-element slettet' });
  });
});

// Start serveren
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
