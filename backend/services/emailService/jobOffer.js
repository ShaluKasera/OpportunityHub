const { transporter } = require("../../config/nodemailer/mailer");

const sendJobOfferEmail = async (
  toEmail,
  jobSeekerName,
  jobTitle,
  acceptLink,
  employerCompany,
  employerName,
  employerEmail,
) => {
  try {
    const mailOptions = {
      from: `"${employerCompany}" <${employerEmail}>`, 
      to: toEmail,
      subject: "You have been Shortlisted for a Job Opportunity",
      html: `
        Hello ${jobSeekerName},<br><br>
        You've been selected for the position <strong>${jobTitle}</strong>.<br>
        If you're interested, please click below to accept the offer:<br><br>
        <a href="${acceptLink}">Accept Job Offer</a><br><br>
        Regards,<br>${employerName}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Job offer email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending job offer email:", error);
    return false;
  }
};

module.exports = { sendJobOfferEmail };
