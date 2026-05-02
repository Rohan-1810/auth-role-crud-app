const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
      }
      
      // Pull latest user data from DB to verify current role and prevent stale permissions
      const latestUser = await User.findById(req.user._id);
      
      if (!latestUser || latestUser.role !== role) {
        res.status(403);
        throw new Error(`User role '${latestUser?.role || 'unknown'}' is not authorized to access this route`);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { verifyToken, checkRole };
