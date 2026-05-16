import { NextResponse } from "next/server";
import { Pool } from "pg";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs";

// ----------------------------------------------------------------------
// 1. Configuration
// ----------------------------------------------------------------------

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure PostgreSQL Connection (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for managed databases
});

// ----------------------------------------------------------------------
// 2. POST Route: Submit a new report
// ----------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    // 1. Check if the user is actually logged in
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please log in to submit a report." }, { status: 401 });
    }

    // Parse the incoming Form Data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const category = formData.get("category") as string | null;
    const latStr = formData.get("lat") as string | null;
    const lngStr = formData.get("lng") as string | null;
    // Extract the new description field
    const description = formData.get("description") as string | null;

    if (!imageFile || !category || !latStr || !lngStr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "civic_sense_reports",
    });
    const imageUrl = uploadResponse.secure_url;

    // 2. Add the userId AND description to the database INSERT query
    const query = `
      INSERT INTO reports (category, image_url, location, status, user_id, description)
      VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), 'open', $5, $6)
      RETURNING id, category, status;
    `;
    
    // Pass the userId as the 5th variable, and description as the 6th
    const values = [category, imageUrl, lng, lat, userId, description];
    const dbResponse = await pool.query(query, values);

    return NextResponse.json({ 
      success: true, 
      report: dbResponse.rows[0] 
    }, { status: 201 });

  } catch (error) {
    console.error("Error submitting report:", error);
    return NextResponse.json({ error: "Failed to process report" }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// 3. GET Route: Fetch nearby reports (The Local Feed)
// ----------------------------------------------------------------------
export async function GET(request: Request) {
  try {
    // Extract search parameters from the URL (e.g., ?lat=25.3&lng=82.9&radius=5000)
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    
    // Default search radius is 3000 meters (3km)
    const radiusInMeters = parseInt(searchParams.get("radius") || "3000");

    if (!latStr || !lngStr) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 });
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    // PostGIS Query with a LEFT JOIN to count upvotes
    const query = `
      SELECT 
        r.id, 
        r.category, 
        r.image_url, 
        r.status, 
        r.created_at,
        r.user_id as reporter_id,
        ST_Distance(r.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance_meters,
        COUNT(u.id) as upvotes
      FROM reports r
      LEFT JOIN upvotes u ON r.id = u.report_id
      WHERE ST_DWithin(
        r.location, 
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 
        $3
      )
      GROUP BY r.id
      ORDER BY distance_meters ASC;
    `;

    const values = [lng, lat, radiusInMeters];
    const dbResponse = await pool.query(query, values);

    return NextResponse.json({ 
      success: true, 
      reports: dbResponse.rows 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching nearby reports:", error);
    return NextResponse.json({ error: "Failed to fetch nearby reports" }, { status: 500 });
  }
}