/**
 * MySQL to PostgreSQL Data Migration Script
 * 
 * This script exports data from MySQL (XAMPP) and imports it into PostgreSQL.
 * 
 * Prerequisites:
 * - XAMPP MySQL must be running
 * - PostgreSQL must be running with the camp_elim_africa database created
 * - npm install mysql2 pg
 */

const mysql = require('mysql2/promise');
const { Client } = require('pg');

// MySQL connection (XAMPP)
const mysqlConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'camp_elim_africa.db'
};

// PostgreSQL connection
const pgConfig = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'camp_elim_africa'
};

// Tables in order of dependencies (parent tables first)
const tables = [
    // Independent tables first
    'admins',
    'clients',
    'halls',
    'hostels',
    'packages',

    // Hall related
    'hall_amenities',
    'hall_gallery_images',
    'hall_gallery_videos',
    'hall_suitability',
    'hall_addons',
    'hall_plans',
    'hall_plan_features',

    // Hostel related
    'hostel_amenities',
    'hostel_gallery_images',
    'hostel_gallery_videos',
    'hostel_suitability',
    'hostel_addons',

    // Package related
    'package_features',
    'package_gallery_images',
    'package_gallery_videos',
    'package_suitability',
    'package_addons',

    // Bookings
    'hall_bookings',
    'booked_halls',
    'hall_booking_addons',
    'hostel_bookings',
    'hostel_booking_addons',
    'package_bookings',
    'package_booking_addons'
];

async function migrateData() {
    let mysqlConn;
    let pgClient;

    try {
        console.log('🔄 Connecting to MySQL...');
        mysqlConn = await mysql.createConnection(mysqlConfig);
        console.log('✅ Connected to MySQL');

        console.log('🔄 Connecting to PostgreSQL...');
        pgClient = new Client(pgConfig);
        await pgClient.connect();
        console.log('✅ Connected to PostgreSQL');

        for (const table of tables) {
            try {
                console.log(`\n📦 Migrating table: ${table}`);

                // Get data from MySQL
                const [rows] = await mysqlConn.query(`SELECT * FROM \`${table}\``);

                if (rows.length === 0) {
                    console.log(`   ⏭️  No data in ${table}, skipping...`);
                    continue;
                }

                console.log(`   Found ${rows.length} rows`);

                // Get column names from the first row
                const columns = Object.keys(rows[0]);

                // Insert data into PostgreSQL
                for (const row of rows) {
                    const values = columns.map(col => row[col]);
                    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
                    const columnNames = columns.map(col => `"${col}"`).join(', ');

                    const query = `INSERT INTO "${table}" (${columnNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;

                    try {
                        await pgClient.query(query, values);
                    } catch (insertErr) {
                        // Log but continue - some rows might already exist
                        if (!insertErr.message.includes('duplicate')) {
                            console.log(`   ⚠️  Error inserting row: ${insertErr.message}`);
                        }
                    }
                }

                console.log(`   ✅ Migrated ${rows.length} rows`);

                // Reset sequence for auto-increment columns
                try {
                    const seqQuery = `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 1))`;
                    await pgClient.query(seqQuery);
                } catch (seqErr) {
                    // Some tables might not have an id column, that's ok
                }

            } catch (tableErr) {
                console.log(`   ⚠️  Table ${table} might not exist in MySQL or error: ${tableErr.message}`);
            }
        }

        console.log('\n🎉 Migration completed successfully!');

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        console.error('Full error:', err);
    } finally {
        if (mysqlConn) await mysqlConn.end();
        if (pgClient) await pgClient.end();
    }
}

migrateData();
