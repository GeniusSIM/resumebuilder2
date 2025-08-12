import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@demo.com" },
    update: {},
    create: {
      email: "demo@demo.com",
      name: "Demo User",
      passwordHash,
      plan: "PRO"
    }
  });

  await prisma.resume.create({
    data: {
      userId: user.id,
      title: "Software Engineer Resume",
      template: "MODERN",
      data: {
        basics: {
          fullName: "Alex Johnson",
          title: "Full Stack Engineer",
          email: "alex@example.com",
          phone: "+213 555 012345",
          location: "Algiers, Algeria",
          website: "https://alex.dev"
        },
        summary: "Full-stack engineer with 5+ years building SaaS products.",
        skills: [
          { name: "JavaScript", level: 5 },
          { name: "TypeScript", level: 5 },
          { name: "React", level: 5 },
          { name: "Node.js", level: 5 },
          { name: "PostgreSQL", level: 4 }
        ],
        experience: [
          {
            company: "Acme SaaS",
            role: "Senior Full Stack Engineer",
            start: "2022-01-01",
            end: "Present",
            bullets: [
              "Led migration to Next.js App Router and TurboRepo.",
              "Designed PDF export pipeline and improved performance by 35%."
            ]
          }
        ],
        education: [
          { school: "USTHB", degree: "MSc in Computer Science", start: "2017", end: "2019" }
        ],
        projects: [
          {
            name: "ResumeBuilder",
            link: "https://example.com",
            bullets: ["Built template engine", "Added cover letter generator"]
          }
        ]
      }
    }
  });

  console.log("🌱 Seed completed. User: demo@demo.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
