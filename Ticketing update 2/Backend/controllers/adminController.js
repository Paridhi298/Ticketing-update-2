const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const{getUserModel} = require('../models/Users');
const { getTicketModel } = require('../models/Ticket');
const mongoose = require("mongoose");
// Admin : Add a new agent / onboarding an agent 

const addAgent = async(req ,res)=>{
    try{
        const{companyId} = req.params; // Extract the companyId from URL paramas
        const{username,email,password,agentLevel} = req.body; 
        const User = await getUserModel(companyId);
        
        // Check if the agentLevel is valid 
        const validLevels = ["L1","L2","L3","L4"];
        if(!validLevels.includes(agentLevel)){
            return res.status(400).json({message:"Invalid agent level.Choose L1, L2,L3 or L4"})
        }
        // check if the user already exists 

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Agent already exists"})
        }

        // Hash the password 
        const hashedPassword = await bcrypt.hash(password,10);

        // Create a new agent 
        const newAgent = new User({
            username,
            email,
            password:hashedPassword,
            role:"agent",
            agentLevel
        })
        await newAgent.save();
        res.status(201).json({message:"Agent added successfully"})
    } catch(error){
        res.status(500).json({message:"Error handling agent",error:error.message})
    }

}

// Admin updating an agent level 
const updateAgentLevel = async(req,res)=>{
    try{
        const{companyId} = req.params
        const{agentId,newLevel} = req.body ; 
        const User = await getUserModel(companyId);

        // Validate the new level
        const validLevels = ["L1","L2","L3","L4"];
        if (!validLevels.includes(newLevel)) {
            return res.status(400).json({message:"Invalid agent level.Choose L1, L2,L3 or L4"})
        }

        const agent = await User.findById(agentId);
        if(!agent || agent.role!=="agent"){
            return res.status(404).json({message:'Agent not found'})
        }

        agent.agentLevel = newLevel ; 
        await agent.save();

        res.status(200).json({message:'Agent level updated successfully'}); 
    }catch(error){
        res.status(500).json({message:"Error updating agent level"})
    }
}


// Admin removing an agent 
const removeAgent = async(req,res)=>{
    try{
        const{companyId} = req.params;
        const{agentId} = req.body ; 
        
        const User = await getUserModel(companyId);

        const agent = await User.findById(agentId);
        if(!agent || agent.role !=="agent"){
            return res.status(404).json({message:'agent not found'})
        }

        await User.findByIdAndDelete(agentId);
        res.status(200).json({message:"Agent removed successfully"});
    }catch(error){
        res.status(500).json({message:"Error removing agent"})
    } 
}


const getAdminTickets = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { status, priority, assignedAgent } = req.query;

        console.log(`🔍 Fetching tickets for companyId: ${companyId}`);

        // Get the correct Ticket model for this company
        const Ticket = await getTicketModel(companyId);

        // Build filter (Remove companyId since it's handled by getTicketModel)
        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignedAgent) filter.assignedAgent = assignedAgent;

        console.log("🔍 Filter being used:", filter);

        // Fetch tickets
        const tickets = await Ticket.find(filter);
        console.log("✅ Found Tickets:", tickets);

        res.status(200).json(tickets);
    } catch (error) {
        console.error("❌ Error fetching tickets:", error);
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};


const assignTicketToAgent = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { ticketId, agentId } = req.body;

        console.log(`🔍 Received ticketId: ${ticketId}, agentId: ${agentId}`);

        // Validate ObjectId format before querying MongoDB
        if (!mongoose.Types.ObjectId.isValid(ticketId) || !mongoose.Types.ObjectId.isValid(agentId)) {
            console.error("❌ Invalid ObjectId format detected");
            return res.status(400).json({ message: "Invalid ticketId or agentId format. Ensure they are correct MongoDB ObjectIds." });
        }

        // Convert string IDs into ObjectIds using createFromHexString
        const objectIdTicketId = mongoose.Types.ObjectId.createFromHexString(ticketId);
        const objectIdAgentId = mongoose.Types.ObjectId.createFromHexString(agentId);

        // Get the correct Ticket model for the company
        const Ticket = await getTicketModel(companyId);

        // Find and update the ticket in a single operation
        const updatedTicket = await Ticket.findByIdAndUpdate(
            objectIdTicketId,
            { assignedTo: objectIdAgentId },
            { new: true } // Ensure we get the updated document
        );

        if (!updatedTicket) {
            console.error("❌ Ticket not found in database");
            return res.status(404).json({ message: "Ticket not found" });
        }

        console.log("✅ Ticket assigned successfully:", updatedTicket);
        res.status(200).json({ message: "Ticket assigned successfully", ticket: updatedTicket });
    } catch (error) {
        console.error("❌ Error assigning ticket:", error);
        res.status(500).json({ message: "Error assigning ticket to agent", error: error.message });
    }
};


// Admin: Change ticket priority
const changeTicketPriority = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { ticketId, newPriority } = req.body;

        console.log(`🔍 Received ticketId: ${ticketId}, newPriority: ${newPriority}`);

        // Validate ObjectId format before querying MongoDB
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            console.error("❌ Invalid ObjectId format detected");
            return res.status(400).json({ message: "Invalid ticketId format. Ensure it is a valid MongoDB ObjectId." });
        }

        // Convert ticketId to ObjectId using createFromHexString
        const objectIdTicketId = mongoose.Types.ObjectId.createFromHexString(ticketId);

        // Get the correct Ticket model for the company
        const Ticket = await getTicketModel(companyId);

        // 🔹 FIX: Search by `_id` ONLY (companyId is not stored in the ticket)
        const ticket = await Ticket.findOne({ _id: objectIdTicketId });

        if (!ticket) {
            console.error("❌ Ticket not found in database");
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Update the ticket priority
        ticket.priority = newPriority;
        await ticket.save();

        console.log("✅ Ticket priority updated successfully:", ticket);
        res.status(200).json({ message: "Ticket priority updated successfully", ticket });
    } catch (error) {
        console.error("❌ Error changing ticket priority:", error);
        res.status(500).json({ message: "Error changing ticket priority", error: error.message });
    }
};

module.exports = {
    addAgent,
    updateAgentLevel,
    removeAgent,
    getAdminTickets,
    assignTicketToAgent,
    changeTicketPriority
};