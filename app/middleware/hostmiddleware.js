const jwt = require('jsonwebtoken');

const hostMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  // 1. No token
  if (!token) {
    return res.redirect('/host/');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. No valid user info in token
    if (!decoded || !decoded.id) {
      return res.redirect('/host/');
    }

    req.user = decoded;
    res.locals.user = decoded;

if(req.user.id){
  next();
}else{
  return res.redirect('/host/');
}
   

  } catch (error) {
    // 3. Token invalid or expired
    return res.redirect('/host/');
  }
};

module.exports = hostMiddleware;