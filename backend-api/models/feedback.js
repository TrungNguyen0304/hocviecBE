const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema({
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
        required: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    comment: {
        type: String,
        default: ''
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    }
}, {
    timestamps: true
})

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;