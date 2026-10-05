const Member = require('../models/Member');
const BorrowRecord = require('../models/BorrowRecord');
const asyncHandler = require('../utils/asyncHandler');

const createMember = asyncHandler(async (req, res) => {
  const { name, email, membershipId } = req.body;

  const memberExists = await Member.findOne({ $or: [{ email }, { membershipId }] });
  if (memberExists) {
    res.status(400);
    throw new Error('Member with this email or membership ID already exists');
  }

  const member = await Member.create({ name, email, membershipId });

  res.status(201).json({
    success: true,
    data: {
      id: member._id, name: member.name, email: member.email, membershipId: member.membershipId, joinedDate: member.joinedDate
    }
  });
});

const getMemberHistory = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  let history = await BorrowRecord.find({ member: member._id })
    .populate('book')
    .sort({ issueDate: -1 });

  // Compute overdue status dynamically
  const now = new Date();
  const formattedHistory = history.map(record => {
    let status = record.status;
    if (status === 'issued' && new Date(record.dueDate) < now) {
      status = 'overdue';
    }
    return {
      id: record._id,
      book: record.book ? {
        id: record.book._id, title: record.book.title, author: record.book.author,
        ISBN: record.book.ISBN, genre: record.book.genre,
        totalCopies: record.book.totalCopies, availableCopies: record.book.availableCopies
      } : null,
      member: {
        id: member._id, name: member.name, email: member.email, membershipId: member.membershipId, joinedDate: member.joinedDate
      },
      issueDate: record.issueDate,
      dueDate: record.dueDate,
      returnDate: record.returnDate,
      status
    };
  });

  res.json({
    success: true,
    data: {
      member: {
        id: member._id, name: member.name, email: member.email, membershipId: member.membershipId
      },
      history: formattedHistory
    }
  });
});

module.exports = { createMember, getMemberHistory };
