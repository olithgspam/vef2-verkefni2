import pg from 'pg';
import type { Todo } from '../types.js';

function getPool(): pg.Pool {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }
  return new pg.Pool({ connectionString: DATABASE_URL });
}

async function query<T extends pg.QueryResultRow>(
  q: string,
  values: unknown[] = [],
): Promise<pg.QueryResult<T> | null> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    return await client.query<T>(q, values);
  } catch (err) {
    console.error('Database query error', err);
    return null;
  } finally {
    client.release();
  }
}

export async function init(): Promise<boolean> {
  try {
    const result = await query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        finished BOOLEAN NOT NULL DEFAULT false,
        created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    return result !== null;
  } catch (e) {
    console.error('Error initializing database', e);
    return false;
  }
}

export async function listTodos(): Promise<Todo[] | null> {
  const q = 'SELECT id, title, finished, created FROM todos ORDER BY finished ASC, created DESC';
  try {
    const result = await query<Todo>(q);
    if (result) {
      return result.rows;
    }
  } catch (e) {
    console.error('Error fetching todos', e);
  }
  return null;
}

export async function createTodo(title: string): Promise<Todo | null> {
  const q = 'INSERT INTO todos (title) VALUES ($1) RETURNING id, title, finished, created';
  try {
    const result = await query<Todo>(q, [title]);
    if (result && result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error creating todo', e);
  }
  return null;
}

export async function updateTodo(
  id: number,
  title: string,
  finished: boolean,
): Promise<Todo | null> {
  const q = 'UPDATE todos SET title = $1, finished = $2 WHERE id = $3 RETURNING id, title, finished, created';
  try {
    const result = await query<Todo>(q, [title, finished, id]);
    if (result && result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error updating todo', e);
  }
  return null;
}

export async function deleteTodo(id: number): Promise<boolean | null> {
  const q = 'DELETE FROM todos WHERE id = $1';
  try {
    const result = await query(q, [id]);
    return (result?.rowCount ?? 0) > 0;
  } catch (e) {
    console.error('Error deleting todo', e);
    return null;
  }
}

export async function deleteFinishedTodos(): Promise<number | null> {
  const q = 'DELETE FROM todos WHERE finished = true';
  try {
    const result = await query(q);
    return result?.rowCount ?? 0;
  } catch (e) {
    console.error('Error deleting finished todos', e);
    return null;
  }
}