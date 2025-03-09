require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

const connections = {}; // Database connections cache

const getDatabaseConnection = async (companyId) => {
    if (connections[companyId] && mongoose.connections.some(conn=>conn.readyState===1)) {
        return connections[companyId]; // Reuse existing active connection 
    }

    try {
        const dbURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_PREFIX}${companyId}?authSource=admin`;
        
        console.log(`🔗 Connecting to database: ${dbURI}`); // Debugging info

        // create a new connection instance without affecting the global mongoose connection 
        const connection = await mongoose.createConnection(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`✅ Connected to ${process.env.MONGO_DB_PREFIX}${companyId}`);
        connections[companyId] = connection; // Cache connection
        return connection;

    } catch (error) {
        console.error(`❌ Database connection failed for ${companyId}:`, error);
        throw error;
    }
};

module.exports = { getDatabaseConnection };