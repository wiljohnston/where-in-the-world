import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const latest = await prisma.$queryRaw`
    SELECT DISTINCT ON (name) id, name, latitude, longitude, "createdAt"
    FROM "CheckIn"
    ORDER BY name, "createdAt" DESC
  `;
  res.status(200).json(latest);
}
