import { serve } from '@hono/node-server';
import { app } from './main.js';
import { init } from './lib/db.js'; // <-- Bæta þessu við

// sækjum PORT úr umhverfisbreytu eða notum 3000 sem sjálfgefið gildi
const port = Number(process.env.PORT) || 3000;

init().then((ok) => {
  if (ok) {
    console.log('Gagnagrunnur (tafla) tilbúinn!');
  } else {
    console.error('Gat ekki búið til töflu í gagnagrunni!');
  }

  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
});