const express = require('express');
const { createMember, getMemberHistory } = require('../controllers/members.controller');
const { protect, requireLibrarian } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { memberSchema } = require('../validators');

const router = express.Router();
router.post('/', protect, requireLibrarian, validate(memberSchema), createMember);
router.get('/:id/history', protect, requireLibrarian, getMemberHistory);

module.exports = router;
