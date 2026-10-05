require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Book = require('./src/models/Book');
const Member = require('./src/models/Member');
const connectDB = require('./src/config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    await Member.deleteMany();

    // 1. Create Librarian
    const librarian = await User.create({
      email: 'librarian@shelflife.com',
      password: 'Library@123',
      role: 'librarian'
    });

    console.log('✅ Librarian created:', librarian.email);

    // 2. Create Books
    await Book.insertMany([
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        ISBN: '9780132350884',
        genre: 'Programming',
        totalCopies: 5,
        availableCopies: 5
      },
      {
        title: 'Design Patterns',
        author: 'Erich Gamma',
        ISBN: '9780201633610',
        genre: 'Programming',
        totalCopies: 3,
        availableCopies: 3
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        ISBN: '9780201616224',
        genre: 'Programming',
        totalCopies: 4,
        availableCopies: 4
      }
    ]);
    console.log('✅ Books seeded');

    // 3. Create Members
    await Member.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        membershipId: 'MEM001'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        membershipId: 'MEM002'
      }
    ]);
    console.log('✅ Members seeded');

    console.log('🎉 Database seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
