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
    required: false
  },
  deadline: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    enum: ["draft", "in_progress", "completed", "cancelled","pending"],
    default: "draft"
  },
  notes: {
    type: String,
    default: ""
  },
  priority: {
    type: Number,
    enum: [1, 2, 3],
    default: 2
  },
}, {
  timestamps: true 
});


const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
