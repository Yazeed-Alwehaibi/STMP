import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['UserID']) {
  await db.delete(usersTable).where(eq(usersTable.UserID, id));
}

