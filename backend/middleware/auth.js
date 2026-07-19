import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {

    // Read token from HTTP-only cookie
    const token = req.cookies.token;

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No token'
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    // Attach user data to request
    req.user = decoded;

    // Continue to controller
    next();

  } catch (error) {

    // Token expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};