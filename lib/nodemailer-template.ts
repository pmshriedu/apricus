export interface BookingEmailData {
  id: string;
  fullName: string;
  email: string;
  phoneNo: string;
  hotel: {
    name: string;
  };
  location: {
    name: string;
  };
  checkIn: string;
  checkOut: string;
  adults: number;
  childrens: number;
  createdAt: string;
  updatedAt: string;
  roomName: string;
  price: number;
  transaction: {
    amount: number;
    discountAmount: number;
    totalAmount: number;
    status: string;
    sgst: number;
    cgst: number;
  } | null;
}

export const generateEmailTemplate = (booking: BookingEmailData) => {
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

  // Calculate nights
  const calculateNights = (checkIn: Date, checkOut: Date): number => {
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const numberOfNights = calculateNights(
    new Date(booking.checkIn),
    new Date(booking.checkOut)
  );

  // Calculate payment details
  const baseAmount = booking.price * numberOfNights;
  const discountAmount = booking.transaction?.discountAmount || 0;
  const subtotal = baseAmount - discountAmount;
  const gstRate = baseAmount > 7500 ? 18 : 12;
  const gstAmount = booking.transaction
    ? booking.transaction.sgst + booking.transaction.cgst
    : subtotal * (gstRate / 100);
  const totalAmount = booking.transaction?.totalAmount || subtotal + gstAmount;

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
              background-color: #e6f7ee;
              border: 1px solid #28a745;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .status-confirmed {
              display: inline-block;
              background-color: #d4edda;
              color: #155724;
              padding: 5px 10px;
              border-radius: 4px;
              font-weight: bold;
            }
            .pricing-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            .pricing-table th {
              background-color: #f8f9fa;
              color: #495057;
              text-align: left;
              padding: 10px;
              border-bottom: 1px solid #dee2e6;
            }
            .pricing-table td {
              padding: 10px;
              border-bottom: 1px solid #dee2e6;
            }
            .pricing-table .total-row {
              font-weight: bold;
              background-color: #fff8e6;
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
            .qr-code {
              text-align: center;
              margin: 20px 0;
            }
            .button {
              background-color: #C68D07;
              color: white;
              padding: 12px 24px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin: 10px 0;
              border-radius: 4px;
              font-weight: bold;
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
              <h1>Booking Confirmation</h1>
            </div>
            <div class="content">
              <div class="message-box">
                <strong>Thank you for your booking!</strong> Your reservation is confirmed for ${
                  booking.hotel.name
                }. Current Status: <span class="status-confirmed">CONFIRMED</span>
              </div>
  
              <div class="section">
                <h2>Booking Details</h2>
                <p><strong>Booking Reference:</strong> ${booking.id}</p>
                <p><strong>Booking Date:</strong> ${formatDate(
                  booking.createdAt
                )}</p>
              </div>
  
              <div class="section">
                <h2>Guest Information</h2>
                <p><strong>Full Name:</strong> ${booking.fullName}</p>
                <p><strong>Email Address:</strong> ${booking.email}</p>
                <p><strong>Phone Number:</strong> ${booking.phoneNo}</p>
              </div>
  
              <div class="section">
                <h2>Hotel Details</h2>
                <p><strong>Hotel Name:</strong> ${booking.hotel.name}</p>
                <p><strong>Location:</strong> ${booking.location.name}</p>
                <p><strong>Room Type:</strong> ${booking.roomName}</p>
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
                <h2>Payment Details</h2>
                <table class="pricing-table">
                  <tr>
                    <td>Room Price per Night</td>
                    <td>₹${booking.price.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Number of Nights</td>
                    <td>${numberOfNights}</td>
                  </tr>
                  <tr>
                    <td>Base Amount</td>
                    <td>₹${baseAmount.toFixed(2)}</td>
                  </tr>
                  ${
                    discountAmount > 0
                      ? `
                  <tr>
                    <td>Discount</td>
                    <td>-₹${discountAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Subtotal</td>
                    <td>₹${subtotal.toFixed(2)}</td>
                  </tr>
                  `
                      : ""
                  }
                  <tr>
                    <td>GST (${gstRate}%)</td>
                    <td>₹${gstAmount.toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td>Total Amount (Inc. GST)</td>
                    <td>₹${totalAmount.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
  
              <div class="section">
                <h2>Important Information</h2>
                <p>• Check-in Time: 2:00 PM</p>
                <p>• Check-out Time: 12:00 PM</p>
                <p>• Please present a valid ID proof at check-in</p>
                <p>• Early check-in and late check-out are subject to availability</p>
                <p>• For any changes or cancellations, please contact us at least 48 hours before check-in</p>
              </div>
  
              <div class="qr-code">
                <p>Show this QR code at check-in for quick verification:</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  booking.id
                )}" alt="Booking QR Code" width="150" height="150" />
              </div>
  
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://apricushotels.com/bookings/view/${
                  booking.id
                }" class="button">View Booking Online</a>
              </div>
  
              <div class="contact-info">
                <h2 style="color: #C68D07;">Need Help?</h2>
                <p>For any assistance or queries regarding your booking:</p>
                <p>✆ Reservations: +91 8956593946</p>
                <p>✉ Email: crs@apricushotels.com</p>
                <p>⚡ Booking Reference: ${booking.id}</p>
              </div>
            </div>
            
            <div class="footer">
              <p>We look forward to welcoming you to Apricus Hotels!</p>
              <p>© ${new Date().getFullYear()} Apricus Hotels. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};
