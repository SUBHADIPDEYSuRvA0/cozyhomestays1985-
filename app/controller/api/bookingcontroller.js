const Bookin = require("../../models/bookin");
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

// Initialize Brevo API Client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];
apiKey.apiKey = process.env.VERIFICATION_BREVO_API_KEY;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SENDER_EMAIL = process.env.VERIFICATION_EMAIL_USER;
const SENDER_NAME = "CozyHomestay";

// Dummy function to get property details (replace with real DB lookup)
async function getPropertyDetails(propertyid) {
  // Mock data - replace with your DB query
  return {
    name: "Cozy Beachside Villa",
    price: 150 // per night, for example
  };
}

// Send email function
async function sendEmail(to, subject, htmlContent) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
  sendSmtpEmail.to = [{ email: to }];

  return apiInstance.sendTransacEmail(sendSmtpEmail);
}

// Create Booking Controller
exports.createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      checkindate,
      checkoutdate,
      adults,
      children,
      bedroom,
      pets,
      propertyid
    } = req.body;

    // Validate numbers
    if (isNaN(adults) || isNaN(children) || isNaN(bedroom)) {
      return res.status(400).json({ message: "Adults, children, and bedroom must be numbers." });
    }

    // Fetch property details (name, price)
    const property = await getPropertyDetails(propertyid);

    // Create new booking
    const newBooking = new Bookin({
      name,
      email,
      phone,
      checkindate,
      checkoutdate,
      adults: Number(adults),
      children: Number(children),
      bedroom: Number(bedroom),
      pets,
      propertyid,
      status: 'pending'
    });

    const savedBooking = await newBooking.save();

    // Prepare user email HTML
const userEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Booking Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #0a0a1a; color: #ffffff; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: linear-gradient(135deg, #001242, #0a2472); border-radius: 16px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    h1 { text-align: center; color: #4dabff; text-transform: uppercase; letter-spacing: 3px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    td { padding: 8px 0; color: #b8c7ff; }
    td.value { color: #ffffff; font-weight: bold; }
    .footer { text-align: center; font-size: 12px; color: #b8c7ff; margin-top: 40px; }
    a.button { display: inline-block; background: linear-gradient(135deg, #0a2472, #0e6cff); color: #fff; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-weight: bold; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Thank you for your booking, ${name}!</h1>
    <p>Your booking status is: <strong style="color:#4dabff;">${savedBooking.status}</strong>.</p>
    <table>
      <tr><td>Property:</td><td class="value">${property.name}</td></tr>
      <tr><td>Price per night:</td><td class="value">${property.price}</td></tr>
      <tr><td>Check-in Date:</td><td class="value">${checkindate}</td></tr>
      <tr><td>Check-out Date:</td><td class="value">${checkoutdate}</td></tr>
      <tr><td>Adults:</td><td class="value">${adults}</td></tr>
      <tr><td>Children:</td><td class="value">${children}</td></tr>
      <tr><td>Bedrooms:</td><td class="value">${bedroom}</td></tr>
    </table>
    <p>We will contact you shortly to confirm your booking.</p>
    <p>Best regards,</p>
    <p>CozyHomestay Team</p>
    <p style="text-align:center; margin-top:30px;">
      <a href="#" class="button">View Booking Details</a>
    </p>
    <p class="footer">&copy; ${new Date().getFullYear()} CozyHomestay. All rights reserved.</p>
  </div>
</body>
</html>
`;

    // Prepare admin email HTML
    const adminEmailHtml = `
     <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Notification</title>
</head>
<body>
  <!-- Admin Email Template -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0a0a1a;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg,rgba(0, 18, 66, 0),rgba(10, 36, 114, 0)); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <!-- Header with animated border -->
          <tr>
            <td align="center" style="padding: 0;">
              <div style="background: url('https://media.giphy.com/media/l378w6DoOVsZ9tYLm/giphy.gif') center center; background-size: cover; height: 8px; width: 100%;"></div>
            </td>
          </tr>
          
          <!-- Logo Area -->
          <tr>
            <td align="center" style="padding: 30px 0 20px 0;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 3px; text-shadow: 0 0 10px rgba(0, 100, 255, 0.7);">CozyHomestay Admin</h1>
            </td>
          </tr>
          
          <!-- Alert Banner -->
          <tr>
            <td align="center" style="padding: 0 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color: rgba(14, 108, 255, 0.2); border-left: 4px solid #0e6cff; padding: 15px; border-radius: 5px;">
                    <h2 style="color: #4dabff; font-size: 20px; margin: 0;">New Booking Received</h2>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(1, 22, 64, 0.7); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 0 15px rgba(0, 100, 255, 0.3); backdrop-filter: blur(10px);">
                <tr>
                  <td style="padding: 30px;">
                    <!-- Customer Details Section -->
                    <h3 style="color: #4dabff; font-size: 18px; margin: 0 0 15px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px;">Customer Details</h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0; border-collapse: separate; border-spacing: 0 8px;">
                      <tr>
                        <td width="40%" style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Customer Name:</td>
                        <td width="60%" style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px 0;">${name}</td>
                      </tr>
                      <tr>
                        <td style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Email:</td>
                        <td style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px 0;">${email}</td>
                      </tr>
                      <tr>
                        <td style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Phone:</td>
                        <td style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px 0;">${phone}</td>
                      </tr>
                    </table>
                    
                    <!-- Booking Details Section -->
                    <h3 style="color: #4dabff; font-size: 18px; margin: 20px 0 15px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px;">Booking Details</h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0; border-collapse: separate; border-spacing: 0 8px;">
                      <tr>
                        <td width="40%" style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Property:</td>
                        <td width="60%" style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px 0;">${property.name} (ID: ${propertyid})</td>
                      </tr>
                      <tr>
                        <td style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Check-in Date:</td>
                        <td style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px 0;">${checkindate}</td>
                      </tr>
                      <tr>
                        <td style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Check-out Date:</td>
                        <td style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px 0;">${checkoutdate}</td>
                      </tr>
                      <tr>
                        <td style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Adults:</td>
                        <td style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px 0;">${adults}</td>
                      </tr>
                      <tr>
                        <td style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Children:</td>
                        <td style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px 0;">${children}</td>
                      </tr>
                      <tr>
                        <td style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Bedrooms:</td>
                        <td style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px 0;">${bedroom}</td>
                      </tr>
                      <tr>
                        <td style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Pets:</td>
                        <td style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px 0;">${pets}</td>
                      </tr>
                      <tr>
                        <td style="color: #b8c7ff; font-size: 14px; padding: 5px 0;">Status:</td>
                        <td style="color: #4dabff; font-size: 16px; font-weight: bold; padding: 5px 0; background: rgba(14, 108, 255, 0.1); border-radius: 4px; display: inline-block; padding: 5px 10px;">${savedBooking.status}</td>
                      </tr>
                    </table>
                    
                    <p style="color: #ffffff; font-size: 16px; margin: 25px 0 0 0;">Please review and approve or reject the booking.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Action Buttons -->
          <tr>
            <td align="center" style="padding: 20px 30px 30px 30px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #0a8a00, #00c853); color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(0, 200, 83, 0.4);">Approve</a>
                  </td>
                  <td style="padding: 0 10px;">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #8a0000, #c80000); color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(200, 0, 0, 0.4);">Reject</a>
                  </td>
                  <td style="padding: 0 10px;">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #0a2472, #0e6cff); color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(14, 108, 255, 0.4);">View Details</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: rgba(0, 10, 30, 0.8); padding: 20px; text-align: center;">
              <p style="color: #b8c7ff; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} CozyHomestay Admin Portal. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send emails concurrently
    await Promise.all([
      sendEmail(email, "Your CozyHomestay Booking Confirmation", userEmailHtml),
      sendEmail(ADMIN_EMAIL, "New Booking Notification", adminEmailHtml),
    ]);

    res.status(201).json({ message: "Booking created and emails sent successfully.", booking: savedBooking });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking." });
  }
};
