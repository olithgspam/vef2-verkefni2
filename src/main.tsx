import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { TodoPage } from './components/TodoPage.js';
import { listTodos, createTodo, updateTodo, deleteTodo, deleteFinishedTodos } from './lib/db.js';
import { createTodoSchema, updateTodoSchema } from './lib/validation.js';

export const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }));

app.get('/', async (c) => {
  const todos = await listTodos();
  return c.html(<TodoPage todos={todos || []} />);
});

app.post('/add', async (c) => {
  const body = await c.req.parseBody();
  const result = createTodoSchema.safeParse(body);

  if (!result.success) {
    const todos = await listTodos();
    const errorMessages = result.error.errors.map((e) => e.message);
    return c.html(<TodoPage todos={todos || []} errors={errorMessages} />);
  }

  await createTodo(result.data.title);
  return c.redirect('/');
});

app.post('/update/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.parseBody();
  const result = updateTodoSchema.safeParse(body);

  if (!result.success) {
    return c.redirect('/');
  }

  const finished = result.data.finished === 'on';
  await updateTodo(Number(id), result.data.title, finished);
  
  return c.redirect('/');
});

app.post('/delete/:id', async (c) => {
  const id = c.req.param('id');
  await deleteTodo(Number(id));
  return c.redirect('/');
});

app.post('/delete-finished', async (c) => {
  await deleteFinishedTodos();
  return c.redirect('/');
});