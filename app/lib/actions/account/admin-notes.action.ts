"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";
import { redirect } from 'next/navigation';
import { z } from "zod";
const path = require('path');
const fs = require('fs');

export async function getAdminNotes(team_id: number){    
  const session = await auth();
  if (session?.user?.role != 'admin') {
    redirect('/')
  }

  try {
    const statement = `
      SELECT id AS note_id, title, notes, creator, created_on, last_editor, last_edit_on
             FROM team_notes
             WHERE team_id = $1
             ORDER BY created_on DESC
    `;
    const data = await query(statement, [team_id]);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch startup profile data.`);
  }
}

export async function createAdminNote(team_id: number, title: string, notes: string) {
  const session = await auth();
  if (session?.user?.role != 'admin') {
    return 'Your permission does not allow this action.';
  }
  const creator = session?.user?.email;
  const curr_date: Date = new Date();

  try {
    const statement = `
      INSERT INTO team_notes (team_id, title, notes, creator, created_on, last_editor, last_edit_on)
      VALUES ($1, $2, $3, $4, $5, $4, $5)
    `;
    const data = await query(statement, [team_id, title, notes, creator, curr_date]);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch startup profile data.`);
  }
}

export async function editAdminNote(note_id: number, title: string, notes: string) {
  const session = await auth();
  if (session?.user?.role != 'connector') {
    return 'Your permission does not allow this action.';
  }
  const editor = session?.user?.email;
  const curr_date: Date = new Date();

  try {
    const statement = `
      UPDATE team_notes
      SET title = $1, notes = $2, last_editor = $3, last_edit_on = $4  WHERE id = $5
    `;
    const data = await query(statement, [title, notes, editor, curr_date, note_id]);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch startup profile data.`);
  }
}

export async function deleteAdminNote(note_id: number) {
  try {
    const statement = `
      DELETE FROM team_notes WHERE id = $1
    `;
    await query(statement, [note_id]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch startup profile data.`);
  }
}