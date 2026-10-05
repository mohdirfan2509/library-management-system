const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error.middleware');
const { logger } = require('./middleware/logger.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/books.routes'));
app.use('/api/members', require('./routes/members.routes'));
app.use('/api/borrow', require('./routes/borrow.routes'));
app.use('/api/return', require('./routes/return.routes'));

app.use(errorHandler);

module.exports = app;
