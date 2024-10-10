"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";
import { generateLikeClause, generateParameters } from "./(utils)/helpers";
import { deleteHandler } from "./(utils)/delete.action";

export async function peopleHandler (people_option: string, searchQuery: string, status: string = 'all') {
    const session = await auth();
    if (session?.user?.role != 'admin') {
        return 'Your permission does not allow access to this information.';
    }
    switch(people_option) {
        case 'program-individuals':
            return await getProgramIndividuals(searchQuery);
        case 'mentors':
            return await getMentors(searchQuery);
        case 'connectors':
            return await getConnectors(searchQuery);
        case 'staff':
            return await getStaff(searchQuery);
        case 'ambassadors':
            return await getAmbassadors(searchQuery);
        case 'service-providers':
            return await getServiceProviders(searchQuery);
        case 'investment-committee':
            return await getInvestmentCommittee(searchQuery);
        case 'contact-us':
            return await getContactUs(searchQuery);
        default:
            return [];
    }
}

async function getContactUs(searchQuery: string){

    const AgColumnDefs = [
        { headerName: 'ID', field: 'id', width: 200, editable: false, checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, filter: 'agTextColumnFilter' },
        { headerName: 'Name', field: 'name', width: 200, filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 50, cols: 60, rows: 6 } },
        { headerName: 'Role', field: 'role', width: 200, filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 100, cols: 60, rows: 6 } },
        { headerName: 'Type', field: 'type', width: 200, filter: 'agTextColumnFilter', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['TEAM', 'ADVISORY BOARD'] } },
        { headerName: 'Prefix', field: 'prefix', width: 200, filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 25, cols: 60, rows: 6 } },
        { headerName: 'URL', field: 'url', width: 200, filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 100, cols: 60, rows: 6 } }
    ];
    

    try {

        const searchColumns = [
            "id",
            "name",
            "role",
            "type",
            "prefix",
            "url"
        ];

        const statement = `
            SELECT * 
            FROM about_us_members
            WHERE ${generateLikeClause(searchColumns)}`;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch contact us data.`);
    }
}

async function getInvestmentCommittee(searchQuery: string){

    function mentorStatusFilter() {
        return [
            'Active',
            'Inactive',
            'Pending Interviews',
            'Pending Documents',
            'Term',
            'Rejected'
        ];
    }
    
    const dropdownStatus = { values: ['Pending Interview', 'Pending Documents', 'Active', 'Inactive', 'Term', 'Rejected'] };
    
    const statusColors = {
        accepted: 'x == "Active"',
        pending: 'x == "Pending Interview"',
        declined: 'x == "Inactive"',
        'not-eligible': 'x == "Rejected"',
        interviewing: 'x == "Pending Documents"',
        term: 'x == "Term"'
    };
    
    const AgColumnDefs = [
        { headerName: 'ID', field: 'id', width: 150, editable: false, checkboxSelection: true, cellClass: 'cell-wrap-text', headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, filter: 'agNumberColumnFilter' },
        { headerName: 'Date Submitted', sort: 'desc', field: 'date_submitted', width: 180, editable: false, cellClass: 'cell-wrap-text', filter: 'agDateColumnFilter' },
        { headerName: 'Status(E)', field: 'status', cellEditor: 'agSelectCellEditor', cellEditorParams: dropdownStatus, width: 125, editable: true, cellClass: 'cell-wrap-text', cellClassRules: statusColors, filter: 'agTextColumnFilter' },
        { headerName: 'Picture', field: 'investment_committee_image', editable: false, width: 180 },
        { headerName: 'Agreement', field: 'agreement', width: 200, filter: 'agTextColumnFilter', editable: false, cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }},
        { headerName: 'LinkedIn(E)', field: 'linkedin', width: 180, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }},
        { headerName: 'First Name(E)', field: 'first_name', width: 200, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text'},
        { headerName: 'Last Name(E)', field: 'last_name', width: 200, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text'},
        { headerName: 'Email(E)', field: 'email', filter: 'agTextColumnFilter', width: 180, editable: true, cellClass: 'cell-wrap-text',},
        { headerName: 'Phone(E)', width: 200, field: 'phone', filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text'},
        { headerName: 'Biography(E)', field: 'bio', width: 400, height: 300, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', enableTooltip: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 3000, cols: 60, rows: 6 } },
        { headerName: 'Specialties(E)', field: 'expertise', width: 400, height: 300, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', enableTooltip: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Current Position(E)', field: 'current_position', width: 200, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Industry(E)', field: 'industry', width: 180, editable: true, filter: 'agTextColumnFilter', cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Current Company(E)', field: 'current_company', width: 200, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }},
        { headerName: 'Resume(E)', field: 'resume', width: 180, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text'},
        { headerName: 'Notes(E)', field: 'notes', width: 180, editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Comments(E)', field: 'comments', width: 180, editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Gender(E)', field: 'gender', width: 180, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Male', 'Female'] } }
    ];
    

    try {

        const searchColumns = [
            "id",
            "status",
            "emr_status",
            "date_submitted",
            "first_name",
            "middle_name",
            "last_name",
            "email",
            "phone"
        ];

        const statement = `
            SELECT * 
            FROM investment_committee 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY date_submitted DESC`;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch investment committee data.`);
    }
}

async function getServiceProviders(searchQuery: string){

    const statuses = { values: ['active', 'discontinued', 'pending'] };

    const AgColumnDefs = [
        // { headerName: 'ID', field: 'id', width: 60, editable: true },
        { headerName: 'Full Name', field: 'fullname', pinned: 'left', editable: true, checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, filter: 'agTextColumnFilter' },
        { headerName: 'Company', field: 'company', editable: true, pinned: 'left', filter: 'agTextColumnFilter' },
        { headerName: 'Document', field: 'document', editable: false },
        { headerName: 'Status', field: 'status', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: statuses, filter: 'agTextColumnFilter' },
        { headerName: 'Phone', field: 'phone', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Email', field: 'email', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Service Type', field: 'service_type', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Address', field: 'address', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'City', field: 'city', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Country', field: 'country', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Start Date', field: 'date_start', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'End Date', field: 'date_end', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Date Submitted', field: 'date_submitted', editable: false, filter: 'agDateColumnFilter' },
        { headerName: 'ID', field: 'reference', editable: false, sort: 'desc', filter: 'agTextColumnFilter' }
    ];


    try {

        const searchColumns = [
            "reference",
            "document",
            "fullname",
            "email",
            "phone",
            "service_type",
            "status",
            "address",
            "city",
            "country",
            "company",
            "date_start",
            "date_end",
            "date_submitted"
        ];

        const statement = `
            SELECT * 
            FROM service_provider 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY reference DESC
        `;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch service providers data.`);
    }
}

async function getAmbassadors(searchQuery: string){

    const AgColumnDefs = [
        { headerName: 'Date', width: 180, field: 'date', editable: false, checkboxSelection: true, sort: 'desc', headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, filter: 'agDateColumnFilter' },
        { headerName: 'Status(Editable)', width: 180, field: 'status', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Interviewing', 'Conditional', 'ACCEPTED', 'Declined', 'Pending', 'Not Eligible'] }, cellClassRules: { accepted: 'x == "ACCEPTED"', pending: 'x == "Pending"', declined: 'x == "Declined"', 'not-eligible': 'x == "Not Eligible"', interviewing: 'x == "Interviewing"', conditional: 'x == "Conditional"' }, filter: 'agTextColumnFilter' },
        { headerName: 'First Name', field: 'firstname', width: 180, editable: false, filter: 'agTextColumnFilter' },
        { headerName: 'Last Name', field: 'lastname', width: 180, filter: 'agTextColumnFilter', editable: false },
        { headerName: 'Email', field: 'email', editable: false, filter: 'agTextColumnFilter' },
        { headerName: 'Phone', width: 180, field: 'mentor_phone', editable: false, filter: 'agTextColumnFilter' },
        { headerName: 'Utorid', width: 180, field: 'utorid', editable: false, filter: 'agTextColumnFilter' },
        { headerName: 'Linkedin', width: 180, field: 'linkedin', editable: false, filter: 'agTextColumnFilter' },
        { headerName: 'Program', width: 180, field: 'program', editable: false, filter: 'agTextColumnFilter' },
        { headerName: 'Graduation Year', width: 180, field: 'gradyear', editable: false, filter: 'agTextColumnFilter' }
    ];
    
    try {

        const searchColumns = [
            "reference_number",
            "firstname",
            "lastname",
            "email",
            "phone",
            "utorid",
            "linkedin",
            "program",
            "gradyear",
            "date",
            "status"
        ];

        const statement = `
            SELECT * 
            FROM ambassadors 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY date DESC
        `;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch ambassadors data.`);
    }
}
async function getProgramIndividuals(searchQuery: string){

    const AgColumnDefs = [
        //{ headerName: 'Team ID (pop-up)', field: 'team_id' },
        { headerName: 'Date', field: 'time_registered', sort: 'desc', filter: 'agDateColumnFilter' },
        { headerName: 'Team Name (pop-out)', field: 'team_name', filter: 'agTextColumnFilter' },
        { headerName: 'First Name (E)', field: 'firstname', editable: true, filter: 'agTextColumnFilter', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Last Name (E)', field: 'lastname', editable: true, filter: 'agTextColumnFilter', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Email', field: 'uoft_email', filter: 'agTextColumnFilter' },
        { headerName: 'Phone (E)', field: 'phone', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'PostGraduate', field: 'complete_education', enableCellTextSelection: true, filter: 'agTextColumnFilter' },
        { headerName: 'Program (E)', field: 'program', editable: true, filter: 'agTextColumnFilter', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Degree (E)', field: 'degree', editable: true, filter: 'agTextColumnFilter', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Expected Grad (E)', field: 'expected_grad_year', editable: true, filter: 'agTextColumnFilter', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Application Program', field: 'process', filter: 'agTextColumnFilter' },
        { headerName: 'Cohort', field: 'cohort', filter: 'agTextColumnFilter', editable: false },
        { headerName: 'UofT', field: 'uoft', filter: 'agTextColumnFilter' },
        { headerName: 'Go To Market', field: 'go_to_market', filter: 'agTextColumnFilter' },
        { headerName: 'ID', field: 'student_num', checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, filter: 'agTextColumnFilter' },
        { headerName: 'Promo(E)', field: 'promo', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'Status', field: 'status', filter: 'agTextColumnFilter' },
        { headerName: 'Fellowship Doc', field: 'fellowship', filter: 'agTextColumnFilter' },
        { headerName: 'Fellowship Amount (E)', field: 'fellowship_amount', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'OSAP (E)', field: 'osap', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Ontario Resident (E)', field: 'ontario_resident', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Domestic Student (E)', field: 'domestic_student', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Gender (E)', field: 'gender', enableCellTextSelection: true, filter: 'agTextColumnFilter' },
        { headerName: 'Validation (E)', field: 'validation', enableCellTextSelection: true, filter: 'agTextColumnFilter' },
        { headerName: 'Expertise( E)', field: 'expertise', enableCellTextSelection: true, filter: 'agTextColumnFilter' },
        { headerName: 'Interests (E)', field: 'interests', enableCellTextSelection: true, filter: 'agTextColumnFilter' },
        // { headerName: 'Source', field: 'hatchery_referer', enableCellTextSelection: false, filter: 'agTextColumnFilter' }
    ];
    
    
    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
        

    try {

        const searchColumns1 = [
            "students.student_num",
            "teams.team_name",
            "students.firstname",
            "students.lastname",
            "students.uoft_email",
            "teams.go_to_market",
            "teams.status",
            "teams.team_id",
            "teams.cohort",
            "teams.promo",
            "teams.time_registered",
            "students.phone",
            "students.program",
            "students.degree",
            "students.expected_grad_year",
            "students.source",
            "students.bat_cohort",
            "students.fellowship",
            "students.fellowship_amount",
            "students.osap",
            "students.ontario_resident",
            "students.domestic_student",
            "students.gender",
            "(CASE WHEN students.validation = 'good' THEN 'good' ELSE 'pending' END)",
            "expertise",
            "interests",
            "extra_degrees",
            "(CASE " +
              "WHEN students.bat_cohort = 1 AND students.source LIKE '%Cohort%' THEN 'BAT' " +
              "WHEN students.bat_cohort = 0 AND students.source LIKE '%Cohort%' THEN 'NEST' " +
              "WHEN students.bat_cohort = 0 AND students.source LIKE '%Launch%' THEN 'Launch Lab' " +
              "WHEN students.bat_cohort = 0 AND students.source LIKE '%Alumni%' THEN 'Hatchery Alumni' " +
              "WHEN students.bat_cohort = 0 AND students.source LIKE '%Social%' THEN 'Hatchery Social' " +
              "WHEN students.bat_cohort = 0 AND students.source LIKE '%Utias%' THEN 'Utias Hatchery' " +
            "END)"
        ];

        const searchColumns2 = [
            "students.student_num",
            "'NULL'",
            "students.firstname",
            "students.lastname",
            "students.uoft_email",
            "'NO'",
            "'pending'",
            "'NULL'",
            "students.source",
            "students.promo",
            "students.time_registered",
            "students.phone",
            "students.program",
            "students.degree",
            "students.expected_grad_year",
            "students.source",
            "students.bat_cohort",
            "students.fellowship",
            "students.fellowship_amount",
            "students.osap",
            "students.ontario_resident",
            "students.domestic_student",
            "students.gender",
            "(CASE WHEN students.validation = 'good' THEN 'good' ELSE 'pending' END)",
            "expertise",
            "interests",
            "extra_degrees",
            "(CASE " +
              "WHEN students.bat_cohort = 1 AND students.source LIKE '%Cohort%' THEN 'BAT' " +
              "WHEN students.bat_cohort = 0 AND students.source LIKE '%Cohort%' THEN 'NEST' " +
              "WHEN students.bat_cohort = 0 AND students.source LIKE '%Launch%' THEN 'Launch Lab' " +
              "WHEN students.bat_cohort = 0 AND students.source LIKE '%Alumni%' THEN 'Hatchery Alumni' " +
              "WHEN students.bat_cohort = 0 AND students.source LIKE '%Social%' THEN 'Hatchery Social' " +
              "WHEN students.bat_cohort = 0 AND students.source LIKE '%Utias%' THEN 'Utias Hatchery' " +
            "END)"
        ];

        const filter = "";
        const statement = `
        (SELECT 
        students.student_num, teams.team_name, students.firstname, students.lastname, students.uoft_email, teams.go_to_market, teams.status, teams.team_id,
        teams.cohort, teams.promo, teams.time_registered, students.phone, students.program, students.degree, students.expected_grad_year, students.source, students.bat_cohort,
        students.fellowship, students.fellowship_amount, students.osap, students.ontario_resident, students.domestic_student, students.gender,
        CASE WHEN students.validation = 'good' THEN 'good' ELSE 'pending' END AS validation, expertise, interests, extra_degrees,
        CASE 
            WHEN students.bat_cohort = 1 AND students.source LIKE '%Cohort%' THEN 'BAT'
            WHEN students.bat_cohort = 0 AND students.source LIKE '%Cohort%' THEN 'NEST'
            WHEN students.bat_cohort = 0 AND students.source LIKE '%Launch%' THEN 'Launch Lab'
            WHEN students.bat_cohort = 0 AND students.source LIKE '%Alumni%' THEN 'Hatchery Alumni'
            WHEN students.bat_cohort = 0 AND students.source LIKE '%Social%' THEN 'Hatchery Social'
            WHEN students.bat_cohort = 0 AND students.source LIKE '%Utias%' THEN 'Utias Hatchery'
        END AS process
        FROM students
        JOIN team_member_rlshp ON students.team_id = team_member_rlshp.team_id 
        JOIN teams ON teams.team_id = team_member_rlshp.team_id
        WHERE has_team = 1 ${filter} AND ${generateLikeClause(searchColumns1)}
        GROUP BY students.student_num, teams.team_name, students.firstname, students.lastname, students.uoft_email, teams.go_to_market, teams.status, teams.team_id,
        teams.cohort, teams.promo, teams.time_registered, students.phone, students.program, students.degree, students.expected_grad_year, students.source, students.bat_cohort,
        students.fellowship, students.fellowship_amount, students.osap, students.ontario_resident, students.domestic_student, students.gender, expertise, interests, extra_degrees
        ORDER BY teams.time_registered DESC) 
        UNION
        (SELECT students.student_num, NULL AS team_name, students.firstname, students.lastname, students.uoft_email, 'NO' AS go_to_market, 'pending' AS status, NULL AS team_id,
        students.source AS cohort, students.promo, students.time_registered, students.phone, students.program, students.degree, students.expected_grad_year, students.source, students.bat_cohort,
        students.fellowship, students.fellowship_amount, students.osap, students.ontario_resident, students.domestic_student, students.gender, 
        CASE WHEN students.validation = 'good' THEN 'good' ELSE 'pending' END AS validation, expertise, interests, extra_degrees,
        CASE 
            WHEN students.bat_cohort = 1 AND students.source LIKE '%Cohort%' THEN 'BAT'
            WHEN students.bat_cohort = 0 AND students.source LIKE '%Cohort%' THEN 'NEST'
            WHEN students.bat_cohort = 0 AND students.source LIKE '%Launch%' THEN 'Launch Lab'
            WHEN students.bat_cohort = 0 AND students.source LIKE '%Alumni%' THEN 'Hatchery Alumni'
            WHEN students.bat_cohort = 0 AND students.source LIKE '%Social%' THEN 'Hatchery Social'
            WHEN students.bat_cohort = 0 AND students.source LIKE '%Utias%' THEN 'Utias Hatchery'
        END AS process
        FROM students WHERE has_team = 0 ${filter} AND ${generateLikeClause(searchColumns2, searchColumns1.length + 1)}
        ORDER BY students.time_registered DESC)`;

        const parameters = generateParameters(searchColumns1, searchQuery);
        const parameters2 = generateParameters(searchColumns2, searchQuery);
        const data = await query(statement, [...parameters, ...parameters2]);
        // data.forEach(row => {
        //     if (row.extra_degrees) {
        //         row.extra_degrees = JSON.parse(row.extra_degrees);
        //         row.extra_degrees = row.extra_degrees.filter((degree: { program: string | null; }) => degree.program !== '' && degree.program !== null);
        //         row.complete_education = row.extra_degrees.map((degree: { degree: any; program: any; gradYear: any; }) => `* ${capitalize(degree.degree)}-${capitalize(degree.program)}-${degree.gradYear}`).join(" ");
        //     }
        // });
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch programs individuals data.`);
    }
}

async function getMentors(searchQuery: string){
    function mentorStatusFilter() {
        return [
            'Active',
            'Inactive',
            'Pending Interviews',
            'Pending Documents',
            'Term',
            'Rejected'
        ];
    }
    
    const dropdown_status = { values: ['Pending Interview', 'Pending Documents', 'Active', 'Inactive', 'Term', 'Rejected'] };
    
    const status_colors = {
        accepted: 'x == "Active"',
        pending: 'x == "Pending Interview"',
        declined: 'x == "Inactive"',
        'not-eligible': 'x == "Rejected"',
        interviewing: 'x == "Pending Documents"',
        term: 'x == "Term"'
    };
    
    const emr_status = { values: ['NO', 'YES'] };
    
    const emr_status_color = {
        accepted: 'x == "YES"',
        declined: 'x == "NO"'
    };
    
    const AgColumnDefs = [
        { headerName: 'ID', field: 'id', width: 150, editable: false, checkboxSelection: true, cellClass: 'cell-wrap-text', headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, filter: 'agNumberColumnFilter' },
        { headerName: 'Picture', field: 'mentor_image', editable: false, width: 180 },
        { headerName: 'Status', field: 'status', cellEditor: 'agSelectCellEditor', cellEditorParams: dropdown_status, width: 125, editable: true, cellClass: 'cell-wrap-text', cellClassRules: status_colors, filter: 'agTextColumnFilter' },
        { headerName: 'First Name(Editable)', field: 'first_name', width: 200, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text' },
        { headerName: 'Last Name(Editable)', field: 'last_name', width: 200, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text'},
        { headerName: 'Email', field: 'mentors_id', filter: 'agTextColumnFilter', width: 180, editable: false, cellClass: 'cell-wrap-text'},
        { headerName: 'Phone(Editable)', width: 200, field: 'mentor_phone', filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', },
        { headerName: 'Biography(Editable)', field: 'bio', width: 400, height: 300, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', enableTooltip: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 10000, cols: 60, rows: 6 }},
        { headerName: 'Specialties(Editable)', field: 'expertise', width: 400, height: 300, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', enableTooltip: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'EMR', field: 'emr_status', cellEditor: 'agSelectCellEditor', cellEditorParams: emr_status, width: 125, editable: true, cellClass: 'cell-wrap-text', cellClassRules: emr_status_color, filter: 'agTextColumnFilter' },
        { headerName: 'Date Submitted', sort: 'desc', field: 'date_submitted', width: 180, editable: true, cellClass: 'cell-wrap-text', filter: 'agDateColumnFilter' },
        { headerName: 'Current Position(Editable)', field: 'current_position', width: 200, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text',cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }},
        { headerName: 'Industry(Editable)', field: 'industry', width: 180, editable: true, filter: 'agTextColumnFilter', cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, },
        { headerName: 'Current Company(Editable)', field: 'current_company', width: 200, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'LinkedIn(Editable)', field: 'linkedin', width: 180, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }},
        { headerName: 'Resume', field: 'resume', width: 180, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text'},
        { headerName: 'Notes', field: 'notes', width: 180, editable: false, filter: 'agTextColumnFilter' },
        { headerName: 'Comments(Editable)', field: 'comments', width: 180, editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Gender(Editable)', field: 'gender', width: 180, filter: 'agTextColumnFilter', editable: true, cellClass: 'cell-wrap-text', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Male', 'Female'] } },
        { headerName: 'Agreement', field: 'agreement', width: 200, filter: 'agTextColumnFilter', editable: false, cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }},
        { headerName: 'Agreement Date', field: 'agreement_date', width: 200, filter: 'agDateColumnFilter', editable: true, cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
        { headerName: 'EMR Agreement', field: 'emr_agreement', width: 200, filter: 'agTextColumnFilter', editable: false, cellClass: 'cell-wrap-text', cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }},
        { headerName: 'Supervised Teams', field: 'supervised_teams', width: 200, editable: false, filter: 'agTextColumnFilter' }
    ];
    

    try {

        const searchColumns = [
            "id",
            "status",
            "emr_status",
            "date_submitted",
            "mentors_id",
            "team_id",
            "mentors_initials",
            "first_name",
            "middle_name",
            "last_name",
            "current_position",
            "previous_position",
            "current_company",
            "expertise",
            "skills",
            "activities",
            "current_start",
            "school",
            "school_start",
            "school_end",
            "degree",
            "mentor_program",
            "mentor_email",
            "mentor_phone",
            "mentor_twitter",
            "mentor_availability",
            "mentor_image",
            "campus",
            "resume",
            "linkedin",
            "gender",
            "bio",
            "notes",
            "agreement",
            "emr_agreement",
            "introduction",
            "agreement_date",
            "industry",
            "comments"
        ];

        const statement = `
          SELECT * 
          FROM mentors 
          WHERE ${generateLikeClause(searchColumns)}
          ORDER BY date_submitted DESC
        `;
        
        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch mentors data.`);
    }   
}

async function getConnectors(searchQuery: string){

        const AgColumnDefs = [
            { headerName: 'ID', field: 'id', width: 150, editable: true, checkboxSelection: true, headerCheckboxSelection: true, filter: 'agTextColumnFilter' },
            { headerName: 'Status(Editable)', field: 'status', width: 180, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] }, cellClassRules: { accepted: 'x == "Active"', declined: 'x == "Inactive"' }, filter: 'agTextColumnFilter' },
            { headerName: 'Date Submitted', field: 'date_submitted', width: 200, editable: true, filter: 'agTextColumnFilter' },
            { headerName: 'First Name(Editable)', field: 'firstname', width: 180, editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, filter: 'agTextColumnFilter' },
            { headerName: 'Last Name(Editable)', field: 'lastname', width: 180, filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }},
            { headerName: 'Email(Editable)', field: 'email', width: 180, editable: false, filter: 'agTextColumnFilter' },
            { headerName: 'Phone(Editable)', width: 180, field: 'connector_phone', editable: true, filter: 'agTextColumnFilter' },
            { headerName: 'Contract', field: 'contract', editable: false, width: 180, filter: 'agTextColumnFilter' },
            { headerName: 'Program(Editable)', field: 'program', width: 180, editable: true, filter: 'agTextColumnFilter', cellEditor: 'agSelectCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6, values: ['LAW', 'MBA', 'MMI'] }},
            { headerName: 'Class of(Editable)', field: 'class_of', width: 180, editable: true, filter: 'agTextColumnFilter' },
            { headerName: 'LinkedIn(Editable)', field: 'linkedin', width: 180, editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, filter: 'agTextColumnFilter' },
            { headerName: 'Resume(Editable)', field: 'resume', width: 180, editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, filter: 'agTextColumnFilter' },
            { headerName: 'Notes(Editable)', field: 'notes', width: 180, editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, filter: 'agTextColumnFilter' },
            { headerName: 'Gender(Editable)', field: 'gender', width: 180, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Male', 'Female', 'Others'] }, filter: 'agTextColumnFilter' },
            { headerName: 'Picture', field: 'connector_image', editable: false, width: 200 },

        ];

    try {

        const searchColumns = [
            "id",
            "email",
            "firstname",
            "lastname",
            "username",
            "connector_image",
            "current_position",
            "current_company",
            "connector_phone",
            "linkedin",
            "introduction",
            "date_submitted",
            "contract",
            "status",
            "program",
            "class_of",
            "resume",
            "notes",
            "gender",
            "expertise",
            "comments"
        ];

        const statement = `
            SELECT * 
            FROM connectors 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY date_submitted DESC
        `;

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

async function getStaff(searchQuery: string){

    const employmentTypes = { values: ['work study', 'casual full-time', 'casual part-time', 'full-time'] };
    const employmentStatus = { values: ['active', 'terminated'] };
    const residentStatus = { values: ['work permit', 'canadian citizen', 'canadian permanent resident'] };
    
    const AgColumnDefs = [
        { headerName: 'Reference', field: 'reference', checkboxSelection: true, editable: false, filter: 'agTextColumnFilter' },
        { headerName: 'Employment Status(D)', sort: 'asc', field: 'employment_status', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: employmentStatus, cellClassRules: { working: 'x == "active"', terminated: 'x == "terminated"' }, filter: 'agTextColumnFilter' },
        { headerName: 'First Name(E)', field: 'firstname', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Last Name(E)', field: 'lastname', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Employment Role(E)', field: 'employment_role', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Employment Type(D)', field: 'employment_type', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: employmentTypes, filter: 'agTextColumnFilter' },
        { headerName: 'Resident Status(D)', field: 'resident_status', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: residentStatus, filter: 'agTextColumnFilter' },
        { headerName: 'Email(E)', field: 'email', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Phone(E)', field: 'phone', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Street(E)', field: 'current_address', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'City(E)', field: 'current_city', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Province(E)', field: 'current_province', editable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Date Start(E)', field: 'date_start', editable: true, filter: 'agDateColumnFilter' },
        { headerName: 'Date End(E)', field: 'date_end', editable: true, filter: 'agDateColumnFilter' },
        { headerName: 'Date Submitted', field: 'date_submitted', editable: false, filter: 'agDateColumnFilter' },
        { headerName: 'Reference', field: 'reference', editable: false, checkboxSelection: true, filter: 'agTextColumnFilter' }
    ];
    
    try {

        const searchColumns = [
            "reference",
            "firstname",
            "lastname",
            "employment_role",
            "employment_type",
            "employment_status",
            "resident_status",
            "email",
            "phone",
            "current_address",
            "current_city",
            "current_province",
            "date_start",
            "date_end",
            "date_submitted"
        ];

        const statement = `
            SELECT * 
            FROM employment 
            WHERE ${generateLikeClause(searchColumns)}
            ORDER BY date_end DESC
        `;

        const data = await query(statement, generateParameters(searchColumns, searchQuery));
        return {
            columnDefs: AgColumnDefs,
            rowData: data
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch staff data.`);
    }
}

export async function deletePeopleHandler(selectedRowsData: any, option: string) {

  const optionToTable = {
    "program-individuals": "students",
    "mentors": "mentors",
    "connectors": "connectors",
    "staff": "employment",
    "ambassadors": "ambassadors",
    "service-providers": "service_provider",
    "investment-committee": "investment_committee",
    "contact-us": "about_us_members"
  }
  
  const optionToPrimaryKey = {
    "program-individuals": "student_num",
    "mentors": "id",
    "connectors": "id",
    "staff": "reference",
    "ambassadors": "reference_number",
    "service-providers": "reference",
    "investment-committee": "id",
    "contact-us": "id"
  }
  
  return await deleteHandler(selectedRowsData, option, optionToTable, optionToPrimaryKey);
}