const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "cancelled"],
    default: "pending"
  },
  notes: {
    type: String,
    default: ""
  }
}, {
  timestamps: true 
});


const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
