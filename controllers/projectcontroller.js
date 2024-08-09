const Project = require('../models/Project');

// Create a new project
exports.createProject = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      user: req.user.userId
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all projects for a user
exports.getProjects = async (req, res) => {
    try {
        let projects;

        //console.log("User role:",req.user.role);

        if (req.user.role === 'Admin') {
         // Admin can see all projects
        // console.log('Fetching all projects for admin')

          projects = await Project.find();

        } else {
            // Regular users can see only their projects
         // console.log('Fetching all projects for user:', req.user.userId)
          projects = await Project.find({ user: req.user.userId });
        }
        res.json(projects);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  const { name, description } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    //Check if the user owns the project
    // if (project.user.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }

    project.name = name || project.name;
    project.description = description || project.description;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

  

    // if (!project.user || !project.user.toString) {
    //     return res.status(400).json({ msg: 'Project does not have an associated user' });
    // }

      // Check if the user is authorized to delete the project
      if (req.user.role !== 'Admin' && project.user.toString() !== req.user.userId) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
