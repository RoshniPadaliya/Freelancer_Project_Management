// controllers/paymentController.js
const Payment = require('../models/Payment');
const Project = require('../models/Project');

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
    const { projectId, amount } = req.body;

    // Check if project exists and belongs to the user
    const project = await Project.findOne({ _id: projectId, createdBy: req.user._id });

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const payment = await Payment.create({
        project: projectId,
        amount,
        createdBy: req.user._id,
    });

    res.status(201).json(payment);
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getAllPayments = async (req, res) => {
    const payments = await Payment.find({ createdBy: req.user._id }).populate('project');
    res.json(payments);
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
const getPayment = async (req, res) => {
    const payment = await Payment.findOne({ _id: req.params.id, createdBy: req.user._id }).populate('project');

    if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
const updatePayment = async (req, res) => {
    const { amount, status } = req.body;

    let payment = await Payment.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    payment.amount = amount || payment.amount;
    payment.status = status || payment.status;

    if (status === 'Paid') {
        payment.paidAt = Date.now();
    }

    await payment.save();

    res.json(payment);
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private
const deletePayment = async (req, res) => {
    const payment = await Payment.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment removed' });
};

// @desc    Simulate payment gateway and mark as paid
// @route   POST /api/payments/:id/pay
// @access  Private
const simulatePayment = async (req, res) => {
    const payment = await Payment.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'Paid') {
        return res.status(400).json({ message: 'Payment already marked as paid' });
    }

    // Simulate payment process (e.g., contacting Stripe)
    // For this simulation, we'll directly mark it as paid
    payment.status = 'Paid';
    payment.paidAt = Date.now();
    await payment.save();

    res.json({ message: 'Payment marked as paid', payment });
};

module.exports = {
    createPayment,
    getAllPayments,
    getPayment,
    updatePayment,
    deletePayment,
    simulatePayment,
};
