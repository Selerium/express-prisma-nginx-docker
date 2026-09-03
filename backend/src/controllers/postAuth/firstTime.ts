import express from "express";
import AppError from "../../lib/appError.ts";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prismaClient.ts";

const firstTimeHandler = express.Router();

firstTimeHandler.post("", async (req, res) => {
  const {
    gender,
    dob,
    nationality,
    phone,
    role,
  } = req.body;

  if (!gender || !dob || !nationality || !phone || !role) {
    throw new AppError("Missing required fields", 400);
  }

  if (role !== "STUDENT" && role !== "LEADER") {
    throw new AppError("Invalid role", 400);
  }

  const data: Record<string, unknown> = {
    gender,
    dob: new Date(dob),
    nationality,
    phone,
    role,
    firstTime: false,
  };

  const profile = await prisma.profile.update({
    where: { id: req.user.id },
    data,
    include: {
      user: { select: { email: true } },
    },
  });

  const jwtsecret = process.env.JWT_SECRET || "";
  const accessToken = jwt.sign(
    {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      firstTime: false,
    },
    jwtsecret,
    { expiresIn: "15m", subject: profile.id }
  );

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN ?? undefined,
    path: "/",
    maxAge: 15 * 60 * 1000,
  });

  const response = {
    createdAt: profile.createdAt,
    user: { name: profile.name, email: profile.user.email },
    role: profile.role,
    firstTime: profile.firstTime,
    gender: profile.gender,
    dob: profile.dob,
    nationality: profile.nationality,
    phone: profile.phone,
  };

  res.status(200).json({ data: response, error: false, message: "" });
});

export default firstTimeHandler;
