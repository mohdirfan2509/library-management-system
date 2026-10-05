const Book = require('../models/Book');
const Member = require('../models/Member');
const BorrowRecord = require('../models/BorrowRecord');
const asyncHandler = require('../utils/asyncHandler');

const DEFAULT_BORROW_DAYS = 14;

const issueBook = asyncHandler(async (req, res) => {
  const { bookId, memberId } = req.body;

  const member = await Member.findById(memberId);
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  // Atomic conditional update for concurrency safety
  const book = await Book.findOneAndUpdate(
    { _id: bookId, availableCopies: { $gt: 0 } },
    { $inc: { availableCopies: -1 } },
    { new: true }
  );

  if (!book) {
    res.status(409);
    throw new Error('Book is not available or does not exist');
  }

  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + DEFAULT_BORROW_DAYS);

  const borrowRecord = await BorrowRecord.create({
    book: bookId,
    member: memberId,
    issueDate,
    dueDate,
    status: 'issued'
  });

  res.status(201).json({
    success: true,
    data: {
      id: borrowRecord._id,
      book: { id: book._id, title: book.title },
      member: { id: member._id, name: member.name },
      issueDate,
      dueDate,
      status: borrowRecord.status
    }
  });
});

const returnBook = asyncHandler(async (req, res) => {
  const { borrowId } = req.params;

  const record = await BorrowRecord.findOneAndUpdate(
    { _id: borrowId, status: { $ne: 'returned' } },
    { status: 'returned', returnDate: new Date() },
    { new: true }
  );

  if (!record) {
    res.status(404);
    throw new Error('Borrow record not found or already returned');
  }

  const book = await Book.findByIdAndUpdate(
    record.book,
    { $inc: { availableCopies: 1 } },
    { new: true }
  );

  res.json({
    success: true,
    data: {
      id: record._id,
      returnDate: record.returnDate,
      status: record.status,
      bookAvailableCopies: book.availableCopies
    }
  });
});

module.exports = { issueBook, returnBook };
