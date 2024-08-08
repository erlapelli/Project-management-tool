const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentication');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,} = require('../controllers/projectcontroller');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', auth, createProject);

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, getProjects);

// @route   GET /api/projects/:id
// @desc    Get a project by ID
// @access  Private
router.get('/:id', auth, getProjectById);

// @route   PUT /api/projects/:id
// @desc    Update a project by ID
// @access  Private
router.put('/:id', auth, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project by ID
// @access  Private
router.delete('/:id', auth, deleteProject);

module.exports = router;
