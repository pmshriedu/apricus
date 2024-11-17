// lib/booking-confirmation-template.ts
interface Booking {
  id: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  adults: number;
  childrens: number;
  fullName: string;
  phoneNo: string;
  email: string;
  location: {
    name: string;
  };
  hotel: {
    name: string;
  };
}

export const generateCustomerConfirmationEmail = (booking: Booking) => {
  const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const calculateNights = (checkIn: Date, checkOut: Date): number => {
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const numberOfNights = calculateNights(
    new Date(booking.checkIn),
    new Date(booking.checkOut)
  );

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation - Apricus Hotels</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.8;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 0;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #C68D07;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
              font-weight: 600;
              letter-spacing: 1px;
            }
            .content {
              padding: 40px 30px;
              background-color: #ffffff;
            }
            .thank-you {
              text-align: center;
              margin-bottom: 30px;
            }
            .thank-you h2 {
              color: #C68D07;
              font-size: 22px;
              margin-bottom: 10px;
            }
            .booking-details {
              background-color: #f8f9fa;
              border-left: 4px solid #C68D07;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .booking-details h3 {
              color: #C68D07;
              margin: 0 0 15px 0;
              font-size: 18px;
            }
            .booking-id {
              background-color: #fff3cd;
              color: #856404;
              padding: 10px;
              text-align: center;
              border-radius: 4px;
              margin: 20px 0;
              font-weight: bold;
            }
            .next-steps {
              background-color: #fff8e6;
              border: 1px solid #C68D07;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #eee;
            }
            @media only screen and (max-width: 600px) {
              .container {
                margin: 10px;
                width: auto !important;
              }
              .content {
                padding: 20px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Choosing Apricus Hotels</h1>
            </div>
            <div class="content">
              <div class="thank-you">
                <h2>Booking Request Received</h2>
                <p>Dear ${booking.fullName},</p>
                <p>We have received your booking request and our team will process it shortly.</p>
              </div>
  
              <div class="booking-id">
                Booking Reference: ${booking.id}
              </div>
  
              <div class="booking-details">
                <h3>Your Stay Details</h3>
                <p><strong>Hotel:</strong> ${booking.hotel.name}</p>
                <p><strong>Location:</strong> ${booking.location.name}</p>
                <p><strong>Check-in:</strong> ${checkInDate}</p>
                <p><strong>Check-out:</strong> ${checkOutDate}</p>
                <p><strong>Duration:</strong> ${numberOfNights} night${
    numberOfNights > 1 ? "s" : ""
  }</p>
                <p><strong>Guests:</strong> ${booking.adults} Adult${
    booking.adults > 1 ? "s" : ""
  } ${booking.childrens > 0 ? `& ${booking.childrens} Children` : ""}</p>
              </div>
  
              <div class="next-steps">
                <h3 style="color: #C68D07; margin-top: 0;">What Happens Next?</h3>
                <p>1. Our team will review your booking request</p>
                <p>2. We will confirm room availability and rates</p>
                <p>3. You will receive a confirmation email within 24 hours</p>
                <p>4. Our representative may contact you if additional information is needed</p>
              </div>
  
              <div style="margin-top: 30px;">
                <p><strong>Need assistance?</strong></p>
                <p>Contact our reservations team:</p>
                <p>✆ Phone: +91 8956593946</p>
                <p>✉ Email: crs@apricushotels.com</p>
              </div>
            </div>
            
            <div class="footer">
              <p>We look forward to welcoming you!</p>
              <p>© ${new Date().getFullYear()} Apricus Hotels. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};
