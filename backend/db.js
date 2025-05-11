import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define path to JSON file
const filePath = join(__dirname, 'db.json');
const adapter = new JSONFile(filePath);

// ✅ Pass adapter and *defaultData* to Low
const db = new Low(adapter, { users: [], inventory: [] });

// Read DB and ensure structure is set
await db.read();

// Optional: write default structure if file is empty
if (!db.data) {
  db.data = { users: [], inventory: [] };
  await db.write();
}

if (!db.data.users) db.data.users = [];
if (!db.data.inventory) db.data.inventory = [];


export default db;
