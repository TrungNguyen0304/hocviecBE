const Task = require("../models/task");
const Report = require("../models/report");
const User = require("../models/user");
const Notification = require("../models/notification");

const checkMissedReports = async (req, res) => {
  try {
    const now = new Date();

    // Lấy tất cả công việc quá hạn mà đã được giao cho nhân viên
    const overdueTasks = await Task.find({
      deadline: { $lt: now },
      assignedTo: { $ne: null }
    });

    const notifications = [];

    for (const task of overdueTasks) {
      // Kiểm tra xem nhân viên đã gửi báo cáo cho task này chưa
      const hasReport = await Report.exists({
        employee: task.assignedTo,
        task: task._id
      });

      // Nếu chưa có báo cáo
      if (!hasReport) {
        const employee = await User.findById(task.assignedTo);
        const manager = await User.findOne({ role: "manager" });

        if (!employee || !manager) continue;

        // Tránh tạo thông báo trùng lặp
        const alreadyNotified = await Notification.exists({
          employee: employee._id,
          manager: manager._id,
          reportDate: task.deadline,
          message: { $regex: task.title }
        });

        if (alreadyNotified) continue;

        const message = `Nhân viên ${employee.name} chưa gửi báo cáo cho công việc "${task.title}" (Deadline: ${task.deadline.toLocaleDateString("vi-VN")}).`;

        const newNotification = new Notification({
          message,
          reportDate: task.deadline,
          employee: employee._id,
          manager: manager._id,
          isRead: false // thêm luôn nếu bạn đã cập nhật schema
        });

        await newNotification.save();

        // Push bản đầy đủ ra ngoài response
        notifications.push({
          _id: newNotification._id,
          message: newNotification.message,
          reportDate: newNotification.reportDate,
          isRead: newNotification.isRead,
          employee: {
            _id: employee._id,
            name: employee.name,
            email: employee.email
          },
          task: {
            _id: task._id,
            title: task.title,
            description: task.description,
            deadline: task.deadline,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
          }
        });
      }
    }

    res.status(200).json({
      message: "Kiểm tra báo cáo trễ thành công.",
      total: notifications.length,
      notifications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// đánh dấu thông báo đã đọc
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo." });
    }

    res.status(200).json({
      message: "Đã đánh dấu thông báo là đã đọc.",
      notification
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { checkMissedReports, markNotificationAsRead };
