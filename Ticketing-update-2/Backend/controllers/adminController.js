const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserModel } = require("../models/Users");
const { getTicketModel } = require("../models/Ticket");
const mongoose = require("mongoose");

// Admin: Add a new agent
const addAgent = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { username, email, password, agentLevel } = req.body;
    const User = await getUserModel(companyId);

    const validLevels = ["L1", "L2", "L3", "L4"];
    if (!validLevels.includes(agentLevel)) {
      return res.status(400).json({ message: "Invalid agent level. Choose L1, L2, L3, or L4" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = new User({
      username,
      email,
      password: hashedPassword,
      role: "agent",
      agentLevel,
    });
    await newAgent.save();
    res.status(201).json({ message: "Agent added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error handling agent", error: error.message });
  }
};

// Admin: Update an agent's level
const updateAgentLevel = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { agentId, newLevel } = req.body;
    const User = await getUserModel(companyId);

    const validLevels = ["L1", "L2", "L3", "L4"];
    if (!validLevels.includes(newLevel)) {
      return res.status(400).json({ message: "Invalid agent level. Choose L1, L2, L3, or L4" });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found" });
    }

    agent.agentLevel = newLevel;
    await agent.save();

    res.status(200).json({ message: "Agent level updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating agent level" });
  }
};

// Admin: Remove an agent
const removeAgent = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { agentId } = req.body;
    const User = await getUserModel(companyId);

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found" });
    }

    await User.findByIdAndDelete(agentId);
    res.status(200).json({ message: "Agent removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing agent" });
  }
};

// Admin: Get all tickets with filters
const getAdminTickets = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status, priority, assignedAgent } = req.query;

    console.log(`🔍 Fetching tickets for companyId: ${companyId}`);

    const Ticket = await getTicketModel(companyId);

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedAgent) filter.assignedTo = assignedAgent;

    console.log("🔍 Filter being used:", filter);

    const tickets = await Ticket.find(filter);
    console.log("✅ Found Tickets:", tickets);

    res.status(200).json(tickets);
  } catch (error) {
    console.error("❌ Error fetching tickets:", error);
    res.status(500).json({ message: "Error fetching tickets", error: error.message });
  }
};

// Admin: Assign a ticket to an agent
const assignTicketToAgent = async (req, res) => {
  const { companyId, ticketId } = req.params;
  const { agentId } = req.body;

  try {
    const Ticket = await getTicketModel(companyId);
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.assignedTo = agentId;
    await ticket.save();

    res.status(200).json({ message: "Ticket assigned successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error assigning ticket", error });
  }
};

// Admin: Change ticket priority
const changeTicketPriority = async (req, res) => {
  const { companyId, ticketId } = req.params;
  const { priority } = req.body;

  try {
    const Ticket = await getTicketModel(companyId);
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.priority = priority;
    await ticket.save();

    res.status(200).json({ message: "Priority updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error updating priority", error });
  }
};

module.exports = {
  addAgent,
  updateAgentLevel,
  removeAgent,
  getAdminTickets,
  assignTicketToAgent,
  changeTicketPriority,
};
