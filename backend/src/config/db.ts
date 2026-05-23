import mysql, {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { env } from "./env";
import { logger } from "./logger";

export type DbConnection = PoolConnection;

type SqlParam = string | number | boolean | Date | null | Buffer;
type SqlParams = SqlParam[];

const pool: Pool = mysql.createPool({
  host: env.MYSQL_HOST,
  port: env.MYSQL_PORT,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10_000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  decimalNumbers: true,
  supportBigNumbers: true,
  timezone: "Z",
});

(pool as Pool & { on(event: "connection", listener: () => void): void }).on(
  "connection",
  () => {
    logger.debug("MySQL pool connection established");
  }
);

const isResultSetHeader = (value: unknown): value is ResultSetHeader =>
  Boolean(value && typeof value === "object" && "affectedRows" in value);

export const db = {
  pool,

  async ping(): Promise<void> {
    await pool.query("SELECT 1");
  },

  async query<T = RowDataPacket[]>(
    sql: string,
    params: unknown[] = [],
    conn?: DbConnection
  ): Promise<T> {
    const executor = conn ?? pool;
    // Use query (text protocol), not execute (prepared statements).
    // Prepared LIMIT/OFFSET placeholders often trigger ER_WRONG_ARGUMENTS in mysql2.
    const [rows] = await executor.query(sql, params as SqlParams);
    if (isResultSetHeader(rows)) {
      return rows as T;
    }
    return rows as T;
  },

  async execute(
    sql: string,
    params: unknown[] = [],
    conn?: DbConnection
  ): Promise<ResultSetHeader> {
    const executor = conn ?? pool;
    const [result] = await executor.execute<ResultSetHeader>(
      sql,
      params as SqlParams
    );
    return result;
  },

  async withTransaction<T>(fn: (conn: DbConnection) => Promise<T>): Promise<T> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await fn(conn);
      await conn.commit();
      return result;
    } catch (error) {
      try {
        await conn.rollback();
      } catch (rollbackError) {
        logger.error("Failed to rollback transaction", { rollbackError });
      }
      throw error;
    } finally {
      conn.release();
    }
  },

  async shutdown(): Promise<void> {
    await pool.end();
  },
};
