import { sql } from "@vercel/postgres";
// import {about_us_members} from primsa

export async function fetchAboutUsTeam() {
  try {
    const team_member =
      await sql`SELECT * from about_us_members where type='TEAM'`; //string
    return team_member;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchAboutUsAdivsory() {
  try {
    const team_member =
      await sql`SELECT * from about_us_members where type='ADVISORY BOARD'`; //string
    return team_member;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}
