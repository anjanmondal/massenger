const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Massenger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


   async function sendRegistrationMail(userEmail, name) {
    const subject = "Welcome to Messenger – Let's get started!";
    
    // Plain text version for email clients that don't support HTML
    const text = `Hello ${name},\n\nWelcome to Messenger! We're thrilled to have you on board. Your account has been successfully created, and you can now start connecting with others.\n\nBest regards,\nThe Messenger Team`;

    // Professional HTML version
    const html = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
            <h2 style="color: #007bff;">Welcome to Messenger, ${name}!</h2>
            <p>Thank you for joining our community. We’re excited to help you stay connected with the people who matter most.</p>
            <p>To get started, simply log in to your account and explore your dashboard.</p>
            <div style="margin: 30px 0;">
                <a href="https://your-messenger-link.com/login" 
                   style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   Log In to Your Account
                </a>
            </div>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 0.8em; color: #777;">
                If you did not create this account, please ignore this email or contact support.
            </p>
        </div>
    `;

    await sendEmail(userEmail,subject,text,html)
}


module.exports = {sendRegistrationMail};