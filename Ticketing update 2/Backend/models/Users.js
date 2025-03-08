const mongoose = require('mongoose') ;
const{getDatabaseConnection} = require('../db/db');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user", "agent"]
    },
    agentLevel:{
        type:String,
        enum:["L1","L2","L3","L4"],
        required: function(){
            return this.role === "agent" // Only required for agents 
        }
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Function to get User Model per Tenant
const getUserModel = async (companyId) => {
    const connection = await getDatabaseConnection(companyId);
    return connection.model('User', userSchema);
};

module.exports={
    getUserModel
}