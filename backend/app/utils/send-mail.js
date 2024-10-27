/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import { createTransport } from 'nodemailer';

class EmailSender {
    static transporter;

    constructor() {
        if (!EmailSender.transporter) {
            EmailSender.transporter = createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        }
    }

    static async send(to, subject, text) {
        const mailOptions = {
            to: to,
            subject: subject,
            text: text,
        };

        try {
            await EmailSender.transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error(`Error sending email to ${to}: ${error.message}`);
        }
    }

    static async close() {
        if (EmailSender.transporter) {
            await EmailSender.transporter.close();
        }
    }
}

new EmailSender();

export default EmailSender;
