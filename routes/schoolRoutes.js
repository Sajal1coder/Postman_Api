const express = require('express');
const { addSchool, listSchools } = require('../controllers/schoolController');

const router = express.Router();

// POST /addSchool - Add a new school
router.post('/addSchool', addSchool);

// GET /listSchools - List schools sorted by proximity
router.get('/listSchools', listSchools);

module.exports = router;
