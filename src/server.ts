import { PrismaClient } from "@prisma/client";
import express from "express";
import { z } from "zod";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());

app.get("/users", async (request, response) => {
  const users = await prisma.user.findMany();

  return response.status(200).json(users);
});

app.post("/users", async (request, response) => {
  const usersParser = z.object({
    name: z.string(),
    email: z.string().email(),
  });
  const { name, email } = usersParser.parse(request.body);

  await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return response.status(201).send();
});

app.listen(
  process.env.PORT ? Number(process.env.PORT) : 3333,
  "0.0.0.0",
  () => {
    console.log(
      `Server running at ${process.env.PORT ? Number(process.env.PORT) : 3333}`
    );
  }
);
