const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

router.post('/', authenticateJWT, async (req, res) => {
  console.log(req.body);
  const { name, age, grade } = req.body;
  const student = new Student({ name, age, grade });
  await student.save();
  res.status(201).json(student);
});

router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name, age, grade } = req.body;
  const student = await Student.findByIdAndUpdate(id, { name, age, grade }, { new: true });
  res.json(student);
});

router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndDelete(id);
  res.status(204).end();
});

module.exports = router;
