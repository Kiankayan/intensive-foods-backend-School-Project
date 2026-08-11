import express from "express";
import { validate } from "../schema/Food";
import { PrismaClient } from "@prisma/client";
import auth from "../middleware/auth";

// Admin middleware

// Problemet just nu är att vi kan ta bort en food genom Postman förutsatt att vi är autentiserade men trots att vi inte är en Admin.

// Målet med denna lektion är att begränsa så endast Admin kan anropa delete endpoint för foods.

// Logga in i en vanlig användare i vår frontend projekt, öppna devtools sedan tryck på Application, gå till Local storage och plocka ut vår token Value.

// Sedan öppnar vi Postman och öppnar upp Headers tabben där kan vi lägga till en header genom att skriva x-auth-token och nästa kolumn klistra in värdet som var vår token sedan trycker vi på Send.

// Efter vi klickade på Send med vårt get single anropet alltså "localhost:5432/api/foods/123" så istälelt för att vi fick status 401 så får vi status 404 Not Found. Detta betyder att vår auth middleware lyckades samt fick vi vårt svar från vår route handler med meddelandet "The food with the given ID was not found."

// Låt oss testa med get all alltså ändra till "localhost:5432/api/foods" med GET sedan plockar vi ett id i listan tex vår "Buddha's hand" ta id och lägg in den efter "api/foods/id" sedan ändrar vi till DELETE och det här anropet borde man kunna endast göra om vi är admin men vi är inloggade som vanlig användare just nu sen trycker vi Send.

// Efter vi trycker på Send så får vi status 200 OK vilket betyder att vi kunde ta bort vår id som vanlig användare.

// För att lösa detta så måste man skapa en Admin middleware men innan vi börjar bygga vår Admin middleware så börjar vi först commita vår kod och skriver "added auth middleware" sen Commit.

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const foods = await prisma.food.findMany();
  return res.send(foods);
});

router.get("/:id", auth, async (req, res) => {
  const id = req.params.id as string;

  const food = await prisma.food.findFirst({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!food)
    return res.status(404).send("The food with the given ID was not found.");

  return res.send(food);
});

router.post("/", auth, async (req, res) => {
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

router.put("/:id", auth, async (req, res) => {
  const id = req.params.id as string;

  const food = await prisma.food.findFirst({
    where: { id },
  });

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
    where: { id },
    data: {
      name: req.body.name,
      numberInStock: req.body.numberInStock,
      price: req.body.price,
      categoryId: req.body.categoryId,
    },
  });

  return res.send(updatedFood);
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id as string;

  const food = await prisma.food.findFirst({
    where: { id },
  });

  if (!food)
    return res.status(404).send("The food with the given ID was not found.");

  const deletedFood = await prisma.food.delete({
    where: { id },
  });

  return res.send(deletedFood);
});

export default router;
