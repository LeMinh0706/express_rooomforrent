const nodemailer = require("nodemailer");
require('dotenv').config();
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    },
});
module.exports = {
    sendmail: async function (to, subject, otp) {
        return await transporter.sendMail({
            from: 'admin@gmail.com',
            to: to,
            subject: subject,
            html: `
                <html>
                <head>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    padding: 20px;
                    }
                    h2 {
                    color: #4CAF50;
                    }
                    .otp-code {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    background-color: #e7f7e7;
                    padding: 10px;
                    border-radius: 5px;
                    }
                </style>
                </head>
                <body>
                <h2>Your OTP Code</h2>
                <p>Dear User,</p>
                <p>Thank you for using our service. Your OTP code is:</p>
                <p class="otp-code">${otp}</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,<br>Trọ24h</p>
                </body>
                </html>`
            
        });
    },
}