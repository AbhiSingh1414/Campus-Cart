const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  const result = await transporter.sendMail(mailOptions);
  console.log("Email accepted by SMTP server:", {
    messageId: result.messageId,
    accepted: result.accepted,
    rejected: result.rejected,
  });
  return result;
};

module.exports = sendEmail ;
