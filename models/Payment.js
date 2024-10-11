// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
    paidAt: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Add other fields as necessary
}, {
    timestamps: true,
});

module.exports = mongoose.model('Payment', PaymentSchema);
