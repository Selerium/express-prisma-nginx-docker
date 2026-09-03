import { Role, Gender } from "../src/generated/prisma/client.ts";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prismaClient.ts";

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const usersData = [
    {
      email: "admin@sampledomain.com",
      name: "John Smith",
      role: Role.ADMIN,
      gender: Gender.MALE,
    },
    {
      email: "sarah@sampledomain.com",
      name: "Sarah Johnson",
      role: Role.USER,
      gender: Gender.FEMALE,
    },
    {
      email: "mike@sampledomain.com",
      name: "Mike Davis",
      role: Role.USER,
      gender: Gender.MALE,
    },
    {
      email: "emma@sampledomain.com",
      name: "Emma Wilson",
      role: Role.USER,
      gender: Gender.FEMALE,
    },
    {
      email: "jake@sampledomain.com",
      name: "Jake Thompson",
      role: Role.USER,
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
