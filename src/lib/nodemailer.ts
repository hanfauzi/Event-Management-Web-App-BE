import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:"nifauzi45@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD!,
  },
  tls: {
    rejectUnauthorized: false
  }
});
