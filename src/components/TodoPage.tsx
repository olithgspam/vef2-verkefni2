import type { FC } from 'hono/jsx';
import type { Todo } from '../types.js';

type TodoPageProps = {
  todos: Todo[];
  errors?: string[];
};

export const TodoPage: FC<TodoPageProps> = ({ todos, errors = [] }) => {
  const hasFinishedTodos = todos.some((t) => t.finished);

  return (
    <html>
      <head>
        <title>Verkefnalisti</title>
        <link rel="stylesheet" href="/static/styles.css" />
      </head>
      <body>
        <main>
          <h1>Verkefnalisti</h1>

          {errors.length > 0 && (
            <div className="errors">
              {errors.map((error) => (
                <p key={error} style={{ color: 'red' }}>{error}</p>
              ))}
            </div>
          )}

          <form action="/add" method="POST" className="add-form">
            <input type="text" name="title" placeholder="Hvað þarf að gera?" required />
            <button type="submit">Bæta við</button>
          </form>

          {hasFinishedTodos && (
            <form action="/delete-finished" method="POST" className="delete-finished-form">
              <button type="submit" className="danger-btn">Eyða kláruðum verkefnum</button>
            </form>
          )}

          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.finished ? 'finished' : ''}>
                <form action={`/update/${todo.id}`} method="POST" className="item-form">
                  <input 
                    type="checkbox" 
                    name="finished" 
                    checked={todo.finished} 
                    onChange="this.form.submit()"
                  />
                  <input 
                    type="text" 
                    name="title" 
                    value={todo.title} 
                  />
                  <button type="submit">Uppfæra</button>
                </form>

                <form action={`/delete/${todo.id}`} method="POST" className="delete-form">
                  <button type="submit" aria-label="Eyða">🗑️</button>
                </form>
              </li>
            ))}
          </ul>
          
          {todos.length === 0 && <p className="empty-state">Engin verkefni... bættu einu við!</p>}
        </main>
      </body>
    </html>
  );
};