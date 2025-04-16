const express = require('express');
const {viewAssignedTasks,updateTaskStatus} = require('../Controller/employee.js');
const authenticateJWT = require('../middleware/auth.js');


const router = express.Router();

router.get('/showall/', authenticateJWT, viewAssignedTasks);
router.put('/updateTaskStatus/:id', authenticateJWT, updateTaskStatus);



module.exports = router;
