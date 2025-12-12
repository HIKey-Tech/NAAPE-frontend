
import sgMail from "@sendgrid/mail";

const sendgridApiKey = process.env.SENDGRID_API_KEY;

if (!sendgridApiKey) {
    throw new Error("SENDGRID_API_KEY environment variable is not defined.");
}

sgMail.setApiKey(sendgridApiKey);
const email = "info@naape.org.ng"

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        await sgMail.send({
            to,
            from: email, 
            subject,
            text,
            html,
        });
        console.log("Email sent successfully to", to);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

