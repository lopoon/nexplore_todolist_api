jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [{ status: true }] }),
      release: jest.fn(),
    }),
    query: jest.fn().mockResolvedValue({ rows: [{ status: true }] }),
  };
  return { Pool: jest.fn(() => mPool) };
});

import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../todo';
import { pool } from '../../server';

// Mock pool.query
(pool.query as jest.Mock) = jest.fn();

// Define mockConnect and mockClient
const mockConnect = jest.fn();
const mockClient = {
  query: jest.fn().mockResolvedValue({ rows: [] }),
  release: jest.fn()  // Add this line
};

// Mock pool.query and pool.connect
(pool.query as jest.Mock) = jest.fn().mockResolvedValue({ rows: [] });
(pool.connect as jest.Mock) = jest.fn().mockResolvedValue(mockClient);

describe('getAllTodos', () => {
  it('gets all todos', () => {
    // Arrange
    const mockTodos = [{ id: 1, title: 'Test Todo', description: 'This is a test todo' }];
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockTodos });

    // Act
    const resultPromise = getAllTodos();

    // Assert
    return resultPromise.then(result => {
      expect(result).toEqual(mockTodos);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM to_do_list');
    });
  });
});

describe('createTodo', () => {
  it('creates a new todo', () => {
    // Arrange
    const mockTodo = { title: 'Test Todo', description: 'This is a test todo1', status: false };
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockTodo] });

    // Act
    const resultPromise = createTodo(mockTodo);

    // Assert
    return resultPromise.then(result => {
      expect(result).toEqual(mockTodo);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO to_do_list (title, description, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [mockTodo.title, mockTodo.description, mockTodo.status, expect.any(Date), expect.any(Date)]
      );
    });
  });
});


afterEach(() => {
  jest.clearAllMocks();
});