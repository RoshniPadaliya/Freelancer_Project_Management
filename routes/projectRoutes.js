// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
    createProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject,
    exportProjects,
    importProjects,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup for CSV uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `import_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Ensure the uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Routes
router.route('/get')
    // .post(protect, createProject)
    .get(protect, getAllProjects);

router.post('/create', protect, createProject);


router.route('/export')
    .get(protect, exportProjects);

router.route('/import')
    .post(protect, upload.single('file'), importProjects);

router.route('/:id')
    .get(protect, getProject)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

module.exports = router;
