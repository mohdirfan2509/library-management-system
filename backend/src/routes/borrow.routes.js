const express = require('express');
const { issueBook, returnBook } = require('../controllers/borrow.controller');
const { protect, requireLibrarian } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { borrowSchema } = require('../validators');

const router = express.Router();
router.post('/', protect, requireLibrarian, validate(borrowSchema), issueBook);
module.exports = router;
