const User = require('../../models/user');
const Otp = require('../../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure SendinBlue (Brevo)
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.VERIFICATION_BREVO_API_KEY;

const sendOtpEmail = async (email, name, otp) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = 'Your CozyHomestay OTP Verification Code';
sendSmtpEmail.htmlContent = `
  <html>
    <body style="margin:0; padding:0; background-color:#050520; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:white;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(145deg, #0a1035, #1a2151); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              <tr>
                <td>
                  <!-- Animated header GIF -->
                  <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHI0NjE5Y3pydGpwOXl0Z3R1YzRjbnMzaDY4MHJtNjA0bGhjbG1oNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JdFEeta1hLNnO/giphy.gif" alt="Futuristic Animation" width="600" style="display:block; border-top-left-radius:16px; border-top-right-radius:16px;">
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 30px;">
                  <h1 style="color:#4dabff; font-size: 30px; font-weight: 700; margin: 0; letter-spacing: 2px; text-shadow: 0 0 10px rgba(77, 171, 255, 0.5);">CozyHomestay</h1>
                </td>
              </tr>
              <tr>
                <td style="background: linear-gradient(145deg, #0c1445, #162168); border-radius: 12px; padding: 35px; box-shadow: inset 0 0 20px rgba(77, 171, 255, 0.2); margin: 0 20px 20px;">
                  <p style="font-size: 20px; color: #ffffff; margin-bottom: 20px;">Hello <strong>${name}</strong>,</p>
                  <p style="font-size: 16px; color: #b8c7ff; margin-bottom: 25px;">Use the OTP below to complete your verification:</p>
                  <p style="
                    font-size: 36px; 
                    font-weight: bold; 
                    color: #ffffff; 
                    background: linear-gradient(135deg, #162168, #0c1445); 
                    border: 2px solid #4dabff; 
                    padding: 20px 40px; 
                    border-radius: 10px; 
                    display: inline-block; 
                    box-shadow: 0 0 15px rgba(77, 171, 255, 0.6); 
                    letter-spacing: 8px; 
                    text-shadow: 0 0 5px rgba(255,255,255,0.5);
                  ">
                    ${otp}
                  </p>
                  <p style="font-size: 14px; color: #b8c7ff; margin-top: 30px; text-align: center;">This OTP is valid for <strong>10 minutes</strong>. If you did not request this, you can safely ignore it.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 30px;">
                  <p style="font-size: 12px; color: #4dabff;">&copy; ${new Date().getFullYear()} CozyHomestay. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;



  sendSmtpEmail.sender = { name: 'CozyHomestay', email: process.env.VERIFICATION_EMAIL_USER };
  sendSmtpEmail.to = [{ email, name }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};
// const sendOtpEmail = async (email, name, otp) => {
//   try {
//     // Configure Brevo API client
//     const defaultClient = SibApiV3Sdk.ApiClient.instance;
//     const apiKey = defaultClient.authentications['api-key'];
//     apiKey.apiKey = process.env.VERIFICATION_BREVO_API_KEY; // Make sure this matches your .env

//     const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//     // Compose the email
//     const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//     sendSmtpEmail.subject = 'Your CozyHomestay OTP Code';

//     sendSmtpEmail.htmlContent = `
//       <html>
//         <body style="margin:0; padding:0; background-color:#e0e7ff; font-family:Arial, sans-serif;">
//           <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
//             <tr>
//               <td align="center">
//                 <table width="600" style="background-color:#001f4d; border-radius:12px; padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
//                   <tr>
//                     <td align="center" style="padding-bottom:20px;">
//                       <h1 style="color:#ffffff; font-size:28px; margin:0;">CozyHomestay</h1>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td style="background-color:#ffffff; border-radius:8px; padding:30px;">
//                       <p style="font-size:18px; color:#001f4d; margin-bottom:20px;">Hello <strong>${name}</strong>,</p>
//                       <p style="font-size:16px; color:#001f4d; margin-bottom:16px;">Here is your OTP code to continue:</p>
//                       <p style="font-size:32px; font-weight:bold; color:#001f4d; background-color:#e0e7ff; padding:15px 25px; display:inline-block; border-radius:6px; letter-spacing:2px;">${otp}</p>
//                       <p style="font-size:14px; color:#555; margin-top:30px;">This code will expire in 10 minutes. If you didn’t request this, you can safely ignore this email.</p>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td align="center" style="padding-top:30px;">
//                       <p style="font-size:12px; color:#b0c4ff;">&copy; ${new Date().getFullYear()} CozyHomestay. All rights reserved.</p>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </body>
//       </html>
//     `;

//     sendSmtpEmail.sender = {
//       name: 'CozyHomestay',
//       email: process.env.VERIFICATION_EMAIL_USER // Must be a verified sender in Brevo
//     };

//     sendSmtpEmail.to = [{ email, name }];

//     // Send the email
//     const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log('✅ OTP email sent successfully:', result);
//   } catch (error) {
//     console.error('❌ Error sending OTP email:', JSON.stringify(error.response?.body || error.message || error, null, 2));
//     throw new Error('Failed to send OTP email');
//   }
// };
class UserController {
  // Send OTP
  async sendOtp(req, res) {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // Save OTP to database with 5 minutes expiry
      const otpRecord = new Otp({
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });
      await otpRecord.save();

      // Send OTP email
      await sendOtpEmail(email, name, otp);

      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Send OTP Error:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  }

  // ✅ Verify OTP and SignUp
  signup = async (req, res) => {
    try {
      const { name, email, password, phone, otp } = req.body;

      if (!name || !email || !password || !otp || !phone) {
        req.session.message = 'All fields are required';
        return res.redirect('/host/');
      }

      // Find OTP record and check expiry
      const otpRecord = await Otp.findOne({ email, otp });
      if (!otpRecord || otpRecord.expiresAt < new Date()) {
        req.session.message = 'Invalid or expired OTP';
        return res.redirect('/host/');
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        req.session.message = 'Email already registered. Please login.';
        return res.redirect('/host/');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'Host',
        status: 'Active',
        isVerified: true,
      });

      await newUser.save();
      await Otp.deleteMany({ email }); // clear OTPs after signup

      req.session.message = 'Signup successful. Please login.';
      return res.redirect('/host/');
    } catch (error) {
      console.error('Signup Error:', error);
      req.session.message = 'Server error';
      return res.redirect('/host/');
    }
  };

  // ✅ Login
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        req.session.message = 'Email and password are required';
        return res.redirect('/host/');
      }

      const user = await User.findOne({ email });
      if (!user) {
        req.session.message = 'User not found';
        return res.redirect('/host/');
      }

      if (!user.role || user.role !== 'Host') {
        req.session.message = 'Invalid user role';
        return res.redirect('/host/');
      }

      if (!user.isVerified || user.status !== 'Active') {
        req.session.message = 'Account not verified or inactive';
        return res.redirect('/host/');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.session.message = 'Invalid password';
        return res.redirect('/host/');
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role || 'Host' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      req.session.message = 'Login successful';

      if (user.documentverification === true && user.role === 'Host') {
        return res.redirect('/host/home');
      }else{
          return res.redirect('/host/list1');
          
      }
     
    } catch (error) {
      console.error('Login Error:', error);
      req.session.message = 'Server error';
      return res.redirect('/host/');
    }
  };

  // ✅ Logout
  logout = (req, res) => {
    res.clearCookie('token');
    req.session.message = 'Logout successful. Please login again.';
    return res.redirect('/host/');
  };
}

module.exports = new UserController();
