// lib/email-templates/password-reset.ts
export function generatePasswordResetEmailTemplate(
  name: string,
  temporaryPassword: string
): string {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .header {
            background-color: #4f46e5;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
          .password {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Apricus Hotels - Password Reset</h2>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>We received a request to reset your password for your Apricus Hotels account.</p>
            <p>Your temporary password is:</p>
            <div class="password">${temporaryPassword}</div>
            <p>For security reasons, please log in with this temporary password and immediately update it to a new password of your choice.</p>
            <p>If you did not request this password reset, please contact our support team immediately.</p>
            <p>Thank you,<br>Apricus Hotels Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Apricus Hotels. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
}
