import Database from "better-sqlite3";
import fs from "fs";

const db = new Database("portfolio.db");
const rows = db.prepare("SELECT * FROM content").all();
const content = rows.reduce((acc, row) => {
  acc[row.key] = row.value;
  return acc;
}, {});

fs.writeFileSync("db_dump.json", JSON.stringify(content, null, 2));
console.log("Database dumped to db_dump.json");
