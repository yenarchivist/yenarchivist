import { Client, Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

export async function getAssets(filters = {}) {
  const queries = [Query.orderDesc("$createdAt"), Query.limit(100)];
  if (filters.project) queries.push(Query.equal("project", filters.project));
  if (filters.type) queries.push(Query.equal("type", filters.type));
  if (filters.status) queries.push(Query.equal("status", filters.status));
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, queries);
  return res.documents;
}

export async function createAsset(data) {
  return await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), data);
}

export async function updateAsset(id, data) {
  return await databases.updateDocument(DB_ID, COLLECTION_ID, id, data);
}

export async function deleteAsset(id) {
  return await databases.deleteDocument(DB_ID, COLLECTION_ID, id);
}
export const CALENDAR_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CALENDAR_COLLECTION_ID;

export async function getCalendarItems() {
  const res = await databases.listDocuments(DB_ID, CALENDAR_COLLECTION_ID, [
    Query.orderAsc("publish_at"),
    Query.limit(100)
  ]);
  return res.documents;
}

export async function createCalendarItem(data) {
  return await databases.createDocument(DB_ID, CALENDAR_COLLECTION_ID, ID.unique(), data);
}

export async function updateCalendarItem(id, data) {
  return await databases.updateDocument(DB_ID, CALENDAR_COLLECTION_ID, id, data);
}

export async function deleteCalendarItem(id) {
  return await databases.deleteDocument(DB_ID, CALENDAR_COLLECTION_ID, id);
}