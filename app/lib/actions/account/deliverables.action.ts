"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";
import { z } from "zod";
const path = require('path');
const fs = require('fs');

export async function getDeliverables(team_id: number){    
  const session = await auth();
  const role = session?.user?.role;

  try {  
    const statement = `SELECT id, business_plan, cash_flow, one_pager, pitch_deck, hatchery_mining, business_plan_date, cash_flow_date, one_pager_date, pitch_deck_date, hatchery_mining_date
                       FROM team_deliverables
                       WHERE team_id = $1`
    const data = await query(statement, [team_id]);
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch advisory board data.`);
  }
}

const FormSchema = z.object({
  businessPlan: z.nullable(z.object({
    size: z.number(),
    type: z.string(),
    name: z.string(),
    lastModified: z.number()
  })),
  cashflow: z.nullable(z.object({
    size: z.number(),
    type: z.string(),
    name: z.string(),
    lastModified: z.number()
  })),
  onePager: z.nullable(z.object({
    size: z.number(),
    type: z.string(),
    name: z.string(),
    lastModified: z.number()
  })),
  pitchDeck: z.nullable(z.object({
    size: z.number(),
    type: z.string(),
    name: z.string(),
    lastModified: z.number()
  })),
  hatcheryMining: z.nullable(z.object({
    size: z.number(),
    type: z.string(),
    name: z.string(),
    lastModified: z.number()
  }))
})

export async function uploadDeliverables(team_id: number, formData: FormData){    
  const session = await auth();
  if (session?.user?.role != 'admin' && session?.user?.role != 'founder' && session?.user?.role != 'connector') {
    return 'Your permission does not allow this action.';
  }

  team_id = 2147

  let formObject = {
    businessPlan: formData.get("businessPlan"),
    cashflow: formData.get("cashflow"),
    onePager: formData.get("onePager"),
    pitchDeck: formData.get("pitchDeck"),
    hatcheryMining: formData.get("hatcheryMining"),
  };

  const validatedFields = FormSchema.safeParse(formObject);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to submit application.",
    };
  }

  let statement = 'UPDATE team_deliverables SET ';
  let params = [];
  let paramIndex = 1
  const curr_date: Date = new Date();

  console.log(team_id);

  try {
    let business_plan_path, cashflow_path, one_pager_path, pitch_deck_path, hatchery_mining_path = ''

    if (formObject.businessPlan) {
      const document = formObject.businessPlan as File;
      business_plan_path = '/startup_files/business_plans/startup_' + team_id + '.' + document.type.split('/')[1]
      await saveFile(document, 'public' + business_plan_path);
      statement += `business_plan = $${paramIndex}, business_plan_date = $${paramIndex + 1}`;
      params.push(business_plan_path, curr_date);
      paramIndex += 2;
    }

    if (formObject.cashflow) {
      const document = formObject.cashflow as File;
      cashflow_path = '/startup_files/cashflows/startup_' + team_id + '.' + document.type.split('/')[1]
      await saveFile(document, 'public' + cashflow_path);
      if (paramIndex > 1) statement += `, `;
      statement += `cash_flow = $${paramIndex}, cash_flow_date = $${paramIndex + 1}`;
      params.push(cashflow_path, curr_date);
      paramIndex += 2;
    }
  
    if (formObject.pitchDeck) {
      const document = formObject.pitchDeck as File;
      one_pager_path = '/startup_files/pitch_decks/startup_' + team_id + '.' + document.type.split('/')[1]
      await saveFile(document, 'public' + one_pager_path);
      if (paramIndex > 1) statement += `, `;
      statement += `pitch_deck = $${paramIndex}, pitch_deck_date = $${paramIndex + 1}`;
      params.push(one_pager_path, curr_date);
      paramIndex += 2;
    }

    if (formObject.onePager) {
      const document = formObject.onePager as File;
      pitch_deck_path = '/startup_files/one_pagers/startup_' + team_id + '.' + document.type.split('/')[1]
      await saveFile(document, 'public' + pitch_deck_path);
      if (paramIndex > 1) statement += `, `;
      statement += `one_pager = $${paramIndex}, one_pager_date = $${paramIndex + 1}`;
      params.push(pitch_deck_path, curr_date);
      paramIndex += 2;
    }

    if (formObject.hatcheryMining) {
      const document = formObject.hatcheryMining as File;
      hatchery_mining_path = '/startup_files/one_pagers/startup_' + team_id + '.' + document.type.split('/')[1]
      await saveFile(document, 'public' + hatchery_mining_path);
      if (paramIndex > 1) statement += `, `;
      statement += `hatchery_mining = $${paramIndex}, hatchery_mining_date = $${paramIndex + 1}`;
      params.push(hatchery_mining_path, curr_date);
      paramIndex += 2;
    }

    if (paramIndex > 1) {
      statement += ` WHERE team_id = ${team_id}`;
      await query(statement, params);
      console.log('success')
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to patch startup profile data.`);
  }
}

async function saveFile(file: File, dest: string) {
  const filePath = path.join(process.cwd(), dest);
  const fileBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(fileBuffer));
}
