// models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a project title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a project description'],
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date'],
    },
    endDate: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
   
}, {
    timestamps: true,
});

module.exports = mongoose.model('Project', ProjectSchema);
