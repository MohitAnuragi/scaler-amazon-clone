import fs from "fs";
import path from "path";
import { db } from "../src/config/db";
import { logger } from "../src/config/logger";

const schemaPath = path.resolve(__dirname, "..", "sql", "schema.mysql.sql");
const raw = fs.readFileSync(schemaPath, "utf8").replace(/\r\n/g, "\n");

const stripLeadingComments = (statement: string) =>
  statement.replace(/^(?:\s*--[^\n]*\n)+/g, "").trim();

const statements = raw
  .split(/;\s*\n/)
  .map((stmt) => stripLeadingComments(stmt.trim()))
  .filter((stmt) => stmt.length > 0);

const main = async () => {
  for (const statement of statements) {
    await db.query(statement);
  }
  logger.info("MySQL schema initialized", { statementCount: statements.length });
  await db.shutdown();
};

main().catch(async (error) => {
  logger.error("Failed to initialize MySQL schema", { error });
  await db.shutdown();
  process.exit(1);
});
