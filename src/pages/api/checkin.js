import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { name, latitude, longitude } = req.body;
  if (!name || latitude == null || longitude == null) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const checkin = await prisma.checkIn.create({
    data: { name, latitude, longitude },
  });
  res.status(201).json(checkin);
}
