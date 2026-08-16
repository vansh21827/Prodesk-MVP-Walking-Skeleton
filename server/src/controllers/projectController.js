import Project from "../models/Project.js";

// GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Server error while fetching projects",
    });
  }
};

// GET /api/projects/:id
export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      message: "Server error while fetching project",
    });
  }
};

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      priority,
      progress,
      tasks,
      totalTasks,
      members,
      dueDate,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      status,
      priority,
      progress,
      tasks,
      totalTasks,
      members,
      dueDate,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      message: "Server error while creating project",
    });
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "status",
      "priority",
      "progress",
      "tasks",
      "totalTasks",
      "members",
      "dueDate",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      message: "Server error while updating project",
    });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      message: "Server error while deleting project",
    });
  }
};