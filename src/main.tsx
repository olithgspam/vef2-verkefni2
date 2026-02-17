import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { TodoPage } from './components/TodoPage.js';
import { listTodos } from './lib/db.js';
export const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }));

app.get('/', async (c) => {
  const todos = await listTodos();
  
  return c.html(<TodoPage todos={todos || []} />);
});