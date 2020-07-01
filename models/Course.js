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
      required: [true, 'minimumSkill is required'],
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

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log(`Calculation the average cost for ${bootcampId} ...`.blue);

  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.log(error);
  }
};

CourseSchema.pre('save', async function () {
  this.constructor.getAverageCost(this.bootcamp);
});
CourseSchema.pre('remove', async function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
