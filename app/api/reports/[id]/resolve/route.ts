import { NextResponse } from "next/server";
import { Pool } from "pg";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs";

// Database Connection
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
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "Resolution image is required" }, { status: 400 });
    }

    // 1. Upload the new "After" image to Cloudinary
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "civic_sense_resolutions",
    });
    const resolvedImageUrl = uploadResponse.secure_url;

    // 2. Update the database to mark it resolved
    const query = `
      UPDATE reports 
      SET status = 'resolved', resolved_image_url = $1 
      WHERE id = $2
      RETURNING id, status;
    `;
    
    await pool.query(query, [resolvedImageUrl, reportId]);

    return NextResponse.json({ success: true, message: "Issue marked as resolved!" }, { status: 200 });

  } catch (error) {
    console.error("Error resolving issue:", error);
    return NextResponse.json({ error: "Failed to resolve issue" }, { status: 500 });
  }
}