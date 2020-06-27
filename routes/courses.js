const express = require('express');
const { getCourses } = require('../controllers/courses');

const router = new express.Router({ mergeParams: true });

router.route('/').get(getCourses);

module.exports = router;
