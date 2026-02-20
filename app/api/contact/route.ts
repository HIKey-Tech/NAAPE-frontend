import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Make sure SENDGRID_API_KEY is available in your .env/environment
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // The "to" address is where you want to receive the notifications
        const toEmail = process.env.CONTACT_EMAIL || "info@naape.org.ng";

        // The "from" address must be a verified sender identity in your SendGrid account.
        const fromEmail = process.env.SENDGRID_VERIFIED_SENDER || "noreply@naape.org.ng";

        const msg = {
            to: toEmail,
            from: fromEmail,
            replyTo: email,
            subject: `New NAAPE Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <h2 style="color: #1e3a8a;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <h3 style="color: #333;">Message:</h3>
                    <p style="white-space: pre-wrap; color: #555; line-height: 1.5;">${message}</p>
                </div>
            `,
        };

        if (!process.env.SENDGRID_API_KEY) {
            console.warn("SENDGRID_API_KEY is not set. Simulating email success.");
            // We simulate success if no API key is set to avoid breaking the form before deployment
            return NextResponse.json({ message: "Simulated success (missing API key)" }, { status: 200 });
        }

        await sgMail.send(msg);

        return NextResponse.json(
            { message: "Email sent successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error sending email:", error.response?.body || error.message);
        return NextResponse.json(
            { message: "Failed to send email", error: error.message },
            { status: 500 }
        );
    }
}
