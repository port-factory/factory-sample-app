import { createApp } from './app.js';
import { createPool, migrate } from './db.js';
import { PgTaskRepository } from './tasks/pgRepository.js';

const pool = createPool();
await migrate(pool);

const port = Number(process.env.PORT ?? 3000);
createApp(new PgTaskRepository(pool)).listen(port, () => {
  console.log(`backend listening on :${port}`);
});
