const express = require('express');
const { viewAssignedTasks, updateTaskStatus, createDailyReport, viewManagerFeedback } = require('../Controller/employee.js');
const authenticateJWT = require('../middleware/auth.js');


const router = express.Router();
// xem task của mình được giao
router.get('/showall/', authenticateJWT, viewAssignedTasks);

// cập nhật trạng thái task
router.put('/updateTaskStatus/:id', authenticateJWT, updateTaskStatus);

// gửi báo cáo
router.post('/report/', authenticateJWT, createDailyReport);

// xem đánh giá từ quản lý 
router.get('/viewFeedback/', authenticateJWT, viewManagerFeedback);

module.exports = router;
