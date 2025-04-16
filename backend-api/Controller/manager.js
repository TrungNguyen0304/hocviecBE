const { use } = require("passport");
const user = require("../models/user")
const Task = require("../models/task");
const Report = require("../models/report")
const bcrypt = require("bcrypt");
const Feedback = require("../models/feedback");

const createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại." });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new user({
      name,
      email,
      password: hashedPassword,
      role: "employee"
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Tạo nhân viên thành công.",
      user: {
        id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
const updateEmpoyee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const existingUser = await user.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "Nhân viên không tồn tại" });
    }

    if (email && email !== existingUser.email) {
      const emailTaken = await user.findOne({ email });
      if (emailTaken && emailTaken._id.toString() !== id) {
        return res.status(400).json({ message: "Email đã được sử dụng bởi người dùng khác." });
      }
      existingUser.email = email;
    }
    if (name) {
      existingUser.name = name;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
    }

    await existingUser.save();
    res.status(200).json({
      message: "Cập nhật nhân viên thành công.",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
}
const showAllEmployees = async (req, res) => {
  try {
    // Lấy tất cả nhân viên
    const employees = await user.find({ role: "employee" });

    if (employees.length === 0) {
      return res.status(404).json({ message: "Không có nhân viên nào." });
    }

    // Trả về danh sách nhân viên
    res.status(200).json({
      message: "Lấy danh sách nhân viên thành công.",
      employees: employees.map(emp => ({
        id: emp._id,
        name: emp.name,
        email: emp.email,
        role: emp.role
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm user theo id
    const existingUser = await user.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "Nhân viên không tồn tại." });
    }

    // Xóa nhân viên
    await user.findByIdAndDelete(id);

    res.status(200).json({
      message: "Xóa nhân viên thành công.",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

// tao task 

const createTask = async (req, res) => {
  try {
    const { title, description, status, notes } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Thiếu tiêu đề công việc." });
    }

    const allowedStatuses = ["pending", "in_progress", "completed", "cancelled", "draft"];
    const taskStatus = allowedStatuses.includes(status) ? status : "draft";

    const newTask = new Task({
      title,
      description,
      status: taskStatus,
      notes
    });

    await newTask.save();

    res.status(201).json({
      message: "Tạo công việc thành công.",
      task: {
        _id: newTask._id,
        title: newTask.title,
        status: newTask.status,
        notes: newTask.notes
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, notes } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Công việc không tồn tại." });
    }
    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    if (status) {
      const allowedStatuses = ["pending", "in_progress", "completed", "cancelled", "draft"];
      if (allowedStatuses.includes(status)) {
        task.status = status;
      } else {
        return res.status(400).json({ message: "Trạng thái không hợp lệ." });
      }
    }
    if (notes) {
      task.notes = notes;
    }

    // Lưu công việc đã được cập nhật
    await task.save();

    res.status(200).json({
      message: "Cập nhật công việc thành công.",
      task: {
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        notes: task.notes
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
const showallTask = async (req, res) => {
  try {
    const tasks = await Task.find();

    if (tasks.length == 0) {
      return res.status(404).json({ massage: "không có công việc nào" })
    }

    res.status(200).json({
      massage: "danh sách công việc",
      tasks: tasks.map(task => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        notes: task.notes,
      }))
    })
  } catch (error) {
    res.status(500).json({ massage: "lỗi server", error: error.massage })
  }
}
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    const task = await Task.findById(id)
    if (!task) {
      res.status(404).json({ message: "Công việc không tồn tại" })
    }
    await Task.findByIdAndDelete(id);
    res.status(200).json({
      message: "Xóa công việc thành công.",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

// gán task cho nhân viên
const assignTask = async (req, res) => {
  try {
    const { id } = req.params; 
    const { assignedTo, deadline } = req.body;

    if (!assignedTo || !deadline) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc (assignedTo, deadline)." });
    }

    // Tìm task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Công việc không tồn tại." });
    }

    // Tìm nhân viên
    const employee = await user.findById(assignedTo);
    if (!employee || employee.role !== "employee") {
      return res.status(404).json({ message: "Nhân viên không hợp lệ." });
    }

    // Gán thông tin
    task.assignedTo = assignedTo;
    task.deadline = deadline;
    task.status = "pending";

    await task.save();

    res.status(200).json({
      message: "Gán công việc thành công.",
      task: {
        id: task._id,
        title: task.title,
        assignedTo: {
          id: employee._id,
          name: employee.name
        },
        deadline: task.deadline,
        status: task.status
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

// xem danh sách công việc của một nhân viên cụ thể,
const viewEmployeeTask = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await user.findById(id);
    if (!employee || employee.role !== "employee") {
      return res.status(404).json({ message: "Nhân viên không hợp lệ." });
    }

    const tasks = await Task.find({ assignedTo: id });

    res.status(200).json({
      message: `Danh sách công việc của nhân viên ${employee.name}`,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

//Lấy công việc chưa giao
const getUnassignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: { $exists: false } }); // hoặc assignedTo: null

    res.status(200).json({
      message: "Danh sách công việc chưa được giao.",
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

// lấy ra công việc đã giao 
const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: { $ne: null } }).populate("assignedTo", "name email");

    res.status(200).json({
      message: "Danh sách công việc đã được giao cho nhân viên.",
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

// xem báo cáo của nhân viên
const viewReport = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("task", "title deadline status")
      .populate("employee", "name email");
    res.status(200).json({
      message: "lấy danh sách báo cáo thành công",
      total: reports.length,
      reports
    });
  } catch (error) {
    res.status(500).json({ massage: "lỗi server.", error: error.message })
  }
}

// xem báo cáo từng nhân viên
const viewReportEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const employee = await user.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Nhân viên không tồn tại." });
    }

    if (id !== userId && req.user.role !== "manager") {
      return res.status(403).json({ message: "Bạn không có quyền xem báo cáo của nhân viên này." });
    }

    // Tìm tất cả các báo cáo của nhân viên này và populate thông tin task
    const reports = await Report.find({ employee: id })
      .populate("task", "title deadline status")
      .populate("employee", "name email");

    if (reports.length === 0) {
      return res.status(404).json({ message: "Nhân viên này chưa gửi báo cáo nào." });
    }

    res.status(200).json({
      message: "Lấy báo cáo của nhân viên thành công.",
      reports
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

// đánh giá báo cáo của nhân viên
const evaluateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, score } = req.body;
    const managerId = req.user._id; 

    if (typeof score !== 'number' || score < 0 || score > 10) {
      return res.status(400).json({ message: 'Điểm đánh giá phải từ 0 đến 10.' });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Báo cáo không tồn tại.' });
    }

    const existingFeedback = await Feedback.findOne({ report: id });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Báo cáo này đã được đánh giá.' });
    }

    const feedback = new Feedback({
      report: id,
      manager: managerId,
      comment,
      score
    });

    await feedback.save();

    report.feedback = feedback._id;
    await report.save();

    res.status(201).json({
      message: 'Đánh giá báo cáo thành công.',
      feedback
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server.', error: error.message });
  }
};

module.exports = {
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
};