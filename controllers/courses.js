const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const CustomError = require('../utils/CustomError');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  query.populate({
    path: 'bootcamp',
    select: 'name description',
  });

  const courses = await query;

  res.status(200).json({ success: true, data: courses, count: courses.length });
});

// @desc    Get single course
// @route   GET /api/v1/course/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(new CustomError('NotFound', req.params.id));
  }

  res.status(200).json({ success: true, data: course });
});

// @desc    Create new course
// @route   POST /api/v1/courses
// @access  private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new CustomError('NotFound', req.params.bootcampId));
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return next(new CustomError('NotFound', req.params.id));
  }

  res.status(200).json({ success: true, data: course });
});

// @desc    Delete course
// @route   Delete /api/v1/courses/:id
// @access  private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new CustomError('NotFound', req.params.id));
  }

  await course.remove();

  res.status(200).json({ success: true, data: {} });
});
