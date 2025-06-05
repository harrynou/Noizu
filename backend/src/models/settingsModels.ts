import pool from "../config/db";
import { NotFoundError } from "../utils/errors";

export const updateEmailandPassword = async (userId: number, email: string, hashed_password: string): Promise<void> => {
  try {
    await pool.query("UPDATE users SET email = $1, hashed_password = $2 WHERE user_id = $3", [
      email,
      hashed_password,
      userId,
    ]);
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (userId: number, hashed_password: string): Promise<void> => {
  try {
    const result = await pool.query("UPDATE users SET hashed_password = $1 WHERE user_id = $2", [
      hashed_password,
      userId,
    ]);
    if (result.rowCount !== 1) {
      throw NotFoundError;
    }
    return;
  } catch (error) {
    throw error;
  }
};

export const insertProvider = async (
  user_id: number,
  provider: string,
  providerUserId: string,
  refresh_token: string,
  premium: boolean
): Promise<void> => {
  try {
    let provider_column: string;
    if (provider === "spotify") {
      provider_column = "spotify_account_id";
    } else if (provider === "soundcloud") {
      provider_column = "soundcloud_account_id";
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    const results = await pool.query(
      "INSERT INTO linked_accounts (user_id,provider,provider_user_id,refresh_token, premium) VALUES ($1,$2,$3,$4,$5) RETURNING account_id",
      [user_id, provider, providerUserId, refresh_token, premium]
    );
    const provider_account_id = results.rows[0].account_id;
    await pool.query(`UPDATE users SET ${provider_column} = $1 WHERE user_id = $2`, [provider_account_id, user_id]);
  } catch (error) {
    throw error;
  }
};

export const removeProvider = async (provider: string, userId: number) => {
  try {
    const result = await pool.query("DELETE FROM linked_accounts WHERE user_id = $1 AND provider = $2", [
      userId,
      provider,
    ]);
    if (result.rowCount !== 1) {
      throw NotFoundError;
    }
  } catch (error) {
    throw error;
  }
};
