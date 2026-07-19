import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
  // Create transporter INSIDE the function
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Verify connection
  await transporter.verify();

  // Send mail
  await transporter.sendMail({
    from: `CampusConnect <${process.env.EMAIL}>`,
    to: email,
    subject: 'Verify your CampusConnect account',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>CampusConnect Email Verification</h2>
        <p>Your OTP code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `,
  });

  console.log('Email sent successfully');
};