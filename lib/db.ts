import { MongoClient } from "mongodb";

// MongoDB Configuration from environment variables
const config = {
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  host: process.env.MONGODB_HOST,
  port: process.env.MONGODB_PORT,
  database: process.env.MONGODB_DATABASE,
};

// Build connection URL from config or use direct URI if provided
const url =
  process.env.MONGODB_URI ||
  `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/`;

let client: MongoClient | null = null;

export async function connectToDatabase() {
  try {
    // Check if we already have a connected client
    if (client) {
      return client;
    }

    console.log("Attempting to connect to MongoDB...");

    // Connection options
    const options = {
      ssl: process.env.AWS_DOCDB_SSL === "true",
      retryWrites: false, // DocumentDB doesn't support retryWrites
    };

    client = new MongoClient(url, options);
    await client.connect();
    console.log("Successfully connected to MongoDB");

    // Verify database access
    const db = client.db(config.database);
    await db.command({ ping: 1 });
    console.log(`Successfully connected to database: ${config.database}`);

    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function getCollectionStats(collectionName: string) {
  try {
    const client = await connectToDatabase();
    const db = client.db(config.database);
    const stats = await db.command({ collStats: collectionName });

    return {
      documentCount: stats.count || 0,
      sizeInMB: Math.round(((stats.size || 0) / (1024 * 1024)) * 100) / 100, // Convert to MB and round to 2 decimal places
    };
  } catch (error) {
    console.error(
      `Error getting stats for collection ${collectionName}:`,
      error
    );
    return {
      documentCount: 0,
      sizeInMB: 0,
    };
  }
}

export async function getCollections() {
  try {
    console.log("Getting database client...");
    const client = await connectToDatabase();
    console.log("Getting database reference...");
    const db = client.db(config.database);
    console.log("Listing collections...");
    const collections = await db.listCollections().toArray();

    // Get stats for each collection
    const collectionsWithStats = await Promise.all(
      collections.map(async (collection) => {
        const stats = await getCollectionStats(collection.name);
        return {
          name: collection.name,
          ...stats,
        };
      })
    );

    console.log("Found collections with stats:", collectionsWithStats);
    return collectionsWithStats;
  } catch (error) {
    console.error("Error in getCollections:", error);
    throw error;
  }
}

export async function getCollectionData(collectionName: string) {
  const client = await connectToDatabase();
  const db = client.db(config.database);
  const collection = db.collection(collectionName);
  return collection.find({}).toArray();
}
