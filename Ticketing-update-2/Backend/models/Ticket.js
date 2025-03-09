// Ticket Schema 

const mongoose = require('mongoose');
const { getDatabaseConnection } = require('../db/db');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Change Management", "Incident Management", "Problem Management","Request Management"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null // Not all tickets are assigned immediately
    },
    status: {
        type: String,
        required: true,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open"
    },
    priority: {
        type: String,
        required: true,
        enum: ["L1", "L2", "L3", "L4"]
    },
    attachments: [{
        type: String // Store URLs or file paths
    }],
    dueDate: {
        type: Date // Optional SLA tracking
    }
}, { timestamps: true });

// Function to get Ticket Model per Tenant
const getTicketModel = async (companyId) => {
    const connection = await getDatabaseConnection(companyId);
    return connection.model('Ticket', ticketSchema);
};

module.exports = {
    getTicketModel
};
