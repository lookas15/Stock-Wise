import { join, dirname } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../db/inventory.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read();
db.data ||= { inventory: [] };
await db.write();

export default db;
