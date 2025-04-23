const { use } = require("passport");
const user = require("../models/user")
const Task = require("../models/task");
const Report = require("../models/report")
const bcrypt = require("bcrypt");
const Feedback = require("../models/feedback");
const Notification = require("../models/notification")
const { notifyTask } = require("../Controller/notification");

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
    // Lấy giá trị sort và order từ query, mặc định là sort theo name tăng dần
    const sortField = req.query.sort || 'name';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;

    // Tạo object để sort
    const sortOptions = {};
    sortOptions[sortField] = sortOrder;

    // Lấy tất cả nhân viên và sắp xếp theo yêu cầu
    const employees = await user.find({ role: "employee" }).sort(sortOptions);

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
const paginationEmployees = async (req, res) => {
  try {
    const { limit = 3, page = 3 } = req.body;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const offset = (parsedPage - 1) * parsedLimit;

    const [docs, total] = await Promise.all([
      user.find({ role: "employee" }).skip(offset).limit(parsedLimit),
      user.countDocuments({ role: "employee" })
    ]);

    const pages = Math.ceil(total / parsedLimit);

    res.status(200).json({
      message: "Lấy danh sách nhân viên phân trang thành công.",
      docs: docs.map(emp => ({
        id: emp._id,
        name: emp.name,
        email: emp.email,
        role: emp.role
      })),
      total,
      limit: parsedLimit,
      offset,
      page: parsedPage,
      pages
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
 
// tao task 

const createTask = async (req, res) => {
  try {
    const { title, description, status, notes, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Thiếu tiêu đề công việc." });
    }

    const allowedStatuses = ["pending", "in_progress", "completed", "cancelled", "draft"];
    const allowedPriorities = [1, 2, 3];
    const taskStatus = allowedStatuses.includes(status) ? status : "draft";
    const taskPriority = allowedPriorities.includes(priority) ? priority : 2;

    const newTask = new Task({
      title,
      description,
      status: taskStatus,
      priority: taskPriority,
      notes
    });

    await newTask.save();

    res.status(201).json({
      message: "Tạo công việc thành công.",
      task: {
        _id: newTask._id,
        title: newTask.title,
        status: newTask.status,
        priority: newTask.priority,
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
    const { title, description, status, priority, notes } = req.body;

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
    if (priority) {
      task.priority = priority;
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
        priority: task.priority,
        notes: task.notes
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
const showallTask = async (req, res) => {
  try {
    const sortOption = req.query.sort;

    let sortCriteria = {};

    if (sortOption === "title_asc") {
      sortCriteria = { title: 1 };
    } else if (sortOption === "title_desc") {
      sortCriteria = { title: -1 };
    } else if (sortOption === "priority_asc") {
      sortCriteria = { priority: 1 };
    } else if (sortOption === "priority_desc") {
      sortCriteria = { priority: -1 }; // Low -> High
    }


    const tasks = await Task.find().sort(sortCriteria).lean();

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Không có công việc nào." });
    }

    res.status(200).json({
      message: "Danh sách công việc",
      sortBy: sortOption || "none",
      tasks: tasks.map(task => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        notes: task.notes
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
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
const paginationTask = async (req, res) => {
  try {
    const { limit = 3, page = 3 } = req.body;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const offset = (parsedPage - 1) * parsedLimit;

    const [docs, total] = await Promise.all([
      Task.find().skip(offset).limit(parsedLimit),
      Task.countDocuments()
    ]);

    const pages = Math.ceil(total / parsedLimit);

    res.status(200).json({
      message: "Lấy danh sách nhân viên phân trang thành công.",
      docs: docs.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        notes: task.notes
      })),
      total,
      limit: parsedLimit,
      offset,
      page: parsedPage,
      pages
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
    await notifyTask({ userId: assignedTo, task });

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
    const sortOption = req.query.sort;
    let sortCriteria = {};

    // Xác định tiêu chí sắp xếp
    if (sortOption === "title_asc") {
      sortCriteria = { title: 1 };
    } else if (sortOption === "title_desc") {
      sortCriteria = { title: -1 };
    } else if (sortOption === "priority_asc") {
      sortCriteria = { priority: 1 };
    } else if (sortOption === "priority_desc") {
      sortCriteria = { priority: -1 };
    }

    // Tìm task chưa được giao
    const tasks = await Task.find({
      $or: [
        { assignedTo: { $exists: false } },
        { assignedTo: null }
      ]
    }).sort(sortCriteria).lean();

    res.status(200).json({
      message: "Danh sách công việc chưa được giao.",
      sortBy: sortOption || "none",
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
const paginationUnassignedTasks = async (req, res) => {
  try {
    const { limit = 3, page = 1 } = req.body;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const offset = (parsedPage - 1) * parsedLimit;

    const filter = {
      $or: [
        { assignedTo: { $exists: false } },
        { assignedTo: null }
      ]
    };

    const [docs, total] = await Promise.all([
      Task.find(filter).skip(offset).limit(parsedLimit),
      Task.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / parsedLimit);

    res.status(200).json({
      message: "Phân trang công việc chưa được giao thành công.",
      tasks: docs.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        notes: task.notes
      })),
      total,
      page: parsedPage,
      offset,
      limit: parsedLimit,
      pages
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

// lấy ra công việc đã giao 
const getAssignedTasks = async (req, res) => {
  try {
    const sortOption = req.query.sort;
    let sortCriteria = {};

    // Xác định tiêu chí sắp xếp
    if (sortOption === "title_asc") {
      sortCriteria = { title: 1 };
    } else if (sortOption === "title_desc") {
      sortCriteria = { title: -1 };
    } else if (sortOption === "priority_asc") {
      sortCriteria = { priority: 1 };
    } else if (sortOption === "priority_desc") {
      sortCriteria = { priority: -1 };
    }

    const tasks = await Task.find({ assignedTo: { $ne: null } })
      .sort(sortCriteria)
      .populate("assignedTo", "name email");

    res.status(200).json({
      message: "Danh sách công việc đã được giao cho nhân viên.",
      sortBy: sortOption || "none",
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
const paginationAssignedTasks = async (req, res) => {
  try {
    const { limit = 3, page = 1 } = req.body;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const offset = (parsedPage - 1) * parsedLimit;

    const filter = {
      assignedTo: { $ne: null }
    };

    const [docs, total] = await Promise.all([
      Task.find(filter).skip(offset).limit(parsedLimit).populate("assignedTo", "name email"),
      Task.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / parsedLimit);

    res.status(200).json({
      message: "Phân trang công việc chưa được giao thành công.",
      tasks: docs.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        notes: task.notes,
        assignedTo: task.assignedTo
      })),
      total,
      page: parsedPage,
      offset,
      limit: parsedLimit,
      pages
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
const paginationReportEmployee = async (req, res) => {
  try {
    const { id } = req.params; // id của nhân viên
    const userId = req.user._id;
    const { limit = 5, page = 1 } = req.body;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const offset = (parsedPage - 1) * parsedLimit;

    // Kiểm tra nhân viên có tồn tại không
    const employee = await user.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Nhân viên không tồn tại." });
    }

    // Kiểm tra quyền truy cập: chỉ chính chủ hoặc manager mới được xem
    if (id !== userId.toString() && req.user.role !== "manager") {
      return res.status(403).json({ message: "Bạn không có quyền xem báo cáo của nhân viên này." });
    }

    const filter = { employee: id };

    const [docs, total] = await Promise.all([
      Report.find(filter)
        .skip(offset)
        .limit(parsedLimit)
        .populate("task", "title deadline status")
        .populate("employee", "name email"),
      Report.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / parsedLimit);

    if (docs.length === 0) {
      return res.status(404).json({ message: "Nhân viên này chưa gửi báo cáo nào." });
    }

    res.status(200).json({
      message: "Phân trang báo cáo của nhân viên thành công.",
      reports: docs,
      total,
      page: parsedPage,
      offset,
      limit: parsedLimit,
      pages
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};

// đánh giá báo cáo của nhân viên
const evaluateReport = async (req, res) => {
  try {
    const { id } = req.params; // id nay cua report
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

// xem thông báo khi nhân viên báo quá hạn
const viewNotification = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("employee", "name email")
      // .populate("manager", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      massage: "Lấy danh sách thông báo thành công",
      total: notifications.length,
      notifications
    });

  } catch (error) {
    res.status(500).json({ massage: "lỗi server", error: error.message })
  }
}

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
  evaluateReport,
  viewNotification,
  paginationEmployees,
  paginationTask,
  paginationUnassignedTasks,
  paginationAssignedTasks,
  paginationReportEmployee
};