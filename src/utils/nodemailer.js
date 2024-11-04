import nodemailer from 'nodemailer';

export const sendMail = async (email, subject, message) => {
    try {

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL,
            to: email,
            subject: subject,
            html: message,
        });

        console.log('Email sent successfully to ', email);
    } catch (error) {
        console.error("Error while sending mail", error.message);
    }
}