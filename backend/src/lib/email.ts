import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : "";


export const sendVerificationEmail = async (
  to: string,
  verificationUrl: string
) => {
  if (process.env.PROD === "false") {
    console.log(`[email] verification link for ${to}: ${verificationUrl}`);
    return ;
  }

  const { data, error } = await resend.emails.send({
    from: "do-not-reply@sampledomain.ae",
    to,
    subject: "Verify your email | sampledomain",
    text: `Welcome to sampledomain! Please verify your email address by opening this link: ${verificationUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h2 style="color: #1a1a1a;">Verify your email</h2>
        <p style="color: #333;">Welcome to sampledomain! Please confirm your email address to activate your account.</p>
        <a href="${verificationUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background-color: #525252; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Verify email
        </a>
        <p style="color: #555; font-size: 14px;">
          Or copy and paste this link into your browser:<br />
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        <p style="color: #777; font-size: 12px;">This link expires in 24 hours.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const sendPasswordResetEmail = async (
  to: string,
  resetUrl: string
) => {
  if (process.env.PROD === "false") {
    console.log(`[email] password reset link for ${to}: ${resetUrl}`);
    return ;
  }

  const { data, error } = await resend.emails.send({
    from: "do-not-reply@sampledomain.ae",
    to,
    subject: "Reset your password | sampledomain",
    text: `You requested a password reset. Please open this link to set a new password: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h2 style="color: #1a1a1a;">Reset your password</h2>
        <p style="color: #333;">We received a request to reset the password for your sampledomain account.</p>
        <a href="${resetUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background-color: #525252; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Reset password
        </a>
        <p style="color: #555; font-size: 14px;">
          Or copy and paste this link into your browser:<br />
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
        <p style="color: #777; font-size: 12px;">This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
};
