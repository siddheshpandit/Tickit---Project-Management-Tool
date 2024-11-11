import { currentUser } from "@clerk/nextjs/server";
import { db } from "../../lib/prisma";  // Make sure you have your Prisma client properly set up

export default async function handler(req, res) {
  if (req.method === "POST") {
    const user = await currentUser();

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const existingUser = await db.user.findUnique({
        where: { clerkUserId: user.id },
      });

      if (existingUser) {
        return res.status(200).json({ message: "User already exists." });
      }

      // Create the user in the database
      const name = `${user.firstName} ${user.lastName}`;
      const newUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          name: name,
          email: user.emailAddresses[0].emailAddress,
          imageUrl: user.imageUrl,
        },
      });

      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
