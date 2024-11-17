// lib/contact-email-template.ts
interface Contact {
  name: string;
  email: string;
  createdAt: Date;
  id: string | number;
  message: string;
}
export const generateContactEmailTemplate = (contact: Contact) => {
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
            <title>New Contact Form Submission</title>
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
              .message-content {
                background-color: #fff8e6;
                border: 1px solid #C68D07;
                padding: 20px;
                margin: 20px 0;
                border-radius: 4px;
                white-space: pre-wrap;
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
                <h1>New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="section">
                  <h2>Contact Details</h2>
                  <p><strong>Name:</strong> ${contact.name}</p>
                  <p><strong>Email:</strong> ${contact.email}</p>
                  <p><strong>Submitted On:</strong> ${formatDate(
                    contact.createdAt
                  )}</p>
                  <p><strong>Reference ID:</strong> ${contact.id}</p>
                </div>
  
                <div class="section">
                  <h2>Message Content</h2>
                  <div class="message-content">
                    ${contact.message}
                  </div>
                </div>
  
                <div class="section">
                  <h2>Response Guidelines</h2>
                  <ul style="margin: 10px 0;">
                    <li>Acknowledge receipt within 24 hours</li>
                    <li>Review message content thoroughly</li>
                    <li>Forward to relevant department if necessary</li>
                    <li>Document response in customer service system</li>
                  </ul>
                </div>
              </div>
              
              <div class="footer">
                <p>This is an automated notification from the Contact Management System</p>
                <p>© ${new Date().getFullYear()} Apricus Hotels. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
};
