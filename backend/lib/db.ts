import { db } from "./databases";

export async function getConnection() {
  return await db.getConnection();
}
