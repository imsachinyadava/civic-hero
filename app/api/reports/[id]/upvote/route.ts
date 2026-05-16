import { NextResponse } from "next/server";
import { Pool } from "pg";
import { auth } from "@clerk/nextjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reportId = parseInt(params.id);

    // 1. Start a transaction (optional but safer for multiple updates)
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // 2. Try to insert the upvote
      const upvoteQuery = `
        INSERT INTO upvotes (report_id, user_id) 
        VALUES ($1, $2)
        RETURNING id;
      `;
      await client.query(upvoteQuery, [reportId, userId]);

      // 3. Reward the user with 5 Civic Points
      const pointsQuery = `
        UPDATE profiles 
        SET points = points + 5 
        WHERE id = $1;
      `;
      await client.query(pointsQuery, [userId]);

      await client.query('COMMIT');
      
      return NextResponse.json(
        { success: true, message: "Verification added! +5 Points earned." }, 
        { status: 201 }
      );

    } catch (innerError: any) {
      await client.query('ROLLBACK');
      
      // Check for unique constraint violation (user already voted)
      if (innerError.code === '23505') {
        return NextResponse.json(
          { error: "You have already verified this issue." }, 
          { status: 400 }
        );
      }
      throw innerError; // Pass to outer catch for 500 error
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error("Error upvoting:", error);
    return NextResponse.json({ error: "Failed to add upvote." }, { status: 500 });
  }
}