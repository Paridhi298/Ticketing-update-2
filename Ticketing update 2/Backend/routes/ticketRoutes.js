const express = require('express');
const router = express.Router();
const { createTicket, userTickets } = require('../controllers/ticketController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');


router.post('/:companyId/createTicket',authenticateUser,authorizeRoles("admin","user","agent"),createTicket);

// diplay user tickets 
router.get('/:companyId/displayUserTicket',authenticateUser,authorizeRoles("user","admin"),userTickets)


module.exports = router ; 