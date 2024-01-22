const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

function generateToken(userId, userRole) {
    const token = jwt.sign(
        { userId: userId, role: userRole },
        secretKey,
        { expiresIn: '1h' }
    );
    return token;
}

async function verifyToken(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
  
      req.user = decoded;
      next();
    });
  }

module.exports = { generateToken, verifyToken };