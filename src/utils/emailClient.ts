import nodemailer from "nodemailer";

// 郵件配置 - 使用 OAuth 2.0 認證
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

// 發送重設密碼郵件
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  expiryMinutes: number,
): Promise<boolean> => {
  try {
    // 郵件內容
    const mailOptions = {
      from: `Eventa <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Eventa - 密碼重設請求",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>密碼重設請求</h2>
          <p>您好，</p>
          <p>我們收到了重設您 Eventa 帳戶密碼的請求。以下是您的密碼重設令牌：</p>
          <div style="text-align: center; margin: 30px 0;">
            <p style="background-color: #f5f5f5; padding: 15px; font-family: monospace; font-size: 16px; border: 1px solid #ddd; border-radius: 4px;">${resetToken}</p>
          </div>
          <p>此令牌將在 ${expiryMinutes} 分鐘後過期。</p>
          <p>如果您並未請求重設密碼，請忽略此郵件，您的帳戶將維持安全。</p>
          <p>謝謝，</p>
          <p>Eventa 團隊</p>
        </div>
      `,
    };

    // 發送郵件
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("發送重設密碼郵件失敗:", error);
    return false;
  }
};

// 發送 Google OAuth 登入確認郵件
export const sendGoogleLoginEmail = async (email: string, name: string): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `Eventa <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Eventa - Google 帳號登入通知",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Google 帳號登入通知</h2>
          <p>您好 ${name}，</p>
          <p>您已成功使用 Google 帳號登入 Eventa。</p>
          <p>如果這不是您的操作，請立即聯繫我們的支援團隊。</p>
          <p>謝謝，</p>
          <p>Eventa 團隊</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("發送 Google 登入確認郵件失敗:", error);
    return false;
  }
};
