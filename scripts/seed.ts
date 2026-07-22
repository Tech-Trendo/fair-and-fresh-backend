import { loadEnvConfig } from '@next/env';

// Load environment variables from .env files FIRST before importing db module
loadEnvConfig(process.cwd());

async function main() {
  const { seedDatabase, postgresClient } = await import('../lib/db');
  try {
    await seedDatabase();
  } catch (error) {
    console.error('❌ Error during seed process:', error);
    process.exit(1);
  } finally {
    if (postgresClient) {
      await postgresClient.end();
    }
    process.exit(0);
  }
}

main();
