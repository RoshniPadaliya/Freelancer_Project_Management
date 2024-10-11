// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message  });
});

app.get('/', (req, res) => {
    res.send(`
           <center>
            <h1>Welcome to the Education-Management-system</h1>
            <br>
            <p>
                Get EXPENSE_CONTROLLER_TOOL: 
            <a href="https://github.com/RoshniPadaliya/freelancer_project_management.git" target="_blank">Repository:Freelancer Project Management </a>
            </p>
        </center>
    `);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
