const nodemailer = require("nodemailer");
const MailGen = require("mailgen");

const sendEmail = async (subject, send_to, template, reply_to, cc) => {
  // Create Email Transporter
  const transporter = nodemailer.createTransport({
    // service: "gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Create Template with Mailgen
  const mailGenerator = new MailGen({
    theme: "default",
    product: {
      name: "Tradexs10 Platform",
      link: "https://tradexs10.com/",
      // Optional product logo
      logo: "https://tradexs10.com/tradexs10.png",
      // Custom logo height
      logoHeight: "70px",
    },
  });

  const emailTemplate = mailGenerator.generate(template);
  require("fs").writeFileSync("preview.html", emailTemplate, "utf8");

  //Options for sending email
  const options = {
    from: `Tradexs10 <${process.env.EMAIL_USER}>`,
    to: send_to,
    replyTo: reply_to,
    subject,
    html: emailTemplate,
    cc,
  };

  //send Email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
