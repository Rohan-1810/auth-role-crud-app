const express = require('express');
const router = express.Router();
const {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.route('/')
  .get(verifyToken, getTasks)
  .post(verifyToken, setTask);

router.route('/:id')
  .put(verifyToken, updateTask)
  // Restrict delete operation to 'admin' role only
  .delete(verifyToken, checkRole('admin'), deleteTask);

module.exports = router;
