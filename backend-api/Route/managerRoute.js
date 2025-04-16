const express = require('express');
const {
    createEmployee,
    updateEmpoyee,
    showAllEmployees,
    deleteEmployee,
    createTask,
    updateTask,
    showallTask,
    deleteTask,
    assignTask,
    viewEmployeeTask,
    getUnassignedTasks,
    getAssignedTasks,
    viewReport,
    viewReportEmployee,
    evaluateReport
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
router.get('/showallTask', authenticateJWT, authorize('manager'), showallTask);
router.put('/updateTask/:id', authenticateJWT, authorize('manager'), updateTask);
router.delete('/deleteTask/:id', authenticateJWT, authorize('manager'), deleteTask);

// gán việc cho nhân viên
router.put('/assignTask/:id', authenticateJWT, authorize('manager'), assignTask);

//xem danh sách công việc của một nhân viên cụ thể
router.get('/viewEmployeeTask/:id', authenticateJWT, authorize('manager'), viewEmployeeTask);

// lấy công việc chưa giao
router.get('/unassigned/', authenticateJWT, authorize('manager'), getUnassignedTasks);

// lấy ra công việc đã giao 
router.get('/getassigned/', authenticateJWT, authorize('manager'), getAssignedTasks);

// xem danh sach báo cáo 
router.get('/viewreport/', authenticateJWT, authorize('manager'), viewReport);

// xem danh sách báo cáo từng nhân viên cụ thể
router.get('/viewReportEmployee/:id', authenticateJWT, authorize('manager'), viewReportEmployee);

// đánh giá báo cáo của nhân viên
router.post('/evaluateReport/:id', authenticateJWT, authorize('manager'), evaluateReport);

module.exports = router;
