import express from "express";
import { Category, getCategories } from "./categories";
import { validate } from "../schema/Food";

// Intensive Foods Backend - Del 2

// Börja installera prisma "npm install prisma" sedan "npx prisma init" för att skapa vår prisma schema alltså schema.prisma samt .env fil.

// Kopiera PRISMA_DATABAS_URL från vercel in i .env filen sen ersätta den falska databasurlen.

// Viktigt att se till att ha url i datasource db i shcema.prisma filen så det funkar samt ändra version från prisma 7 till prisma 6.

// Låt oss skapa vår prisma modeller i schema.prisma filen alltså såhär:

// model Category {
//  id String @id @default(cuid())
//  name String
//  Food Food[]
// }

// model Food {
//  id String @id @default(cuid())
//  name String
//  numberInStock Int
//  price Float
//  category Category @relation(fields: [categoryId], references: [id])
//  categoryId String
// }

// Sedan behöver man göra en migration genom att skriva "npx prisma migrate dev -n init" för att skapa länken mellan databasen och backend sen prisma generate för att skapa en klient på backend som vi kan använda för att spara data.

// OBS! såfort man gör en ändring i schema.prisma så måste man generera på nytt alltså skriva i terminalen "npx prisma generate".

// Efter att ha skrivit "npx prisma migrate dev -n init" så hamnar vi lite i problem och det vi kan göra är att flytta migration mappen från vår "node_backend" projekt hit sedan skriver vi bara "npx prisma migrate dev".

// Viktigt att committa detta så skrive "configured prisma and added migrations" sen tryck Commit.

const router = express.Router();

interface Food {
  _id: string;
  name: string;
  category: Category;
  numberInStock: number;
  price: number;
  isFavored: boolean;
}

const foods: Food[] = [
  {
    _id: "5b21ca3eeb7f6fbccd471815",
    name: "Apple",
    category: { _id: "5b21ca3eeb7f6fbccd471818", name: "Fruit" },
    numberInStock: 6,
    price: 10,
    isFavored: false,
  },
  {
    _id: "5b21ca3eeb7f6fbccd471816",
    name: "Banana",
    category: { _id: "5b21ca3eeb7f6fbccd471818", name: "Fruit" },
    numberInStock: 5,
    price: 15,
    isFavored: false,
  },
  {
    _id: "5b21ca3eeb7f6fbccd471817",
    name: "Cucumber",
    category: { _id: "5b21ca3eeb7f6fbccd471820", name: "Vegetables" },
    numberInStock: 8,
    price: 7,
    isFavored: false,
  },
  {
    _id: "5b21ca3eeb7f6fbccd471819",
    name: "Chips",
    category: { _id: "5b21ca3eeb7f6fbccd471814", name: "Snacks" },
    numberInStock: 7,
    price: 12,
    isFavored: false,
  },
  {
    _id: "5b21ca3eeb7f6fbccd47181a",
    name: "Cookies",
    category: { _id: "5b21ca3eeb7f6fbccd471814", name: "Snacks" },
    numberInStock: 7,
    price: 8,
    isFavored: false,
  },
  {
    _id: "5b21ca3eeb7f6fbccd47181b",
    name: "Muffins",
    category: { _id: "5b21ca3eeb7f6fbccd471814", name: "Snacks" },
    numberInStock: 7,
    price: 13,
    isFavored: false,
  },
  {
    _id: "5b21ca3eeb7f6fbccd47181e",
    name: "Carrot",
    category: { _id: "5b21ca3eeb7f6fbccd471820", name: "Vegetables" },
    numberInStock: 7,
    price: 7,
    isFavored: false,
  },
  {
    _id: "5b21ca3eeb7f6fbccd47181f",
    name: "Sallad",
    category: { _id: "5b21ca3eeb7f6fbccd471820", name: "Vegetables" },
    numberInStock: 4,
    price: 14,
    isFavored: false,
  },
  {
    _id: "5b21ca3eeb7f6fbccd471821",
    name: "Orange",
    category: { _id: "5b21ca3eeb7f6fbccd471818", name: "Fruit" },
    numberInStock: 7,
    price: 20,
    isFavored: false,
  },
];

router.get("/", (req, res) => {
  return res.send(foods);
});

router.get("/:id", (req, res) => {
  const food = foods.find((food) => food._id === req.params.id);

  if (!food)
    return res.status(404).send("The food with the given ID was not found.");

  return res.send(food);
});

router.post("/", (req, res) => {
  const validation = validate(req.body);

  console.log("req.body", req.body);

  if (!validation.success) {
    return res.status(400).send(validation.error.issues);
  }

  const category = getCategories().find(
    (category) => category._id === req.body.categoryId,
  );

  if (!category)
    return res.status(404).send("The category with the given id was not found");

  const food: Food = {
    _id: Date.now().toString(),
    name: req.body.name,
    numberInStock: req.body.numberInStock,
    price: req.body.price,
    isFavored: false,
    category,
  };

  foods.push(food);

  return res.status(201).send(food);
});

router.put("/:id", (req, res) => {
  const food = foods.find((food) => food._id === req.params.id);

  if (!food)
    return res.status(404).send("The food with the given ID was not found.");

  const validation = validate(req.body);

  if (!validation.success) {
    return res.status(400).send(validation.error.issues);
  }

  const category = getCategories().find(
    (category) => category._id === req.body.categoryId,
  );

  if (!category)
    return res.status(404).send("The category with the given id was not found");

  food.name = req.body.name;
  food.category = category;
  food.price = req.body.price;
  food.numberInStock = req.body.numberInStock;
  food.isFavored = req.body.isFavored;

  return res.send(food);
});

export default router;
