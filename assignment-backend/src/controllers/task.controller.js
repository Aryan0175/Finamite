const Task = require("../models/task.model");

exports.createTask = async (req, res, next) => {
  try {
    const { title, status, description, priority, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const task = await Task.create({
      title,
      status: status || "Pending",
      description,
      priority: priority || "Medium",
      dueDate,
      userId: req.user,
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let filter = { userId: req.user };
    if (status && status !== "All") {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this task" });
    }
    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this task" });
    }
    await task.deleteOne();
    res.status(200).json({ message: "Task removed successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user;
    const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const [totalTasks, pendingTasks, completedTasks, completedTodayTasks, completedThisWeekTasks] = await Promise.all([
            Task.countDocuments({ userId }),                               
            Task.countDocuments({ userId, status: 'Pending' }),            
            Task.countDocuments({ userId, status: 'Completed' }), 
            Task.countDocuments({ userId, status: 'Completed', updatedAt: { $gte: startOfToday } }),
            Task.countDocuments({ userId, status: 'Completed', updatedAt: { $gte: startOfWeek } })          
        ]);

        res.status(200).json({
            totalTasks,
            pendingTasks,
            completedTasks,
            completedToday: completedTodayTasks,
            completedThisWeek: completedThisWeekTasks
        });
  } catch (error) {
    next(error);    
    }
};
