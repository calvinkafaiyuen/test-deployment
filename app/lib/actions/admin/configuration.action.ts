"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";
import { generateLikeClause, generateParameters } from "./(utils)/helpers";
import { deleteHandler } from "./(utils)/delete.action";

export async function configurationsHandler (configuration_option: string, searchQuery: string, status: string = 'all') {
    const session = await auth();
    if (session?.user?.role != 'admin') {
        return 'Your permission does not allow access to this information.';
    }
    switch(configuration_option) {
        case 'manage-cohorts':
            return await getManageCohorts(searchQuery);
        case 'authority-setting':
            return await getAuthtoritySetting(searchQuery);
        default:
            return [];
    }
}

async function getManageCohorts(searchQuery: string){

    const AgColumnDefs = [
        { headerName: 'Year', field: 'name' },
        { headerName: 'Cohort Start Date', field: 'start_date', editable: true },
        { headerName: 'Cohort End Date', field: 'end_date', editable: true },
        { headerName: 'Registration Start Date', field: 'registration_start_date', editable: true },
        { headerName: 'Registration End Date', field: 'registration_end_date', editable: true },
        { headerName: 'Demo Day Date', field: 'demo_day_date', editable: true },
        { headerName: 'Demo Day Location', field: 'demo_day_location', editable: true },
        { headerName: 'Demo Day Time', field: 'demo_day_time', editable: true },
        { headerName: 'Active', field: 'isActive' },
        { headerName: 'Limit Team Searches', field: 'limit_team_searches' },
        { headerName: 'Limit Individual Searches', field: 'limit_individual_searches' },
        { headerName: 'isolated', field: 'isolated', editable: true },
        { headerName: 'max_contacts', field: 'max_contacts' },
        { headerName: 'uoft', field: 'uoft' }
    ];    

    try {

        const searchColumns = [
            "name",
            "start_date",
            "end_date",
            "registration_start_date",
            "registration_end_date",
            "demo_day_date",
            "demo_day_location",
            "demo_day_time",
            "'isActive'",
            "limit_team_searches",
            "limit_individual_searches",
            "isolated",
            "max_contacts",
            "uoft"
        ];

        const statement = `
            SELECT * 
            FROM cohorts
            WHERE ${generateLikeClause(searchColumns)}`;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch cohorts data.`);
    }
}

async function getAuthtoritySetting(searchQuery: string){

    const AgColumnDefs = [
        { headerName: 'ID', field: 'id', filter: 'agTextColumnFilter', width: 180, editable: true, checkboxSelection: true, sort: 'asc' },
        { headerName: 'Date Submitted', filter: 'agTextColumnFilter', width: 180, field: 'date_submitted', editable: false },
        { headerName: 'User', filter: 'agTextColumnFilter', width: 180, field: 'email', editable: false },
        { headerName: 'Super Admin(E)', filter: 'agTextColumnFilter', width: 180, field: 'super_admin', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['yes', 'no'] } },
        { headerName: 'Admin(E)', filter: 'agTextColumnFilter', width: 180, field: 'admin', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['yes', 'no'] } },
        { headerName: 'Editor(E)', filter: 'agTextColumnFilter', width: 180, field: 'editor', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['yes', 'no'] } },
        { headerName: 'Viewer(E)', filter: 'agTextColumnFilter', width: 180, field: 'viewer', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['yes', 'no'] } },
        { headerName: 'Restricted Access', filter: 'agTextColumnFilter', width: 500, field: 'tables_access', editable: true }
    ];
    
    try {

        const searchColumns = [
            "id",
            "email",
            "super_admin",
            "admin",
            "editor",
            "viewer",
            "date_submitted",
            "tables_access"
        ];

        const statement = `
            SELECT * 
            FROM authority_setting 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY id DESC`;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch authority data.`);
    }   
}

export async function deleteConfigurationHandler(selectedRowsData: any, option: string) {
  
  const optionToTable = {
    "manage-cohorts": "cohorts",
    "authority-setting": "authority_setting"
  }
  
  const optionToPrimaryKey = {
    "manage-cohorts": "name",
    "authority-setting": "id"
  }

  return await deleteHandler(selectedRowsData, option, optionToTable, optionToPrimaryKey);
}