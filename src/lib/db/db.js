import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the connection
  // across module reloads caused by HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new MongoClient instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Get database instance
 * @returns {Promise<import('mongodb').Db>}
 */
export async function getDB() {
  const client = await clientPromise;
  return client.db("qreceipt");
}

/**
 * Connect to MongoDB
 * @returns {Promise<import('mongodb').MongoClient>}
 */
export async function connectDB() {
  return clientPromise;
}

export default clientPromise;
