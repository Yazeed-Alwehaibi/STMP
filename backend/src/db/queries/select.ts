import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema/users';

export async function getUserById(id: SelectUser['UserID']): Promise<
  Array<{
    UserID: number;
    name: string;
    email: string;
    role: string;
    department: string | null;
    extrainfo: string | null;
    status: string | null;
  }>
> {
  const result = await db.select().from(usersTable).where(eq(usersTable.UserID, id));
  return result.map(user => ({
    UserID: user.UserID,
    name: user.UserName,
    email: user.Email,
    role: user.Role,
    department: user.DepartmentOrMajor,
    extrainfo: user.ExtraInfo,
    status: user.Status,
  }));
}
