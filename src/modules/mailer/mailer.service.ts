import { transporter } from "../../lib/nodemailer";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

export class TransactionMailer {
  static async sendAcceptedMail({ to, name, transactionId }: { to: string, name: string, transactionId: string }) {
    const templatePath = path.join(__dirname, "../../assets/acceptedTransaction.html");
    const source = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(source);
    const html = template({ name, transactionId });

    await transporter.sendMail({
      from: '"Your Company" <no-reply@yourcompany.com>',
      to,
      subject: "Transaksi Anda Diterima",
      html,
    });
  }

  static async sendRejectedMail({ to, name, transactionId }: { to: string, name: string, transactionId: string }) {
    const templatePath = path.join(__dirname, "../../assets/rejectedTransaction.html");
    const source = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(source);
    const html = template({ name, transactionId });

    await transporter.sendMail({
      from: '"Your Company" <no-reply@yourcompany.com>',
      to,
      subject: "Transaksi Anda Ditolak",
      html,
    });
  }
}