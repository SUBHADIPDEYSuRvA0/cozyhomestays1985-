const jwt = require('jsonwebtoken');

const Seomiddleware = (req, res, next) => {
  const token = req.cookies.token;

  // 1. No token
  if (!token) {
    return res.redirect('/seo/');
  }

  try {
    const decoded = jwt.verify(token, process.env.SEO_SECRET);

    // 2. No valid user info in token
    if (!decoded || !decoded.id) {
      return res.redirect('/seo/');
    }

    req.user = decoded;
    res.locals.user = decoded;

if(req.user.id){
  next();
}else{
  return res.redirect('/seo/');
}
   

  } catch (error) {
    // 3. Token invalid or expired
    return res.redirect('/seo/');
  }
};

module.exports = Seomiddleware;