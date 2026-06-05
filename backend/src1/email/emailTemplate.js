export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to NexTalk</title>
  </head>

  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">

    <div style="background: linear-gradient(to right, #4361ee, #3a86ff); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0;">Welcome to NexTalk!</h1>
    </div>

    <div style="background-color: white; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">

      <p style="font-size: 18px;">
        <strong>Hello ${name},</strong>
      </p>

      <p>
        We're excited to have you join NexTalk! Connect with friends, family,
        and colleagues in real-time from anywhere in the world.
      </p>

      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #4361ee;">
        <p><strong>Get started in just a few steps:</strong></p>

        <ul>
          <li>Set up your profile picture</li>
          <li>Find and add your contacts</li>
          <li>Start chatting instantly</li>
          <li>Share photos, videos and messages</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="${clientURL}"
          style="
            background: linear-gradient(to right, #4361ee, #3a86ff);
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 50px;
            display: inline-block;
            font-weight: 600;
          "
        >
          Open NexTalk
        </a>
      </div>

      <p>
        If you need any help or have questions, we're always here to assist you.
      </p>

      <p>Happy chatting!</p>

      <p>
        Best regards,<br />
        <strong>The NexTalk Team</strong>
      </p>

    </div>
  </body>
  </html>
  `;
}