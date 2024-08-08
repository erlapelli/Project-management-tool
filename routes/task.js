const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/task');
const auth = require('../middleware/authentication');

router.post('/:projectId/tasks', auth, createTask);
router.get('/:projectId/tasks', auth, getTasks);
router.put('/tasks/:taskId', auth, updateTask);
router.delete('/tasks/:taskId', auth, deleteTask);

module.exports = router;
