const Book = require('../models/Book');
const asyncHandler = require('../utils/asyncHandler');

const getBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.genre) {
    query.genre = req.query.genre;
  }
  if (req.query.title) {
    query.title = { $regex: req.query.title, $options: 'i' };
  }

  const [books, total] = await Promise.all([
    Book.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Book.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: books.map(b => ({
      id: b._id, title: b.title, author: b.author, ISBN: b.ISBN,
      genre: b.genre, totalCopies: b.totalCopies, availableCopies: b.availableCopies
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

const createBook = asyncHandler(async (req, res) => {
  const { title, author, ISBN, genre, totalCopies, availableCopies } = req.body;
  
  if (availableCopies > totalCopies) {
    res.status(400);
    throw new Error('Available copies cannot exceed total copies');
  }

  const bookExists = await Book.findOne({ ISBN });
  if (bookExists) {
    res.status(400);
    throw new Error('Book with this ISBN already exists');
  }

  const book = await Book.create({
    title, author, ISBN, genre, totalCopies, availableCopies
  });

  res.status(201).json({
    success: true,
    data: {
      id: book._id, title: book.title, author: book.author, ISBN: book.ISBN,
      genre: book.genre, totalCopies: book.totalCopies, availableCopies: book.availableCopies
    }
  });
});

module.exports = { getBooks, createBook };
