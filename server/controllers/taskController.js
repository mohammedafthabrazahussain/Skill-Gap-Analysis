const Task = require('../models/Task');

// @desc    Get all user tasks
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ deadline: 1 });
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update task status
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        if (task.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

        task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        if (task.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

        await task.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
