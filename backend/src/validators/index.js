const { z } = require('zod');

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

const bookSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    author: z.string().min(1),
    ISBN: z.string().min(1),
    genre: z.string().min(1),
    totalCopies: z.number().int().min(0),
    availableCopies: z.number().int().min(0)
  })
});

const memberSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    membershipId: z.string().min(1)
  })
});

const borrowSchema = z.object({
  body: z.object({
    bookId: z.string().min(1),
    memberId: z.string().min(1)
  })
});

module.exports = { loginSchema, bookSchema, memberSchema, borrowSchema };
