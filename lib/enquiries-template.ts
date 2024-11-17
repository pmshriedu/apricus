// lib/enquiry-email-template.ts
export interface Enquiry {
  fullName: string;
  email: string;
  phoneNumber: string;
  id: string;
  createdAt: Date;
}

export const generateEnquiryEmailTemplate = (enquiry: Enquiry) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Customer Enquiry</title>
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
            .priority-tag {
              display: inline-block;
              background-color: #fff3cd;
              color: #856404;
              padding: 5px 10px;
              border-radius: 4px;
              font-weight: bold;
              margin: 10px 0;
            }
            .message-box {
              background-color: #fff8e6;
              border: 1px solid #C68D07;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
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
            .action-needed {
              background-color: #f8d7da;
              border: 1px solid #f5c6cb;
              color: #721c24;
              padding: 10px;
              margin: 20px 0;
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
              <h1>New Customer Enquiry</h1>
            </div>
            <div class="content">
              <div class="message-box">
                <strong>Important Notice:</strong> A new customer enquiry has been received and requires immediate attention.
                <div class="priority-tag">NEW ENQUIRY</div>
              </div>
  
              <div class="section">
                <h2>Customer Information</h2>
                <p><strong>Full Name:</strong> ${enquiry.fullName}</p>
                <p><strong>Email Address:</strong> ${enquiry.email}</p>
                <p><strong>Phone Number:</strong> ${enquiry.phoneNumber}</p>
                <p><strong>Reference ID:</strong> ${enquiry.id}</p>
              </div>
  
              <div class="section">
                <h2>Enquiry Timeline</h2>
                <p><strong>Received On:</strong> ${formatDate(
                  enquiry.createdAt
                )}</p>
                <p><strong>Response SLA:</strong> Within 24 hours</p>
              </div>
  
              <div class="action-needed">
                <p style="margin: 0;">⚠️ Required Actions:</p>
                <ul style="margin: 10px 0;">
                  <li>Review customer details</li>
                  <li>Contact customer within 24 hours</li>
                  <li>Update enquiry status after initial contact</li>
                  <li>Document all communication in CRM</li>
                </ul>
              </div>
  
              <div class="section">
                <h2>Internal Notes</h2>
                <p>• This is a general enquiry that requires follow-up</p>
                <p>• Please use the standard response template for initial contact</p>
                <p>• Ensure all contact attempts are logged in the system</p>
              </div>
  
              <div class="message-box" style="margin-top: 30px;">
                <p style="margin: 0;"><strong>Quick Response Guidelines:</strong></p>
                <ul style="margin: 10px 0;">
                  <li>Introduce yourself and thank them for their interest</li>
                  <li>Acknowledge their enquiry</li>
                  <li>Ask for any additional information if needed</li>
                  <li>Provide relevant information about our services</li>
                  <li>Include your direct contact information</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from the Enquiry Management System</p>
              <p>© ${new Date().getFullYear()} Apricus Hotels. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};
