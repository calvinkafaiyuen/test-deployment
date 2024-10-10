"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";

export async function getResources(){    
  const session = await auth();
  const role = session?.user?.role;

  if (role === 'founder') return;
  try {  
    const statement = `SELECT id, resource_name, doc_path FROM resources WHERE ` + role + ` = TRUE ORDER BY resource_name ASC`
    const data = await query(statement);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch advisory board data.`);
  }
}
