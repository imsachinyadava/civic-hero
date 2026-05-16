"use server";

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function getLeaderboard() {
  try {
    const query = `
      SELECT id, full_name, avatar_url, points
      FROM profiles
      ORDER BY points DESC
      LIMIT 10;
    `;
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.error("Leaderboard fetch failed:", error);
    return [];
  }
}