import express from "express";
import AppError from "../../lib/appError.ts";
import { prisma } from "../../lib/prismaClient.ts";

const profilesHandler = express.Router();

profilesHandler.get("/search", async (req, res) => {
  const q = (req.query.q as string || "").trim();

  if (!q) {
    res.status(200).json({ data: [], error: false, message: "" });
    return;
  }

  const profiles = await prisma.profile.findMany({
    where: {
      id: { not: req.user!.id },
      name: { contains: q, mode: "insensitive" },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
    take: 20,
  });

  res.status(200).json({ data: profiles, error: false, message: "" });
});

profilesHandler.get("/:id", async (req, res) => {
  const profile = await prisma.profile.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { email: true } },
    },
  });

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  const isLeader = req.user!.role === "LEADER" || req.user!.role === "ADMIN";

  const data = {
    id: profile.id,
    name: profile.name,
    email: isLeader ? profile.user.email : "",
    phone: isLeader ? (profile.phone || "") : "",
    role: profile.role || "STUDENT",
    gender: isLeader ? (profile.gender || "") : "",
    nationality: isLeader ? (profile.nationality || "") : "",
    dob: isLeader ? (profile.dob?.toISOString() || "") : "",
    firstTime: profile.firstTime,
  };

  res.status(200).json({ data, error: false, message: "" });
});

export default profilesHandler;
