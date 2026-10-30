
import "dotenv/config";
import transporter from "./mailer.js";
import nodemailer from "nodemailer";

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: '"Auth System" <test@example.com>',
      to: "recipient@example.com",
      subject: "Password Reset Test",
      text: "Your password reset email is working!",
    });

    console.log("Email sent successfully!");
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Email Error:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
  }
}

testEmail();
