const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = { login };
