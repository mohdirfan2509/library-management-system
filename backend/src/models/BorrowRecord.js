const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  status: { type: String, enum: ['issued', 'returned', 'overdue'], default: 'issued' }
}, { timestamps: true });

borrowRecordSchema.index({ member: 1, issueDate: -1 });
borrowRecordSchema.index({ member: 1, status: 1 });
borrowRecordSchema.index({ book: 1, status: 1 });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
