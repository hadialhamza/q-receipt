import { getDB } from "./db";

/**
 * Collection names
 */
export const COLLECTIONS = {
  USERS: "users",
  RECEIPTS: "receipts",
};

/**
 * Find one document
 * @param {string} collectionName
 * @param {object} query
 * @returns {Promise<object|null>}
 */
export async function findOne(collectionName, query) {
  const db = await getDB();
  return db.collection(collectionName).findOne(query);
}

/**
 * Find multiple documents
 * @param {string} collectionName
 * @param {object} query
 * @param {object} options
 * @returns {Promise<Array>}
 */
export async function find(collectionName, query = {}, options = {}) {
  const db = await getDB();
  return db.collection(collectionName).find(query, options).toArray();
}

/**
 * Insert one document
 * @param {string} collectionName
 * @param {object} document
 * @returns {Promise<object>}
 */
export async function insertOne(collectionName, document) {
  const db = await getDB();
  const result = await db.collection(collectionName).insertOne(document);
  return { ...document, _id: result.insertedId };
}

/**
 * Update one document
 * @param {string} collectionName
 * @param {object} query
 * @param {object} update
 * @returns {Promise<object>}
 */
export async function updateOne(collectionName, query, update) {
  const db = await getDB();
  return db.collection(collectionName).updateOne(query, update);
}

/**
 * Delete one document
 * @param {string} collectionName
 * @param {object} query
 * @returns {Promise<object>}
 */
export async function deleteOne(collectionName, query) {
  const db = await getDB();
  return db.collection(collectionName).deleteOne(query);
}

/**
 * Count documents
 * @param {string} collectionName
 * @param {object} query
 * @returns {Promise<number>}
 */
export async function count(collectionName, query = {}) {
  const db = await getDB();
  return db.collection(collectionName).countDocuments(query);
}
