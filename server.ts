import express, { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import todosRoutes from './routes/todos';

const app = express();
const port = 3000;
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Connect to the PostgreSQL database
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

app.use('/api/todo', todosRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// POST: Insert sample data
app.get('/api/todo/datafeed', async (req, res) => {
    const sampleData = [
        { title: 'Sample 1', description: 'This is sample 1', status: true, created_at: new Date(), updated_at: new Date() },
        { title: 'Sample 2', description: 'This is sample 2', status: false, created_at: new Date(), updated_at: new Date() },
        { title: 'Sample 3', description: 'This is sample 3', status: true, created_at: new Date(), updated_at: new Date() },
        // Add more sample data as needed
    ];

    for (const item of sampleData) {
        await pool.query('INSERT INTO to_do_list (title, description, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)', [item.title, item.description, item.status, item.created_at, item.updated_at]);
    }

    res.json({ message: 'Sample data inserted' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});