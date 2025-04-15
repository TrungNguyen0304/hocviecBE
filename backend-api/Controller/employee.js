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

module.exports = { viewAssignedTasks };
