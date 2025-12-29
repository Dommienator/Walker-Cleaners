const AfricasTalking = require("africastalking");
const sgMail = require("@sendgrid/mail");

// Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
});

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { booking } = req.body;

    // Staff contacts
    const staffPhones = process.env.STAFF_PHONES.split(",");
    const staffEmails = process.env.STAFF_EMAILS.split(",");

    // Format message
    const message = `
🔔 NEW BOOKING - Walker Cleaners

Type: ${booking.type}
Service: ${booking.serviceOrPackage}
Client: ${booking.name}
Phone: ${booking.phone}
Date: ${booking.date} at ${booking.time}
Location: ${booking.address}

Booking ID: #${booking.id}
    `.trim();

    // Send SMS to all staff
    const smsPromises = staffPhones.map(async (phone) => {
      try {
        return await africastalking.SMS.send({
          to: [phone.trim()],
          message: message,
          from: "WALKER",
        });
      } catch (error) {
        console.error(`SMS error for ${phone}:`, error);
        return null;
      }
    });

    // Send Email to all staff
    const emailPromises = staffEmails.map(async (email) => {
      try {
        return await sgMail.send({
          to: email.trim(),
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: `New Booking #${booking.id} - ${booking.serviceOrPackage}`,
          text: message,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px;">
                <h2 style="color: #0066cc;">🔔 New Booking Received</h2>
                <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>Booking ID:</strong> #${booking.id}</p>
                  <p><strong>Type:</strong> ${booking.type}</p>
                  <p><strong>Service/Package:</strong> ${
                    booking.serviceOrPackage
                  }</p>
                </div>
                <h3 style="color: #003d7a;">Client Details:</h3>
                <p><strong>Name:</strong> ${booking.name}</p>
                <p><strong>Phone:</strong> ${booking.phone}</p>
                <p><strong>Email:</strong> ${booking.email || "N/A"}</p>
                
                <h3 style="color: #003d7a;">Schedule:</h3>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
                
                <h3 style="color: #003d7a;">Location:</h3>
                <p>${booking.address}</p>
                
                ${
                  booking.message
                    ? `<h3 style="color: #003d7a;">Additional Info:</h3><p>${booking.message}</p>`
                    : ""
                }
                
                <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px;">
                  <p style="margin: 0;"><strong>⚡ Action Required:</strong> Please contact the client to confirm this booking.</p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (error) {
        console.error(`Email error for ${email}:`, error);
        return null;
      }
    });

    // Send confirmation email to customer
    if (booking.email) {
      try {
        await sgMail.send({
          to: booking.email,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: `Booking Confirmation #${booking.id} - Walker Cleaners`,
          text: `Thank you for booking with Walker Cleaners!\n\n${message}\n\nWe will contact you shortly to confirm your booking.`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px;">
                <h2 style="color: #0066cc;">✅ Booking Confirmed!</h2>
                <p>Thank you for choosing Walker Cleaners!</p>
                
                <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>Your Booking ID:</strong> #${booking.id}</p>
                  <p style="font-size: 12px; color: #666;">Keep this ID to track your booking</p>
                </div>
                
                <h3 style="color: #003d7a;">Booking Details:</h3>
                <p><strong>Service:</strong> ${booking.serviceOrPackage}</p>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
                <p><strong>Location:</strong> ${booking.address}</p>
                
                <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 5px;">
                  <p style="margin: 0;"><strong>📞 What's Next?</strong></p>
                  <p>Our team will contact you within 2 hours to confirm your booking.</p>
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                  <p style="color: #666; font-size: 14px;">Track your booking at:</p>
                  <a href="${
                    process.env.VERCEL_URL ||
                    "https://walker-cleaners.vercel.app"
                  }/track" 
                     style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Track Booking
                  </a>
                </div>
                
                <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                  <p>Walker Cleaners - Your Mess Is Our Mission</p>
                  <p>📞 0768 323 230 | 📧 walkercleanersltd@gmail.com</p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (error) {
        console.error("Customer email error:", error);
      }
    }

    // Wait for all notifications to complete
    const smsResults = await Promise.allSettled(smsPromises);
    const emailResults = await Promise.allSettled(emailPromises);

    const smsSent = smsResults.filter((r) => r.status === "fulfilled").length;
    const emailsSent = emailResults.filter(
      (r) => r.status === "fulfilled"
    ).length;

    return res.status(200).json({
      success: true,
      notifications: {
        sms: smsSent,
        emails: emailsSent,
        total: smsSent + emailsSent,
      },
    });
  } catch (error) {
    console.error("Notification error:", error);
    return res
      .status(500)
      .json({ error: "Notification error", details: error.message });
  }
}
