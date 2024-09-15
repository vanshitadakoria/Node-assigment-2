const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String},
  age: { type: Number},
  grade: { type: String}
});

module.exports = mongoose.model('Student', studentSchema,"students");
