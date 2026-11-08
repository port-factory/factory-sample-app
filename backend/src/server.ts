import { createApp } from './app.js';
import { createPool, migrate } from './db.js';
import { InMemoryTaskRepository } from './tasks/memoryRepository.js';
import { PgTaskRepository } from './tasks/pgRepository.js';
import { seed } from './tasks/seed.js';
import type { TaskRepository } from './tasks/types.js';

// Without DATABASE_URL the server runs in demo mode: in-memory storage with sample tasks.
async function createRepository(): Promise<TaskRepository> {
  if (!process.env.DATABASE_URL) {
    const repo = new InMemoryTaskRepository();
    await seed(repo);
    console.log('DATABASE_URL not set: running in demo mode with in-memory sample tasks');
    return repo;
  }
  const pool = createPool();
  await migrate(pool);
  return new PgTaskRepository(pool);
}

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3000);
createApp(await createRepository()).listen(port, () => {
  console.log(`backend listening on :${port}`);
});
