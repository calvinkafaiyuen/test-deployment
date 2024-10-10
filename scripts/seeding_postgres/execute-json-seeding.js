require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const query = require('../pgdb'); // Assuming this is your module to handle database queries
const BATCH_SIZE = 50;  // Maximum number of rows per batch

async function readJsonFiles(directory) {
    const files = await fs.readdir(directory);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    const jsonData = [];

    for (const file of jsonFiles) {
        const filePath = path.join(directory, file);
        const data = await fs.readFile(filePath, 'utf8');
        jsonData.push(JSON.parse(data));
    }

    return jsonData[0];
}

async function getTableColumns(tableName) {
    const result = await query(`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1;`, [tableName]);
    return result.map(row => row.column_name);
}

async function seedData(jsonData) {
    for (const data of jsonData) {
        const tableInfo = data;
        if (tableInfo.type === 'table' && tableInfo.data) {
            console.log(`Start seeding [${tableInfo.name}]...`);
            const tableName = tableInfo.name;
            const tableColumns = await getTableColumns(tableName);
            const tableData = tableInfo.data;

            // Process data in batches
            for (let i = 0; i < tableData.length; i += BATCH_SIZE) {
                const batchData = tableData.slice(i, i + BATCH_SIZE).map(row => {
                    const filteredRow = {};
                    Object.keys(row).forEach(key => {
                        if (tableColumns.includes(key)) {
                            filteredRow[key] = row[key];
                        }
                    });
                    return filteredRow;
                });

                if (batchData.length === 0) continue;

                const columns = Object.keys(batchData[0]).map(field => `"${field}"`).join(', ');
                const placeholders = batchData.map((row, index) => `(${Object.keys(row).map((key, idx) => `$${index * Object.keys(row).length + idx + 1}`).join(', ')})`).join(', ');
                const values = batchData.reduce((acc, curr) => [...acc, ...Object.values(curr)], []);

                const insertQuery = `
                    INSERT INTO "${tableName}" (${columns})
                    VALUES ${placeholders}
                    ON CONFLICT DO NOTHING;
                `;
                await query(insertQuery, values);
            }
            console.log(`${tableData.length} records inserted into [${tableName}]`);
            console.log('--------------------');
        } else {
            console.log(`No data to seed for table ${tableInfo ? tableInfo.name : 'Unknown'}`);
            console.log('--------------------');
        }
    }
}

async function fixSequences() {
    const sequenceFixSQL = `
    WITH sequences AS (
        SELECT *
        FROM (
            SELECT table_schema,
                   table_name,
                   column_name,
                   pg_get_serial_sequence(format('%I.%I', table_schema, table_name), column_name) AS col_sequence
            FROM information_schema.columns
            WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ) t
        WHERE col_sequence IS NOT NULL
    ), maxvals AS (
        SELECT table_schema, table_name, column_name, col_sequence,
               (xpath('/row/max/text()',
                  query_to_xml(format('SELECT max(%I) FROM %I.%I', column_name, table_schema, table_name), true, true, ''))
               )[1]::text::bigint AS max_val
        FROM sequences
    )
    SELECT table_schema, 
           table_name, 
           column_name, 
           col_sequence,
           COALESCE(max_val, 0) AS max_val,
           setval(col_sequence, COALESCE(max_val, 1)) -- This will change the sequence
    FROM maxvals;
    `;

    await query(sequenceFixSQL);
    console.log('Sequences fixed.');
}

async function main() {
    const directoryPath = path.join(__dirname, '..', 'json');  // Adjust based on actual location relative to this script
    try {
        const jsonData = await readJsonFiles(directoryPath);
        await seedData(jsonData);
        await fixSequences();
        console.log('Database seeding and sequence fix completed successfully.');
    } catch (error) {
        console.error('Failed to seed database:', error);
    }
}

main();
