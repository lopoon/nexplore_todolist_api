// routes/todos.ts
import { Router } from 'express';
import { getAllTodos, createTodo, updateTodo, deleteTodo, feedData } from '../models/todo';

const router = Router();

router.get('/', (req, res) => {
  getAllTodos()
    .then(todos => res.json(todos))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', (req, res) => {
  const { title, description, status } = req.body;

  // Check if title, description, and status are not null or undefined
  if (!title || !description || status === undefined) {
    return res.status(400).json({ 
      error: 'Missing required todo fields', 
      data: { title, description, status } // Include the values in the error message
    });
  }

  createTodo(req.body)
    .then(todo => res.json(todo))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.put('/:hash', (req, res) => {
  updateTodo(req.params.hash, req.body)
    .then(todo => res.json(todo))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.delete('/:hash', (req, res) => {
  deleteTodo(req.params.hash)
    .then(() => res.json({ message: 'To-do item deleted' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/datafeed', (req, res) => {
  feedData()
    .then(() => res.json({ message: 'Data feed successful' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

export default router;