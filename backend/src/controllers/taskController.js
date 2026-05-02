const Task = require('../models/Task');

// @desc    Get tasks
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    // If admin, they could see all tasks, but usually it's just the user's tasks
    // Based on the prompt, it says "Task entity with full CRUD. Ensure the "Delete" operation is restricted to the admin role only."
    // Let's just return tasks for the logged in user to keep it simple, or all tasks if we want the admin to see them.
    // Assuming standard behavior: return user's tasks.
    const tasks = await Task.find({ user: req.user.id });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Set task
// @route   POST /api/v1/tasks
// @access  Private
const setTask = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.description) {
      res.status(400);
      throw new Error('Please add title and description fields');
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'pending',
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user (Wait, if admin updates, maybe allow? For now, just user who created it or admin)
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private (Admin only)
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Role check is already handled by middleware checkRole('admin') on the route
    
    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
};
