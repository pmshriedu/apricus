export interface Booking {
  checkIn: string; // ISO date string for check-in date
  checkOut: string; // ISO date string for check-out date
  fullName: string; // Full name of the guest
  email: string; // Email address of the guest
  phoneNo: string; // Phone number of the guest
  id: string; // Booking reference ID
  hotel: {
    name: string; // Name of the hotel
  };
  location: {
    name: string; // Location of the hotel
  };
  adults: number; // Number of adults
  childrens: number; // Number of children
  createdAt: string; // ISO date string for when the booking was created
  updatedAt: string; // ISO date string for when the booking was last updated
}

export const generateEmailTemplate = (booking: Booking) => {
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Fixed date calculation
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
          <title>New Booking Enquiry</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.8;
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
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
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .content {
              padding: 40px 30px;
              background-color: #ffffff;
            }
            .section {
              margin: 25px 0;
              padding: 20px;
              background-color: #f8f9fa;
              border-left: 4px solid #C68D07;
              border-radius: 4px;
            }
            .section h2 {
              color: #C68D07;
              margin: 0 0 15px 0;
              font-size: 18px;
              text-transform: uppercase;
            }
            .section p {
              margin: 10px 0;
              color: #333333;
            }
            .section strong {
              color: #C68D07;
              min-width: 150px;
              display: inline-block;
            }
            .message-box {
              background-color: #fff8e6;
              border: 1px solid #C68D07;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .status-pending {
              display: inline-block;
              background-color: #fff3cd;
              color: #856404;
              padding: 5px 10px;
              border-radius: 4px;
              font-weight: bold;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #eee;
            }
            .footer p {
              color: #666666;
              font-size: 14px;
              margin: 5px 0;
            }
            .contact-info {
              margin-top: 25px;
              padding-top: 20px;
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
              .section {
                padding: 15px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Booking Enquiry</h1>
            </div>
            <div class="content">
              <div class="message-box">
                <strong>Important Notice:</strong> This is a new booking enquiry that requires review and confirmation. Current Status: <span class="status-pending">PENDING</span>
              </div>
  
              <div class="section">
                <h2>Guest Information</h2>
                <p><strong>Full Name:</strong> ${booking.fullName}</p>
                <p><strong>Email Address:</strong> ${booking.email}</p>
                <p><strong>Phone Number:</strong> ${booking.phoneNo}</p>
                <p><strong>Reference ID:</strong> ${booking.id}</p>
              </div>
  
              <div class="section">
                <h2>Property Details</h2>
                <p><strong>Hotel Name:</strong> ${booking.hotel.name}</p>
                <p><strong>Location:</strong> ${booking.location.name}</p>
              </div>
  
              <div class="section">
                <h2>Stay Details</h2>
                <p><strong>Check-in Date:</strong> ${checkInDate}</p>
                <p><strong>Check-out Date:</strong> ${checkOutDate}</p>
                <p><strong>Number of Nights:</strong> ${numberOfNights}</p>
                <p><strong>Number of Adults:</strong> ${booking.adults}</p>
                ${
                  booking.childrens > 0
                    ? `<p><strong>Number of Children:</strong> ${booking.childrens}</p>`
                    : ""
                }
                <p><strong>Total Guests:</strong> ${
                  booking.adults + booking.childrens
                }</p>
              </div>
  
              <div class="section">
                <h2>Booking Timeline</h2>
                <p><strong>Enquiry Received:</strong> ${formatDate(
                  booking.createdAt
                )}</p>
                <p><strong>Last Updated:</strong> ${formatDate(
                  booking.updatedAt
                )}</p>
              </div>
  
              <div class="section">
                <h2>Required Actions</h2>
                <p>• Review guest information and stay details</p>
                <p>• Check room availability for the requested dates</p>
                <p>• Verify pricing and applicable rates</p>
                <p>• Contact guest within 24 hours</p>
              </div>
  
              <div class="contact-info">
                <h2 style="color: #C68D07;">Contact Information</h2>
                <p>For any immediate assistance or questions regarding this booking enquiry:</p>
                <p>✆ Reservations: +91 8956593946</p>
                <p>✉ Email: crs@apricushotels.com</p>
                <p>⚡ Quick Response Code: ${booking.id}</p>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated message - please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Apricus Hotels. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};
