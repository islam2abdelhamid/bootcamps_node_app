const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'course title is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    weeks: {
      type: String,
      required: [true, 'weeks is required'],
    },
    tuition: {
      type: Number,
      required: [true, 'tuition is required'],
    },
    minimumSkill: {
      type: String,
      required: [true, 'level is required'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    bootcamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bootcamp',
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
