import { randomUUID } from "crypto";
import { db } from "../config/db";
import { ApiError } from "../utils/apiError";
import { AddressRow, mapAddressRow } from "../utils/rowMappers";

export type AddressInput = {
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault?: boolean;
};

export class AddressRepository {
  async getByUser(userId: string) {
    const rows = await db.query<AddressRow[]>(
      "SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return rows.map(mapAddressRow);
  }

  async findById(userId: string, addressId: string) {
    const rows = await db.query<AddressRow[]>(
      "SELECT * FROM addresses WHERE id = ? AND user_id = ? LIMIT 1",
      [addressId, userId]
    );
    const row = rows[0];
    return row ? mapAddressRow(row) : null;
  }

  async create(data: AddressInput) {
    return db.withTransaction(async (conn) => {
      const id = randomUUID();
      if (data.isDefault) {
        await db.execute(
          "UPDATE addresses SET is_default = 0 WHERE user_id = ?",
          [data.userId],
          conn
        );
      }

      await db.execute(
        "INSERT INTO addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, pincode, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          data.userId,
          data.fullName,
          data.phone,
          data.addressLine1,
          data.addressLine2 ?? null,
          data.city,
          data.state,
          data.pincode,
          data.country ?? "India",
          data.isDefault ? 1 : 0,
        ],
        conn
      );

      return this.findById(data.userId, id);
    });
  }

  async update(userId: string, addressId: string, data: Partial<AddressInput>) {
    return db.withTransaction(async (conn) => {
      const existing = await this.findById(userId, addressId);
      if (!existing) {
        throw new ApiError(404, "Address not found");
      }

      if (data.isDefault) {
        await db.execute(
          "UPDATE addresses SET is_default = 0 WHERE user_id = ?",
          [userId],
          conn
        );
      }

      await db.execute(
        "UPDATE addresses SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), address_line1 = COALESCE(?, address_line1), address_line2 = COALESCE(?, address_line2), city = COALESCE(?, city), state = COALESCE(?, state), pincode = COALESCE(?, pincode), country = COALESCE(?, country), is_default = COALESCE(?, is_default) WHERE id = ? AND user_id = ?",
        [
          data.fullName ?? null,
          data.phone ?? null,
          data.addressLine1 ?? null,
          data.addressLine2 ?? null,
          data.city ?? null,
          data.state ?? null,
          data.pincode ?? null,
          data.country ?? null,
          data.isDefault !== undefined ? (data.isDefault ? 1 : 0) : null,
          addressId,
          userId,
        ],
        conn
      );

      return this.findById(userId, addressId);
    });
  }

  async delete(userId: string, addressId: string) {
    const result = await db.execute(
      "DELETE FROM addresses WHERE id = ? AND user_id = ?",
      [addressId, userId]
    );
    if (!result.affectedRows) {
      throw new ApiError(404, "Address not found");
    }
    return { deleted: true };
  }

  async setDefault(userId: string, addressId: string) {
    return db.withTransaction(async (conn) => {
      const existing = await this.findById(userId, addressId);
      if (!existing) {
        throw new ApiError(404, "Address not found");
      }

      await db.execute(
        "UPDATE addresses SET is_default = 0 WHERE user_id = ?",
        [userId],
        conn
      );

      await db.execute(
        "UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?",
        [addressId, userId],
        conn
      );

      return this.findById(userId, addressId);
    });
  }
}

export const addressRepository = new AddressRepository();
