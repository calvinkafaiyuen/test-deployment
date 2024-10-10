"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";
import { generateLikeClause, generateParameters } from "./(utils)/helpers";
import { deleteHandler } from "./(utils)/delete.action";

export async function evangelismHandler (evangelism_option: string, searchQuery: string, status: string = 'all') {
    const session = await auth();
    if (session?.user?.role != 'admin') {
        return 'Your permission does not allow access to this information.';
    }
    switch(evangelism_option) {
        case 'event-logs':
            return await getEventLogs(searchQuery);
        case 'share-your-problems':
            return await getShareYourProblems(searchQuery);
        case 'user-logs':
            return await getUserLogs(searchQuery);
        case 'magic-links':
            return await getMagicLinks(searchQuery);
        default:
            return [];
    }
}

async function getEventLogs(searchQuery: string){

    const AgColumnDefs = [
        { headerName: 'ID(P)', field: 'id', checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, width: 150, filter: 'agTextColumnFilter' },
        { headerName: 'Name(E)', cellEditorPopup: true, field: 'name', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Date', field: 'date', filter: 'agDateColumnFilter', width: 150 },
        { headerName: 'Speaker', field: 'speakers', filter: 'agTextColumnFilter' },
        { headerName: 'Attendance', cellEditorPopup: true, field: 'attendance', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, width: 200 },
        { headerName: 'Location', field: 'location', filter: 'agNumberColumnFilter', width: 100 },
        { headerName: 'Image', field: 'event_image_path', filter: 'agTextColumnFilter', width: 150 },
        { headerName: 'Type', field: 'type', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, width: 200 },
    ];

    try {

        const searchColumns = [
            "id",
            "name",
            "type",
            "speakers",
            "attendance",
            "date",
            "location",
            "event_image_path"
        ];

        const statement = `
            SELECT * 
            FROM events 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY date DESC`;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch event logs data.`);
    }
}

async function getShareYourProblems(searchQuery: string){
    const AgColumnDefs = [
        { headerName: 'ID(P)', field: 'num_id', checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, width: 50, filter: 'agTextColumnFilter' },
        { headerName: 'Date', field: 'datesubmit', filter: 'agDateColumnFilter', width: 150 },
        { headerName: 'Status', field: 'status', filter: 'agTextColumnFilter' },    
        { headerName: 'Problem', cellEditorPopup: true, field: 'problemstatement', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'First Name', field: 'firstname', filter: 'agTextColumnFilter' },    
        { headerName: 'Last Name', field: 'lastname', filter: 'agTextColumnFilter' },    
        { headerName: 'Email', field: 'email', filter: 'agTextColumnFilter' },    
        { headerName: 'Phone', field: 'phone', filter: 'agTextColumnFilter' },    
        { headerName: 'Linkedin', field: 'linkedin', filter: 'agTextColumnFilter' },    
        { headerName: 'document', field: 'document', filter: 'agTextColumnFilter' },    
        { headerName: 'SV Assigned', field: 'status', filter: 'agTextColumnFilter' },    
        { headerName: 'SV Connector', field: 'status', filter: 'agTextColumnFilter' },    
        { headerName: 'SV Email', field: 'status', filter: 'agTextColumnFilter' },    
    ];

    try {

        const searchColumns = [
            "num_id",
            "projectname",
            "firstname",
            "lastname",
            "email",
            "phone",
            "linkedin",
            "document",
            "problemstatement",
            "datesubmit"
        ];

        const statement = `
            SELECT * 
            FROM idea 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY datesubmit DESC`;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch SYP data.`);
    }   
}

async function getUserLogs(searchQuery: string){
    const AgColumnDefs = [
        { headerName: 'ID(P)', field: 'id', checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, width: 150, filter: 'agTextColumnFilter' },
        { headerName: 'Email', cellEditorPopup: true, field: 'user_login', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Date', field: 'date', filter: 'agDateColumnFilter', width: 150 },
        { headerName: 'Role', field: 'user_login', filter: 'agTextColumnFilter' },    ];

    try {

        const searchColumns = [
            "id",
            "date",
            "user_login",
            "user_role"
        ];

        const statement = `
            SELECT * 
            FROM login_logs 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY date DESC`;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch login logs data.`);
    }
}

async function getMagicLinks(searchQuery: string){
    const AgColumnDefs = [
        { headerName: 'ID(P)', field: 'id', checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, width: 150, filter: 'agTextColumnFilter' },
        { headerName: 'Email', cellEditorPopup: true, field: 'email', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Role', field: 'role', filter: 'agTextColumnFilter' },
        { headerName: 'Token', field: 'token', filter: 'agTextColumnFilter' },
        { headerName: 'Date Created', field: 'creation_time', filter: 'agDateColumnFilter', width: 150 },
        { headerName: 'Date Expired', field: 'expire_time', filter: 'agDateColumnFilter', width: 150 },
        { headerName: 'Status', field: 'status', filter: 'agTextColumnFilter' },
    ];

    try {

        const searchColumns = [
            "id",
            "role",
            "email",
            "token",
            "creation_time",
            "expire_time",
            "status"
        ];

        const statement = `
            SELECT * 
            FROM magic_links 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY creation_time DESC`;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch magic links data.`);
    }
}

export async function deleteEvangelismHandler(selectedRowsData: any, option: string) {

  const optionToTable = {
    "event-logs": "events",
    "share-your-problems": "idea",
    "user-logs": "login_logs",
    "magic-links": "magic_links"
  }
  
  const optionToPrimaryKey = {
    "event-logs": "id",
    "share-your-problems": "num_id",
    "user-logs": "id",
    "magic-links": "id"
  }
  
  return await deleteHandler(selectedRowsData, option, optionToTable, optionToPrimaryKey);
}