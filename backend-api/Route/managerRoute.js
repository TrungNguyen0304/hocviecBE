const express = require('express');
const {
    createEmployee,
    updateEmpoyee,
    showAllEmployees,
    deleteEmployee,
    createTask,
} = require('../Controller/manager.js');
const authenticateJWT = require('../middleware/auth.js');
const authorize = require('../middleware/authorize.js');

const router = express.Router();

// Chỉ manager mới có thể tạo employee
router.post('/create', authenticateJWT, authorize('manager'), createEmployee);
router.put('/update/:id', authenticateJWT, authorize('manager'), updateEmpoyee);
router.delete('/delete/:id', authenticateJWT, authorize('manager'), deleteEmployee);
router.get('/showall/', authenticateJWT, authorize('manager'), showAllEmployees);

// giao việc cho nhân viên 
router.post('/createTask', authenticateJWT, authorize('manager'), createTask);


module.exports = router;
