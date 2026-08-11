import express from "express";
import { validate } from "../schema/Food";
import { PrismaClient } from "@prisma/client";
import auth from "../middleware/auth";
import admin from "../middleware/admin";

// Admin middleware

// Problemet just nu är att vi kan ta bort en food genom Postman förutsatt att vi är autentiserade men trots att vi inte är en Admin.

// Målet med denna lektion är att begränsa så endast Admin kan anropa delete endpoint för foods.

// Logga in i en vanlig användare i vår frontend projekt, öppna devtools sedan tryck på Application, gå till Local storage och plocka ut vår token Value.

// Sedan öppnar vi Postman och öppnar upp Headers tabben där kan vi lägga till en header genom att skriva x-auth-token och nästa kolumn klistra in värdet som var vår token sedan trycker vi på Send.

// Efter vi klickade på Send med vårt get single anropet alltså "localhost:5432/api/foods/123" så istälelt för att vi fick status 401 så får vi status 404 Not Found. Detta betyder att vår auth middleware lyckades samt fick vi vårt svar från vår route handler med meddelandet "The food with the given ID was not found."

// Låt oss testa med get all alltså ändra till "localhost:5432/api/foods" med GET sedan plockar vi ett id i listan tex vår "Buddha's hand" ta id och lägg in den efter "api/foods/id" sedan ändrar vi till DELETE och det här anropet borde man kunna endast göra om vi är admin men vi är inloggade som vanlig användare just nu sen trycker vi Send.

// Efter vi trycker på Send så får vi status 200 OK vilket betyder att vi kunde ta bort vår id som vanlig användare.

// För att lösa detta så måste man skapa en Admin middleware men innan vi börjar bygga vår Admin middleware så börjar vi först commita vår kod och skriver "added auth middleware" sen Commit.

// Nu öppnar vi middleware mappen där vi skapar en ny fil som heter admin.ts där exporterar vi en funktion heter admin där den tar emot våra 3 parametrar som är req,res,next och även importera alltså såhär:

// import { NextFunction, Request, Response } from "express";

// export default function admin(req: Request, res: Response, next: NextFunction) {}

// Vår admin middleware är super simpel där vi behöver en endast if sats som kollar om användaren är admin om inte den är det så skickar vi status "403 Forbidden".

// För att kolla om en användare är en admin så behöver vi gå in i auth.ts där vi kan ha tillgång till user objekten. När vi kör vår jwt.verify så syns det i vår payload via hemsidan "jwt.io" så kopierar vi vår token från Postman och klistrar in i jwt.io så ser vi vår Payload med user objektet samt isAdmin och det är just den vi vill komma åt.

// Frågan är hur löser vi detta genom att överföra const.user som finns i auth.ts fil till vår admin.ts fil?

// Vi löser det genom att skriva i auth.ts fil där vi skapar en interface authRequest som ska ärva den vanliga express requesten sedan utöka den med ett user objekt där vår user objekt ska ha en typ som kallas för Omit. Omit betyder uteslut såhär ska det se ut i auth.ts filen alltså såhär:

// import { User } from "@prisma/client";
// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";

// export interface AuthRequest extends Request {
//    user: Omit<User, "password">
// }

// Sedan ändrar vi vår const user till detta såhär:

// const user = jwt.verify(token, process.env.JWT_SECRET!) as Omit<User, "password">
//   (req as AuthRequest).user = user

// Spara vår auth.ts sedan gå till admin.ts filen och skriver såhär:

// import { NextFunction, Request, Response } from "express";
// import { AuthRequest } from "./auth";

// export default function admin(req: Request, res: Response, next: NextFunction) {
//  const isAdmin = (req as AuthRequest).user.isAdmin;

//  if (!isAdmin) return res.status(403).send("Unauthorized");

//  next();
// }

// Sista steget är att att applicera vår admin middleware i admin.ts på de endpoints som kräver admin behörighet som finns i vår foods.ts fil.

// Så vi ska lägga till importen samt vår admin alltså såhär:

// import  admin  from "../middleware/admin";

// router.delete("/:id", auth, admin, async (req, res)

// Låt oss nu testa detta i vår Postman så börja med att GET all för att hämta ett id från listan.

// Plocka id från vår "Muffin" sedan lägg in den i URL:n "localhost:5432/api/foods/id" ändra metoden till DELETE och trycka Send.

// Så ser vi att vi får status 403 Forbidden med meddelandet "Unauthorized" alltså så fungerar allt som det ska.

// Går vi nu tillbaka till vår frontend hemsida i intensive foods och loggar ut vår användare sedan loggar in med ett admin konto så ser vi att delete knappen finns för vår Muffin i listan och att vi är inloggade som Admin.

// Går vi nu till Application i devtools och plockar ut token Value och klistrar in i Postman headers för vår x-auth-token och trycker på Send för exakt samma anrop så ser vi att vi får status 200 OK där vi nu kan ta bort vårt food objekt.

// Sammanfattningsvis: Nu har vi lagt till begränsning på vår backend och inte bara på frontend och låt oss commita vår admin middleware för vår sista lektion för backend modul så skriv "added admin middleware" sedan tryck på Commit.

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

router.delete("/:id", auth, admin, async (req, res) => {
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
