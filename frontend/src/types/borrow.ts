import { Book } from './book';
import { Member } from './member';

export interface BorrowRecord {
  id: string;
  book: Book;
  member: Member;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'issued' | 'returned' | 'overdue';
}
