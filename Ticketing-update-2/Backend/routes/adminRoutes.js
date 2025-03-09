const express = require('express');
const router = express.Router();

const{authenticateUser,authorizeRoles} = require('../middleware/authMiddleware');
const { 
    addAgent, 
    updateAgentLevel, 
    removeAgent,
    getAdminTickets, 
    assignTicketToAgent, 
    changeTicketPriority 
} = require('../controllers/adminController');

// Add Agent Routes
router.post('/:companyId/add-agent', authenticateUser, authorizeRoles('admin'), addAgent);
router.post('/:companyId/agents', authenticateUser, authorizeRoles('admin'), updateAgentLevel);
router.delete('/:companyId/agents', authenticateUser, authorizeRoles('admin'), removeAgent);

// Admin Ticket Management Routes
router.get('/:companyId/tickets', authenticateUser, authorizeRoles('admin'), getAdminTickets);
router.put('/:companyId/tickets/:ticketId/assign', authenticateUser, authorizeRoles('admin'), assignTicketToAgent);

router.put('/:companyId/tickets/:ticketId/update-priority', authenticateUser, authorizeRoles('admin'), changeTicketPriority);


module.exports = router;

// How to test these routes ? 
//        STEP 1
// - > Since only admins can onboard agents, we first need to authenticate as admin to get a JWT Token
// -> Make a post request http://localhost:400/api/auth/login
// -> in headers Content-Type: application/json 
// ->Body(JSON)
// {
//     companyId:"",
//     "email":"",
//     "password":""
// }
// -> Expected Response -{
//     message: login successful,
//     token : blah blah blah - COPY THIS TOKEN
// }

// STEP 2 - 
// Now that we have an admin, add the support agent
// post request to add agent - > http://localhost:5000/api/admin/add-agent
// headers:{
//     "Content-Type":"application/json",
//     "Authorization: Bearer your jwt token"
// } 

// Body :{
//     "companyId":---,
//     "username:",

// }

// Step3 - verify in the database 