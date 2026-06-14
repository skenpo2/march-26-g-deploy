export const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to send email: ${errorData.error.message}`);
  }

  return await response.json();
};

const otpEmailTemplate = (code, { appName = 'Morbyte Fellowship', expiresInMinutes = 10 } = {}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your ${appName} verification code</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f5f7; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">
            <tr>
              <td style="background-color:#0f172a; padding:28px 40px;">
                <span style="color:#ffffff; font-size:22px; font-weight:700; letter-spacing:-0.5px;">${appName}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 8px 40px;">
                <h1 style="margin:0 0 12px 0; font-size:20px; color:#0f172a; font-weight:600;">Verify your email</h1>
                <p style="margin:0; font-size:15px; line-height:1.6; color:#475569;">
                  Use the verification code below to continue. This code expires in
                  <strong style="color:#0f172a;">${expiresInMinutes} minutes</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 40px;">
                <div style="background-color:#f1f5f9; border:1px solid #e2e8f0; border-radius:12px; padding:20px; text-align:center;">
                  <span style="font-size:34px; font-weight:700; letter-spacing:10px; color:#0f172a;">${code}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px 40px;">
                <p style="margin:0; font-size:13px; line-height:1.6; color:#94a3b8;">
                  If you didn't request this code, you can safely ignore this email. For your security, never share this code with anyone.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f8fafc; padding:20px 40px; border-top:1px solid #eef2f6;">
                <p style="margin:0; font-size:12px; color:#94a3b8; text-align:center;">
                  &copy; ${appName}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const sendOtpEmail = async (to, code, options = {}) => {
  const appName = options.appName ?? 'Morbyte Fellowship';
  const subject = `Your ${appName} verification code: ${code}`;
  const html = otpEmailTemplate(code, options);

  return sendEmail(to, subject, html);
};

export default sendEmail;
