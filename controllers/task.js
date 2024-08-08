const Task = require('../models/Task');
const Project = require('../models/Project');
const {StatusCodes} = require('http-status-codes');

exports.createTask = async (req, res) => {
  const { name, description, status } = req.body;
  const { projectId } = req.params;
   console.log('Fetching tasks for project ID:', projectId);

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // if (project.user.toString() !== req.user.userId) {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }

        // Check if the user is authorized to create tasks in the project
        if (req.user.role !== 'Admin' && project.user.toString() !== req.user.userId) {
            return res.status(401).json({ msg: 'Not authorized' });
          }
      

    const newTask = new Task({
      name,
      description,
      status,
      project: projectId,
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({ project: projectId });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { name, description, status } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (project.user.toString() !== req.user.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task.name = name || task.name;
    task.description = description || task.description;
    task.status = status || task.status;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    // if (project.user.toString() !== req.user.userId) {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }

    if (!project) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Project not found' });
      }
  
      if (project.user.toString() !== req.user.userId && req.user.role !== 'Admin') {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Not authorized' });
      }

    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
