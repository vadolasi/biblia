import { Database } from "bun:sqlite";

const dbFile = new Database("src/lib/database/bible.db");
const db = Database.deserialize(new Uint8Array(dbFile.serialize()), true);

export default db;
