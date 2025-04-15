const express = require('express');
const {viewAssignedTasks,} = require('../Controller/employee.js');
const authenticateJWT = require('../middleware/auth.js');
const authorize = require('../middleware/authorize.js');

const router = express.Router();

// Chỉ manager mới có thể tạo employee

router.get('/showall/', authenticateJWT, viewAssignedTasks);


module.exports = router;
