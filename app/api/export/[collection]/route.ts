import { type NextRequest } from "next/server";
import { getCollectionData } from "@/lib/db";
import { stringify } from "csv-stringify/sync";

export async function GET(
  request: NextRequest,
  context: { params: { collection: string } }
) {
  try {
    // Properly await the params as required by Next.js
    const params = await Promise.resolve(context.params);
    const collection = params.collection;

    const data = await getCollectionData(collection);

    // Convert data to CSV
    const csvContent = stringify(data, {
      header: true,
      columns: Object.keys(data[0] || {}),
    });

    // Create response with CSV content
    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${collection}-${new Date().toISOString()}.csv"`,
      },
    });
  } catch (error) {
    console.error(`Error exporting collection:`, error);
    return Response.json(
      { error: "Failed to export collection" },
      { status: 500 }
    );
  }
}
