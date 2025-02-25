import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectPost, postsTable } from '../schema';

export async function deleteUser(id: SelectPost['id']) {
  await db.delete(postsTable).where(eq(postsTable.id, id));
}

