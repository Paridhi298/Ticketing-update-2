const dotenv = require('dotenv');
const { getTicketModel } = require('../models/Ticket');
const {getUserModel} = require ('../models/Users')
dotenv.config();

const createTicket = async(req,res)=>{
    try{
        const {companyId} = req.params; 
        const{title,description,category,priority} = req.body;
        const createdBy = req.user.id ; 

        // Validate the required fields 
        if(!title || !description || !category || !priority ){
            return res.status(400).json({messsage:"All fields are required"}) ; 
        }

        // Validate the category 
        // const validCategories = ["Change Management","Incident Managememt","Problem Managenent","Request Management"];
        // if (!validCategories.includes(category)) {
        //     return res.status(400).json({ message: "Invalid category selected" });
        // }
        const validPriorities = ["L1", "L2", "L3", "L4"];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ message: "Invalid priority level" });
        }

        // Get the ticketing model for the tenant 
        const Ticket = await getTicketModel(companyId);

        // Create new ticket 
        const newTicket = new Ticket({
            title,
            description,
            category,
            priority,
            createdBy,
            status:"Open",
            assignedTo: null // Unassigned initially 
        })

        await newTicket.save();
        res.status(201).json({messsage:"Ticket raised successfully",ticket:newTicket});
    }catch(error){
        res.status(500).json({ message: "Error raising ticket", error: error.message });
    }
}

// how can user see the tickets that they have raised 
const userTickets = async(req,res)=>{
    try{
        const{companyId} = req.params; 
        if(!companyId){
            return res.status(403).json({ message: "Company ID is required" });
        }

        const Ticket = await getTicketModel(companyId);
        const userTickets = await Ticket.find({createdBy:req.user.id});
        res.status(200).json({tickets:userTickets});
    }catch(error){
        res.status(500).json({message:"error fetching tickets"});
    }

}

module.exports={
    createTicket,
    userTickets
}