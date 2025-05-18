import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { parse as jsonToCsv } from "json2csv";

// AWS DocumentDB connection configuration
const dbConfig = {
  url: process.env.DOCDB_CONNECTION_STRING,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: false,
  },
};

export async function POST(request: Request) {
  try {
    const { collections } = await request.json();

    if (!Array.isArray(collections) || collections.length === 0) {
      return NextResponse.json(
        { error: "Please provide an array of collection names" },
        { status: 400 }
      );
    }

    if (!process.env.DOCDB_CONNECTION_STRING) {
      return NextResponse.json(
        { error: "Database connection string not configured" },
        { status: 500 }
      );
    }

    // Connect to DocumentDB
    const client = await MongoClient.connect(dbConfig.url!, dbConfig.options);
    const db = client.db(process.env.DOCDB_DATABASE_NAME);

    // Process each collection
    const results = [];
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();

      if (documents.length > 0) {
        // Convert to CSV
        const csv = jsonToCsv(documents);
        results.push({
          collectionName,
          csv,
          documentCount: documents.length,
        });
      }
    }

    await client.close();

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export collections" },
      { status: 500 }
    );
  }
}
