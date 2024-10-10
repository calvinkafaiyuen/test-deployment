"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";

export async function deleteHandler(selectedRowsData: any, option: string, optionToTable: any, optionToPrimaryKey: any) {
  const session = await auth();
  if (session?.user?.role != 'admin') {
      return 'Your permission does not allow access to this information.';
  }

  try {

    const table = optionToTable[option as keyof typeof optionToTable];
    const primaryKey = optionToPrimaryKey[option as keyof typeof optionToPrimaryKey];

    const statement = `
        DELETE FROM ${table} 
        WHERE ${primaryKey} = ANY($1::int[])
        RETURNING *`

    const values = selectedRowsData.map((row: { [key: string]: any }) => row[primaryKey]);

    const res = await query(statement, [values]);
    return res;

  } catch (error) {
      console.error('Database Error:', error);
      throw new Error(`Failed to delete program applications.`);
  }
}