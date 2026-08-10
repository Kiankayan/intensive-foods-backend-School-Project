import express from "express";
import { validate } from "../schema/Food";
import { PrismaClient } from "@prisma/client";

// Admin

// Vi börja med att commita den här auth routen och skriver "added auth route and schema" trycker Commit.

// Sedan öppnar vi vår schema.prisma och lägger is admin property i vår model User alltså såhär:

// isAdmin Boolean @default(false)

// Vi kan också passa på att lägga @unique framför username String. Detta kommer säkerställa att databasen aldrig innehåller en user som har samma username som en annan user alltså såhär i helhet:

// model User {
//  id String @id @default(cuid())
//  name String
//  username String @unique
//  password String
//  isAdmin Boolean @default(false)
// }

// Efter ha gjort ändring i vår schema.prisma så måste vi öppna terminalen och göra en "npx prisma migrate dev -n added_admin_prop_to_user" trycker vi enter så kommer det skapas en migration med dessa ändringar.

// Vi får en varning med texten " • A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail." Detta betyder att om vår databas redan innehåller en user med samma username så kommer vi inte kunna att köra den här migration pga vi har gjort att username måste vara unik men vi har bara en user i vår databas just nu så då kan vi trycka på "y" i terminalen och det borde funka alldeles utmärkt.

// Efter vår migration så kan vi starta om vår npx prisma studio genom att trycka CTRL + C sedan skriva igen "npx prisma studio" Sedan går vi in i studio och refreshar sidan.

// Då borde vi se texten "isAdmin false" vilket betyder att allting fungerade.

// Men vi kan ändra direkt genom att dubbelklicka på "false" så står det true och trycker på knappen "Save 1 change" så blir vi då Admin.

// För att få det i effekt så måste vi logga ut och in i vår frontend och efter så ska vi kunna se våra "Delete" knappar i listan vilket betyder att vi är Admin.

// Vi kan också dubbelkolla detta genom att öppna upp consolen i hemsidan sen trycka på "Application", i Local storage så ser vi Key "token" plocka ut vår token och klistra in den i jwt.io så ser vi vår Payload att isAdmin: true.

// Låt oss nu commita dessa ändringar och skriva "added isadmin to database model" sen tryck commit.

// Nästa lektion så ska vi skicka ut JWT som en header från user routen för att en användaren ska kunna logga in efter registrering

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const foods = await prisma.food.findMany();
  return res.send(foods);
});

router.get("/:id", async (req, res) => {
  const food = await prisma.food.findFirst({ where: { id: req.params.id } });

  if (!food)
    return res.status(404).send("The food with the given ID was not found.");

  return res.send(food);
});

router.post("/", async (req, res) => {
  const validation = validate(req.body);

  console.log("req.body", req.body);

  if (!validation.success) {
    return res.status(400).send(validation.error.issues);
  }

  const category = await prisma.category.findFirst({
    where: { id: req.body.categoryId },
  });

  if (!category)
    return res.status(404).send("The category with the given id was not found");

  const food = await prisma.food.create({
    data: {
      name: req.body.name,
      numberInStock: req.body.numberInStock,
      price: req.body.price,
      categoryId: req.body.categoryId,
    },
    include: {
      category: true,
    },
  });

  return res.status(201).send(food);
});

router.put("/:id", async (req, res) => {
  const food = await prisma.food.findFirst({ where: { id: req.params.id } });

  if (!food)
    return res.status(404).send("The food with the given ID was not found.");

  const validation = validate(req.body);

  if (!validation.success) {
    return res.status(400).send(validation.error.issues);
  }

  const category = await prisma.category.findFirst({
    where: { id: req.body.categoryId },
  });

  if (!category)
    return res.status(404).send("The category with the given id was not found");

  const updatedFood = await prisma.food.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name,
      numberInStock: req.body.numberInStock,
      price: req.body.price,
      categoryId: req.body.categoryId,
    },
  });

  return res.send(food);
});

router.delete("/:id", async (req, res) => {
  const food = await prisma.food.findFirst({ where: { id: req.params.id } });

  if (!food)
    return res.status(404).send("The food with the given ID was not found.");

  const deletedFood = await prisma.food.delete({
    where: { id: req.params.id },
  });
  return res.send(food);
});

export default router;
