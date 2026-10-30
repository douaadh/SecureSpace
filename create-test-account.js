
import nodemailer from "nodemailer";

async function createAccount() {
  const testAccount = await nodemailer.createTestAccount();

  console.log("Ethereal account created!");
  console.log("User:", testAccount.user);
  console.log("Pass:", testAccount.pass);
}

createAccount().catch(console.error);
