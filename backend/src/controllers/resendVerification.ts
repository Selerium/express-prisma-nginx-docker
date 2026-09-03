import express from "express";
import crypto from "crypto";
import isEmail from "validator/lib/isEmail.js";
import { prisma } from "../lib/prismaClient.ts";
import { sendVerificationEmail } from "../lib/email.ts";

const resendVerificationHandler = express.Router();

resendVerificationHandler.post("", async (req, res) => {
  const { email } = req.body;

  if (!email || !isEmail(email)) {
    res.status(200).json({ data: null, error: false, message: "" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (user && !user.emailVerified) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: tokenHash,
        emailVerificationTokenExpiresAt: expiresAt,
      },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    try {
      await sendVerificationEmail(user.email, verificationUrl);
    } catch (err) {
      console.error("Failed to resend verification email:", err);
    }
  }

  res.status(200).json({ data: null, error: false, message: "" });
});

export default resendVerificationHandler;
