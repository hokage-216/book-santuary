const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhhhh';
const expiration = '2h';

function signToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username
    };
  
    return jwt.sign(payload, secret, { expiresIn: expiration });
}
  
module.exports = { signToken };