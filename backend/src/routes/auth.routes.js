const express = require('express');
const { login } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { loginSchema } = require('../validators');

const router = express.Router();
router.post('/login', validate(loginSchema), login);
module.exports = router;
