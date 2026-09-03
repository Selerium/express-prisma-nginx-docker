import { Role, Gender } from "../generated/prisma/client.ts";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prismaClient.ts";

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const usersData = [
    {
      email: "admin@crosscurrent.com",
      name: "John Smith",
      role: Role.ADMIN,
      gender: Gender.MALE,
    },
    {
      email: "sarah@crosscurrent.com",
      name: "Sarah Johnson",
      role: Role.LEADER,
      gender: Gender.FEMALE,
    },
    {
      email: "mike@crosscurrent.com",
      name: "Mike Davis",
      role: Role.LEADER,
      gender: Gender.MALE,
    },
    {
      email: "emma@crosscurrent.com",
      name: "Emma Wilson",
      role: Role.STUDENT,
      gender: Gender.FEMALE,
    },
    {
      email: "jake@crosscurrent.com",
      name: "Jake Thompson",
      role: Role.STUDENT,
      gender: Gender.MALE,
    },
  ];

  for (const u of usersData) {
    await prisma.user.create({
      data: {
        email: u.email,
        password: passwordHash,
        emailVerified: true,
        profile: {
          create: {
            name: u.name,
            role: u.role,
            gender: u.gender,
            firstTime: false,
            nationality: "Emirati",
            phone: "+971-55-0100",
            dob: new Date("2005-06-15"),
          },
        },
      },
    });
  }

  console.log("Users and profiles created");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
