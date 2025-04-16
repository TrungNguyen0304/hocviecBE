const mongoose = require("mongoose");
const Task = require("../models/task");

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


module.exports = { viewAssignedTasks, updateTaskStatus };
