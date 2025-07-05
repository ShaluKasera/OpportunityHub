const { transporter } = require("../../config/nodemailer/mailer");

const sendOtpEmail = async (toEmail, otp, name) => {
  try {
    const mailOptions = {
      from: `"OppurtunityHub" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: "Your OTP for Email Verification",
      html: `
        <p>Hello, ${name}</p>
        <p>Your OTP for email verification is: <b>${otp}</b></p>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email verification mail:", error);
    return false;
  }
};


const sendResetPasswordLink = async (email, link, name) => {
  try {
    const mailOptions = {
      from: `"OppurtunityHub" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "Reset Your Password - OpportunityHub",
    html: `
      <p>Hello ${name},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${link}" target="_blank">${link}</a>
      <p>This link will expire in 1 hour.</p>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email verification mail:", error);
    return false;
  }
};

const sendJobOfferEmail = async (
  jobSeeker_email,
  jobSeeker_name,
  job_title,
  acceptLink,
  employer_companyName,
  employer_name,
  employer_email,
  domain
) => {
  try {
    const mailOptions = {
      from: `${employer_companyName} <${employer_email}>`,
      to: jobSeeker_email,
      subject: `You are selected for the ${job_title} role at ${employer_companyName}`,
      html: `
        <p>Hello <b>${jobSeeker_name}</b>,</p>
        <p>We are pleased to inform you that you have been selected for the position of <b>${job_title}</b> in the <b>${domain}</b> domain at <b>${employer_companyName}</b>.</p>
        <p>Please click the link below to accept the job offer:</p>
        <p><a href="${acceptLink}">Accept Offer</a></p>
        <br/>
        <p>Best regards,</p>
        <p><b>${employer_name}</b></p>
        <p>${employer_companyName}</p>
        <p>Email: ${employer_email}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Job offer sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending job offer email:", error);
    return false;
  }
};


module.exports = { sendOtpEmail, sendResetPasswordLink, sendJobOfferEmail };
