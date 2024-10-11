// controllers/projectController.js
const Project = require('../models/Project');
const { exportProjectsToCSV, importProjectsFromCSV } = require('../utils/csvUtils');
const fs = require('fs');
const path = require('path');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    const { title, description, status, startDate, endDate } = req.body;

    const project = await Project.create({
        title,
        description,
        status,
        startDate,
        endDate,
        createdBy: req.user._id,
    });

    res.status(201).json(project);
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getAllProjects = async (req, res) => {
    const projects = await Project.find({ createdBy: req.user._id });
    res.json(projects);
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    const { title, description, status, startDate, endDate } = req.body;

    let project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.status = status || project.status;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;

    await project.save();

    res.json(project);
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project removed' });
};

// @desc    Export projects to CSV
// @route   GET /api/projects/export
// @access  Private
const exportProjects = async (req, res) => {
    const projects = await Project.find({ createdBy: req.user._id }).lean();

    // Modify projects data if necessary
    const csvFilePath = await exportProjectsToCSV(projects);

    res.download(csvFilePath, 'projects_export.csv', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error exporting CSV' });
        }

        // Delete the file after sending
        fs.unlinkSync(csvFilePath);
    });
};

// @desc    Import projects from CSV
// @route   POST /api/projects/import
// @access  Private
const importProjects = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const filePath = path.join(__dirname, '../', req.file.path);

    try {
        const projectsData = await importProjectsFromCSV(filePath);

        // Map CSV data to Project schema
        const projectsToInsert = projectsData.map((proj) => ({
            title: proj.Title,
            description: proj.Description,
            status: proj.Status || 'Not Started',
            startDate: proj['Start Date'] ? new Date(proj['Start Date']) : new Date(),
            endDate: proj['End Date'] ? new Date(proj['End Date']) : null,
            createdBy: req.user._id,
        }));

        // Insert into database
        await Project.insertMany(projectsToInsert);

        res.json({ message: 'Projects imported successfully', count: projectsToInsert.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error importing CSV', error: error.message });
    } finally {
        // Delete the uploaded file
        fs.unlinkSync(filePath);
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject,
    exportProjects,
    importProjects,
};
