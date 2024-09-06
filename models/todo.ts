import { Todo } from '../interfaces';
import { pool } from '../server';

export const getAllTodos = (): Promise<Todo[]> => {
    return pool.query('SELECT * FROM to_do_list')
        .then(result => result.rows)
        .catch(err => {
            console.error(err);
            throw new Error('An error occurred while querying the databaeeeeeeeeeeeeeeeeeeeeeese');
        });
};

export const createTodo = (todo: { title: string, description: string, status: boolean }): Promise<Todo> => {
    const { title, description, status } = todo;
    return pool.query('INSERT INTO to_do_list (title, description, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, status, new Date(), new Date()])
        .then(result => {
          return result.rows[0];
        })
        .catch(err => {
            console.error(err);
            throw new Error('An error occurred while creating the todo');
        });
};

export const updateTodo = async (hash: string, todo: { status: boolean }): Promise<Todo> => {
    const { status } = todo;
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
      const result = await client.query('UPDATE to_do_list SET status = $1 WHERE hash = $2 RETURNING *', [status, hash]);
      await client.query('COMMIT');
  
      if (!result || !result.rows || result.rows.length === 0) {
        throw new Error('No rows returned from update query');
      }
  
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      throw new Error('An error occurred while updating the todo');
    } finally {
      client.release();
    }
  };

export const deleteTodo = async (hash: string): Promise<boolean> => {
    const { rowCount } = await pool.query('DELETE FROM to_do_list WHERE hash = $1', [hash]);
    return rowCount !== null && rowCount > 0;
  };

export const feedData = (): Promise<void> => {
    const sampleData = [
        { title: 'Sample 1', description: 'This is sample 1', status: true, created_at: new Date(), updated_at: new Date() },
        { title: 'Sample 2', description: 'This is sample 2', status: false, created_at: new Date(), updated_at: new Date() },
        { title: 'Sample 3', description: 'This is sample 3', status: true, created_at: new Date(), updated_at: new Date() },
        // Add more sample data as needed
    ];

    const promises = sampleData.map(data => createTodo(data));

    return Promise.all(promises)
        .then(() => { })
        .catch(err => {
            console.error(err);
            throw new Error('An error occurred while feeding data');
        });
};