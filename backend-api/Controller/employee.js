const mongoose = require("mongoose");
const Task = require("../models/task");
const Report = require("../models/report")
const Feedback = require('../models/feedback');

// xem task mình được giao
const viewAssignedTasks = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const tasks = await Task.find({ assignedTo: userId });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "Bạn chưa được giao nhiệm vụ nào." });
        }

        res.status(200).json({
            message: "Danh sách nhiệm vụ được giao.",
            tasks: tasks.map(task => ({
                id: task._id,
                title: task.title,
                description: task.description,
                deadline: task.deadline,
                status: task.status,
                notes: task.notes
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
// cập nhật trạng thái 
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user._id // lay tu middleware neu cs

        const allowedStatuses = ["pending", "in_progress", "completed"]

        if (!allowedStatuses.includes(status)) {
            return res.status(404).json({ message: "Trạng thái không hợp lệ" })

        }
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "công việc không tồn tại" });

        }

        if (task.assignedTo?.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật công việc này." });
        }

        task.status = status;
        await task.save();
        res.status(200).json({ massege: "cập nhật trạng thái thành công", task });

    } catch (error) {
        res.status(500).json({ massege: "lỗi server", error: error.message })
    }
};
// gửi báo cáo 
const createDailyReport = async (req, res) => {
    try {
        const { taskId, content, taskProgress, difficulties, feedbackemployee } = req.body;
        const userId = req.user._id;

        // Kiểm tra thông tin bắt buộc
        if (!taskId || !content || !taskProgress) {
            return res.status(400).json({ message: "Thiếu taskId, nội dung hoặc tiến độ công việc." });
        }

        // Kiểm tra task có tồn tại và thuộc về nhân viên hiện tại không
        const task = await Task.findOne({ _id: taskId, assignedTo: userId });
        if (!task) {
            return res.status(403).json({ message: "Bạn không được giao công việc này." });
        }

        // Tạo báo cáo
        const report = new Report({
            employee: userId,
            task: taskId,
            content,
            taskProgress,
            difficulties,
            feedbackemployee
        });

        await report.save();

        res.status(201).json({
            message: "Gửi báo cáo thành công.",
            report
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

// nhận thông báo đánh giá từ quản lý
const viewManagerFeedback = async (req, res) => {
    try {
        const employeeId = req.user._id; // Lấy từ middleware auth

        // Tìm tất cả báo cáo của nhân viên
        const reports = await Report.find({ employee: employeeId });

        const reportIds = reports.map(r => r._id);

        // Lấy feedback gắn với các report đó
        const feedbacks = await Feedback.find({ report: { $in: reportIds } })
            .populate('report', 'date taskProgress difficulties feedbackemployee') 
            .populate('manager', 'name email');

        res.status(200).json({
            message: "Lấy feedback từ manager thành công.",
            total: feedbacks.length,
            feedbacks
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

module.exports = { viewAssignedTasks, updateTaskStatus, createDailyReport, viewManagerFeedback };
