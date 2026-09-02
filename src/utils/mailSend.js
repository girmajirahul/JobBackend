const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: "girmajirahul2@gmail.com",
    pass: "hrqzzelpogqrersq",
  },
});

function sendMail(to,sub,msg){
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg    
    })

    console.log("message sent successfully");
    
}

const testEmail = "shamagirmaji@gmail.com"; // Replace with your email
const testSubject = "Testing Nodemailer";
const testMessage = `
  <h2>Hello!</h2>
  <p>This is a <b>test email</b> sent using Nodemailer.</p>
  <p>If you're reading this, your setup is working correctly. 🎉</p>
`;

sendMail(testEmail, testSubject, testMessage);

// sendMail('shamagirmaji@gmail.com',"This is subject","This is message");