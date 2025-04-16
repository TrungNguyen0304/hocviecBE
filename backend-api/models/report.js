const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Giả sử nhân viên nằm trong model User
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    taskProgress: {
        type: String,
        required: true
    },
    difficulties: {
        type: String,
        default: ""
    },
    feedbackemployee: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
