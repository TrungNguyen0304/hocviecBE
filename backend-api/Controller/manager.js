const { use } = require("passport");
const user = require("../models/user")
const Task = require("../models/task");
const bcrypt = require("bcrypt");

const createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
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

    // tim use theo id

    const existingUser = await user.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "Nhân viên không tồn tại" });
    }

    // neu email moi khac va da ton tai thi -> bao loi 
    if (email && email !== existingUser.email) {
      const emailTaken = await user.findOne({ email });
      if (emailTaken && emailTaken._id.toString() !== id) {
        return res.status(400).json({ message: "Email đã được sử dụng bởi người dùng khác." });
      }
      existingUser.email = email;
    }
    // Cập nhật name nếu có
    if (name) {
      existingUser.name = name;
    }

    // Nếu có password mới thì mã hóa lại
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

    // Nếu không có nhân viên
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

// giao task cho nhân viên

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, status, notes } = req.body;

    if (!title || !assignedTo || !deadline) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    const employee = await user.findById(assignedTo);
    if (!employee || employee.role !== "employee") {
      return res.status(404).json({ message: "Nhân viên không hợp lệ." });
    }

    const newTask = new Task({
      title,
      description,
      assignedTo: employee._id, // đảm bảo lưu đúng ObjectId
      deadline,
      status,
      notes
    });

    await newTask.save();

    res.status(201).json({
      message: "Tạo công việc thành công.",
      task: {
        id: newTask._id,
        title: newTask.title,
        assignedTo: {
          id: employee._id,
          name: employee.name
        },
        deadline: newTask.deadline,
        status: newTask.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};



module.exports = {
  createEmployee,
  updateEmpoyee,
  showAllEmployees,
  deleteEmployee,
  createTask
};