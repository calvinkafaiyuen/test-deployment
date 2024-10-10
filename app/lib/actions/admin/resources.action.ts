"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";
import { generateLikeClause, generateParameters } from "./(utils)/helpers";
import { deleteHandler } from "./(utils)/delete.action";

export async function resourcesHandler (resources_option: string, searchQuery: string, status: string = 'all') {
    const session = await auth();
    if (session?.user?.role != 'admin') {
        return 'Your permission does not allow access to this information.';
    }
    switch(resources_option) {
        case 'documents':
            return await getDocuments(searchQuery);
        case 'pitches-and-meetings':
            return await getPitchesAndMeetings(searchQuery);
        default:
            return [];
    }
}

async function getPitchesAndMeetings(searchQuery: string){

    const AgColumnDefs = [
        { headerName: 'Pitch ID', width: 180, filter: 'agTextColumnFilter', field: 'pitch_reference', checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true },
        { headerName: 'Team Name', width: 180, filter: 'agTextColumnFilter', field: 'team_name' },
        { headerName: 'Cohort', width: 180, filter: 'agTextColumnFilter', field: 'cohort' },
        { headerName: 'Video Link (E)', width: 180, filter: 'agTextColumnFilter', field: 'video_url', editable: true },
        { headerName: 'Date Created', width: 180, filter: 'agDateColumnFilter', field: 'date_submitted' },
        { headerName: 'Presentation Date', width: 180, filter: 'agDateColumnFilter', field: 'presentation_date', editable: true },
        { headerName: 'Pitch Comments', width: 180, filter: 'agTextColumnFilter', field: 'pitching_comment', editable: true, cellEditor: 'agLargeTextCellEditor' },
        { headerName: 'Meeting Minutes', width: 180, filter: 'agTextColumnFilter', field: 'meeting_minutes', editable: true, cellEditor: 'agLargeTextCellEditor' },
        { headerName: 'Pitch Name', width: 180, filter: 'agTextColumnFilter', field: 'pitch_name' }
    ];
    

    try {

        const searchColumns = [
            "teams.team_name",
            "teams.cohort",
            "video_url",
            "pitching_comment",
            "meeting_minutes",
            "date_submitted",
            "presentation_date",
            "pitch_name",
            "pitch_reference"
        ];

        const statement = `
            SELECT teams.team_name,teams.cohort,video_url,pitching_comment,meeting_minutes,date_submitted,presentation_date,pitch_name,pitch_reference 
            FROM pitches 
            JOIN teams 
            ON teams.team_id = pitches.team_id 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY pitch_reference DESC`;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch pitches and meetings data.`);
    }
}

async function getDocuments(searchQuery: string){

    const AgColumnDefs = [
        { headerName: 'ID', filter: 'agTextColumnFilter', width: 180, field: 'id', checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true },
        { headerName: 'Resource Name(E)', filter: 'agTextColumnFilter', width: 180, field: 'resource_name', editable: true },
        { headerName: 'File', filter: 'agTextColumnFilter', width: 180, field: 'doc_path', editable: false },
        { headerName: 'URL(E)', filter: 'agTextColumnFilter', width: 180, field: 'url', editable: true },
        { headerName: 'Category', filter: 'agTextColumnFilter', width: 180, field: 'category', editable: true },
        { headerName: 'Admin(E)', filter: 'agTextColumnFilter', width: 180, field: 'admin', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: [1, 0] } },
        { headerName: 'Connector(E)', filter: 'agTextColumnFilter', width: 180, field: 'connector', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: [1, 0] } },
        { headerName: 'Mentor(E)', filter: 'agTextColumnFilter', width: 180, field: 'mentor', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: [1, 0] } },
        { headerName: 'Student(E)', filter: 'agTextColumnFilter', width: 180, field: 'student', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: [1, 0] } },
        { headerName: 'Type', filter: 'agTextColumnFilter', width: 180, field: 'type', editable: false },
        { headerName: 'Folder(E)', filter: 'agTextColumnFilter', width: 150, field: 'folder', editable: true, cellEditor: 'agSelectCellEditor' },
        { headerName: 'Item Order(E)', filter: 'agTextColumnFilter', width: 150, field: 'item_order', editable: true }
    ];
    

    try {

        const searchColumns = [
            "id",
            "item_order",
            "type",
            "resource_name",
            "doc_path",
            "url",
            "admin",
            "mentor",
            "connector",
            "student",
            "category"
        ];

        const statement = `
            SELECT * 
            FROM resources 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY resource_name ASC`;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch resources data.`);
    }   
}

export async function deleteResourcesHandler(selectedRowsData: any, option: string) {

  const optionToTable = {
    "documents": "resources",
    "pitches-and-meetings": "pitches"
  }
  
  const optionToPrimaryKey = {
    "documents": "id",
    "pitches-and-meetings": "pitch_reference"
  }
  
  return await deleteHandler(selectedRowsData, option, optionToTable, optionToPrimaryKey);
}