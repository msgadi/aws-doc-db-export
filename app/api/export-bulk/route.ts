import { NextRequest } from "next/server";
import { getCollectionData } from "@/lib/db";
import { stringify } from "csv-stringify/sync";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
  try {
    const { collections } = await request.json();

    if (!Array.isArray(collections) || collections.length === 0) {
      return Response.json(
        { error: "No collections specified" },
        { status: 400 }
      );
    }

    // Create a new ZIP file
    const zip = new JSZip();

    // Process each collection
    for (const collection of collections) {
      try {
        const data = await getCollectionData(collection);

        // Convert data to CSV
        const csvContent = stringify(data, {
          header: true,
          columns: Object.keys(data[0] || {}),
        });

        // Add CSV to ZIP with just the collection name
        zip.file(`${collection}.csv`, csvContent);
      } catch (error) {
        console.error(`Error processing collection ${collection}:`, error);
        // Continue with other collections even if one fails
      }
    }

    // Generate ZIP file
    const zipContent = await zip.generateAsync({ type: "uint8array" });

    // Create response with ZIP content
    return new Response(zipContent, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="collections-export-${new Date().toISOString()}.zip"`,
      },
    });
  } catch (error) {
    console.error("Error in bulk export:", error);
    return Response.json(
      { error: "Failed to process bulk export" },
      { status: 500 }
    );
  }
}
