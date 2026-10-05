const express = require('express');
const { getBooks, createBook } = require('../controllers/books.controller');
const { protect, requireLibrarian } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { bookSchema } = require('../validators');

const router = express.Router();
router.route('/')
  .get(getBooks)
  .post(protect, requireLibrarian, validate(bookSchema), createBook);

module.exports = router;
