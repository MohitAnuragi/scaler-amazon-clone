import { randomUUID } from "crypto";
import { db } from "../config/db";
import { mapUserRow, UserRow } from "../utils/rowMappers";

export class UserRepository {
  async findByEmail(email: string) {
    const rows = await db.query<UserRow[]>(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const row = rows[0];
    return row ? mapUserRow(row) : null;
  }

  async findById(id: string) {
    const rows = await db.query<UserRow[]>(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    const row = rows[0];
    return row ? mapUserRow(row) : null;
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }) {
    const id = randomUUID();
    await db.execute(
      "INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
      [id, data.email, data.passwordHash, data.firstName, data.lastName]
    );
    return this.findById(id);
  }

  async updateLastLoginAt(id: string, timestamp: Date) {
    await db.execute("UPDATE users SET last_login_at = ? WHERE id = ?", [
      timestamp,
      id,
    ]);
    return this.findById(id);
  }
}

export const userRepository = new UserRepository();
