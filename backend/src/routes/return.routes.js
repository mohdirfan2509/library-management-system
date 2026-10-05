const express = require('express');
const { returnBook } = require('../controllers/borrow.controller');
const { protect, requireLibrarian } = require('../middleware/auth.middleware');

const router = express.Router();
router.post('/:borrowId', protect, requireLibrarian, returnBook);
module.exports = router;
