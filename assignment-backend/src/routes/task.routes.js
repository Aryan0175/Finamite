const express = require('express');
const router = express.Router();
const { createTask, updateTask, deleteTask, getTasks, getDashboardStats } = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // Secure all task routes

router.route('/stats')
    .get(getDashboardStats);
router.route('/')
    .post(createTask);

router.route('/')
    .get(getTasks);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;