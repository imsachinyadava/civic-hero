"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function syncProfile() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) return null;

  try {
    // Check if profile exists
    const checkQuery = `SELECT * FROM profiles WHERE id = $1`;
    const existing = await pool.query(checkQuery, [userId]);

    if (existing.rows.length === 0) {
      // Create new profile
      const insertQuery = `
        INSERT INTO profiles (id, full_name, avatar_url, points)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const fullName = `${user.firstName} ${user.lastName}`;
      const res = await pool.query(insertQuery, [userId, fullName, user.imageUrl, 10]); // Give 10 starter points!
      return res.rows[0];
    }

    return existing.rows[0];
  } catch (error) {
    console.error("Profile sync failed:", error);
    return null;
  }
}