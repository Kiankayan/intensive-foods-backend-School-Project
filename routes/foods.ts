import express from "express";
import { validate } from "../schema/Food";
import { PrismaClient } from "@prisma/client";

// Headers

// Om vi kollar på vår UserService.ts fil i vår frontend projekt så ser vi vår UserRegister funktion så skickar vi anropet till "http://localhost:5432/api/users" från de api anropet plockar vi ut headers, x-auth-token som innehåller vår JWT token som vi sätter sen i vår local storage med hjälp av auth.loginwithJwt. Detta fungerar inte just nu pga vår user route på backend inte returnerar  x-auth-token header men det kommer vi fixa.

// För att se till att vi registrerar oss samt är inloggade i vår intensive foods hemsida direkt efter registreringen så måste vi ha denna kod b.l.a object destructering och spread operator samt lägga till koder i user service.ts filen i på vår backend projekt alltså såhär:

// import jwt from "jsonwebtoken";

// const { password: p, ...userWithoutPassword } = user;

//  const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET!);

//  return res
//    .header("access-control-expose-headers", "x-auth-token")
//    .header("x-auth-token", token)
//    .send(userWithoutPassword);
// });

// Se bilder/anteckningar

// Efter detta så skapar vi en ny användare via registrering och trycker register knappen så är vi automatiskt inloggade samt isAdmin false där "Delete" knapparna är borta och vi har ingen tillgång till dem.

// Slutligen så commitar vi med "added token to user response headers" och trycker på Commit

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
