const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.VERIFICATION_BREVO_API_KEY;


class authseoController {
    Log=async(req,res)=>{
        const message = req.session.message;
        delete req.session.message;
        res.render('Seo/login',{message});
    }
    login = async (req, res) => {
      try {
        const { email, password } = req.body;
  
        if (!email || !password) {
          req.session.message = 'Email and password are required';
          return res.redirect('/seo/');
        }
  
        const user = await User.findOne({ email });
        if (!user) {
          req.session.message = 'User not found';
          return res.redirect('/seo/');
        }
  
        if (!user.role || user.role !== 'Seo') {
          req.session.message = 'Invalid user role';
          return res.redirect('/seo/');
        }
  
        if (!user.isVerified || user.status !== 'Active') {
          req.session.message = 'Account not verified or inactive';
          return res.redirect('/seo/');
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          req.session.message = 'Invalid password';
          return res.redirect('/seo/');
        }
  
        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role || 'Seo' },
          process.env.SEO_SECRET,
          { expiresIn: '7d' }
        );
  
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
  
        req.session.message = 'Login successful';
  
        if (user.properties.length > 0 && user.role === 'Seo') {
          return res.redirect('/seos/get');
        }else{
            return res.redirect('/seos/get');
            
        }
       
      } catch (error) {
        console.error('Login Error:', error);
        req.session.message = 'Server error';
        return res.redirect('/seo/');
      }
    };
    logout=async(req,res)=>{
        res.clearCookie('token');
        res.redirect('/seo/');
    }
}

module.exports = new authseoController();