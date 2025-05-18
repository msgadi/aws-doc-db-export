import { NextResponse } from "next/server";
import { getCollections } from "@/lib/db";

export async function GET() {
  try {
    console.log("API: Fetching collections...");
    const collections = await getCollections();
    console.log("API: Found collections:", collections);
    return NextResponse.json({ collections });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
