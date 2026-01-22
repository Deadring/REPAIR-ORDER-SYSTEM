const mysql = require('mysql2');
require('dotenv').config();

// Create connection without database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || ''
});

async function setupDatabase() {
    try {
        console.log('Connecting to MySQL...');
        console.log('Host:', process.env.DB_HOST);
        console.log('User:', process.env.DB_USER);
        
        const promiseConnection = connection.promise();
        
        // Read the database.sql file
        const fs = require('fs');
        const sql = fs.readFileSync('./database.sql', 'utf8');
        
        console.log('Executing database setup script...');
        
        // Execute the entire SQL file
        const statements = sql.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            const trimmed = statement.trim();
            if (trimmed) {
                try {
                    console.log('Executing:', trimmed.substring(0, 60) + '...');
                    await promiseConnection.query(trimmed);
                } catch (err) {
                    console.error('Error executing statement:', err.message);
                    throw err;
                }
            }
        }
        
        console.log('✓ Database setup completed successfully!');
        await promiseConnection.end();
        process.exit(0);
    } catch (error) {
        console.error('✗ Error setting up database:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

setupDatabase();
