import { NextResponse } from "next/server";
import { Pool } from "pg";
import { auth } from "@clerk/nextjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const reportId = parseInt(params.id);
    const query = `SELECT * FROM comments WHERE report_id = $1 ORDER BY created_at ASC`;
    const dbResponse = await pool.query(query, [reportId]);
    return NextResponse.json({ comments: dbResponse.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await request.json();
    const reportId = parseInt(params.id);

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    const query = `
      INSERT INTO comments (report_id, user_id, text) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const dbResponse = await pool.query(query, [reportId, userId, text]);

    return NextResponse.json({ comment: dbResponse.rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}