import { db } from '../index';
import {  InsertUser,  usersTable } from '../schema/users';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}


