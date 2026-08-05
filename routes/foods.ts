import express from "express";
import { validate } from "../schema/Food";
import { PrismaClient } from "@prisma/client";

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

// Viktigt att committa detta så skrive "configured prisma and added migrations" sen tryck Commit efter så kan vi börja arbeta med vår prisma client som vi skapade.

// Börjar med categories.ts filen sedan skriver vi längts upp för att importera prisma clienten och skapa const prisma alltså såhär:

// "import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// Sedan går vi till vår router.get och skriver detta:

// router.get("/api/categories", async (req, res) => {
//  await prisma.category.findMany();
//  return res.send(categories);
// });

// Nu har vi inga kategorier i vår databas men vi löser det genom att skapa tre nya och gå in i index.ts och skriver först vår prisma import och const prisma sedan kategorierna alltås såhär såhär:

// async function createCategory(name: string) {
//  const category = await prisma.category.create({ data: { name } });
//  console.log(category);
// }

// createCategory("Fruit");
// createCategory("Vegetables");
// createCategory("Snacks");

// Sedan skrive vi nodemon index.ts så får vi upp våra tre kategorier som har skapats i databasen.

// Nu kan vi ta bort den koden för det för tillfälighetens skull samt prisma importen och prisma const.

// Nu kan vi gå till Postman och skriva i URL:n "http://localhost:5432/api/categories" för att se om vi får vår kategorier från vår databas och vi får dessa tre kategorier i vår postman:

//[
//    {
//        "id": "cmsf16gfx0000bv6g0oorsp2q",
//        "name": "Snacks"
//    },
//    {
//        "id": "cmsf16gls0001bv6gxdnknsx3",
//        "name": "Vegetables"
//    },
//    {
//        "id": "cmsf16gly0002bv6goyasj71m",
//        "name": "Fruit"
//    }
//]

// Så nu har vi kopplat vår categories.ts till vår databas där vi får våra id och namn på våra 3 kategorier.

// Nu ska vi göra samma med foods.ts filen så vi ändrar vår router.get till detta såhär:

// router.get("/", async (req, res) => {
// const foods =await prisma.food.findMany();
// return res.send(foods);
// });

// Sedan ändrar vi vår router.get single alltså "id" så vi ändrar det till detta:

// router.get("/:id", async (req, res) => {
//  const food = await prisma.food.findFirst({ where: { id: req.params.id } });

// Sedan ändrar vi vår router.post samt använder include så vi skapar relations alltså vi gör såhär:

// router.post("/", async (req, res) => {
//  const validation = validate(req.body);

//  console.log("req.body", req.body);

//  if (!validation.success) {
//    return res.status(400).send(validation.error.issues);
//  }

//  const category = await prisma.category.findFirst({
//    where: { id: req.body.categoryId },
//  });

//  if (!category)
//    return res.status(404).send("The category with the given id was not found");

//  const food = await prisma.food.create({
//    data: {
//      name: req.body.name,
//      numberInStock: req.body.numberInStock,
//      price: req.body.price,
//      categoryId: req.body.categoryId,
//    },
//    include: {
//      category: true,
//    },
//  });

//  return res.status(201).send(food);
// });

// Om det känns lite luddigt när man kommer tillbaka till anteckningar då frågar vi chatgpt för upplysning och upprepning.

// Nu så är det router.put och router.delete som ska ändras samt läggas till och se nedan bland koden i foods.ts filen.

// Ett annat sätt att kolla är i terminalen med ny flik och skriva "npx prisma studio" och sedan kolla i databasen.

// Sedan tar man bort importen som har för vår fake array att gör alltså vår import { Category, getCategories } längst upp samt våra interface och const foods i foods.ts. Sedan kan vi ta bort koden som vi skapade i categories.ts filen. Så vi behöver inte de längre eftersom det funkar nu direkt mot vår databas. Sedan gör man en commit och skriver "connected food and category routes to database" sedan trycker på Commit.

// Innan vi avslutar så vill vi öppna vår intensive-foods-frontend mapp som finns i mappen "React 14" men kopierat en ny i "Node.js 17" mappen, där vi byter ut vår const API_BASEURL som finns i FoodService.ts filen. Alltså istället för den går mot server så ska den gå mot vår egna som vi skapade alltså vår localhost:5432. Det vi gör är att kommentera ut den gamla sen skriver den nya såhär:

// const API_BASEURL = "http://localhost:5432/api/foods";

// Så gör vi samma med vår categoryService.ts filen som går till "http://localhost:5432/api/categories".

// Ändra även vår authService och userService också så ändra dessa två så vibyter till "http://localhost:5432/api/users" och "http://localhost:5432/api/auth".

// Sedan sparar vi och öppnar terminalen med "npm run dev" för att se om alla våra foods hämtas eller inte.

// Vår foods hämtades inte och ser man i console på browser så står det massa error med texten:

// "Access to XMLHttpRequest at 'http://localhost:5432/api/categories' from origin 'http://localhost:5173' has been blocked by CORS policy"

// CORS står för "Cross Origin Resource Sharing" Alltås vad CORS är att dessa två är inte samma domän alltså våra localhost som du ser ena är 5432 och den andra var 5173. Dessa två kan inte prata med varandra om inte backend explicit tillåter att vår domän gör anrop till backend.

// Alltså för att lösa detta problem och ställa in CORS så är det enkelt. Vi går till vår Intensive-foods-backend och öppnar en ny terminal sen skriver "npm intall cors" sedan går vi till vår index.ts fil där vi importerar cors och den kommer bli röd markerad och säga att vi saknar typen så lägger man musen på så ser man vad som ska skrivas i terminalen och lösa problemet alltså är det detta "npm i --save-dev @types/cors" sedan försvinner vår error.

// Sedan fortsätter vi i vår index.ts fil och lägger till cors som en middleware som måste vara vår första middleware i vår applikation och vi anropar det såhär med detta "app.use(cors());" alltså såhär ska det se ut i helhet:

// import cors from "cors";

// app.use(cors());
// app.use(express.json());
// app.use("/api/categories", categories);
// app.use("/api/foods", foods);

// Nu kan man konfigurera genom att skriva i cors objekten och om vi väljer då origin som är ett sätt att välja specifika domäner som får lov att koppla upp sig till vår backend alltså skriver vi shår:

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

// Detta kommer se till att endasst localhost:5173 som domän kan koppla upp sig till backenden men hade vi haft ingeting alltså tomt så kunde vilka domäner som helst kunna koppla till vår databas.

// Sparar vi nu i vscode och går tillbaka till vår hemsida sedan uppdaterar vi så får vi vår categories med tex Buddha's hand i vår lista alltså betyder det att allting fungerar korrekt.

// OBS! CORS används för att blockera tex DDoS attacker alltså att det skapar massa botar och robotar från utlandet för att göra massa datanarop mot ens backend för att krascha servern, vår databas och detta är väldigt allvarligt och jätte känt fenomen och syftet är för att kunna "döda" sina konkurrenter. Man gör detta för att skapa DDoS virus eller DDoS anfall.

// CORS är ett sätt att skydda sig mot just det så detta är en viktig kod att ha när man skapar en backend, databas eller webbplats.

// Commita också nu med "added cors configuration"

// Nu vill vi testa alla våra PUT, POST och DELETE genom att ändra och skapa i vår lista men vi har döljt våra knappar från tidigare uppgift så vi får fixa det om det inte fungerar så löser vi med ChatGPT.

// Vi kan också se om nånting har skapat i vår databas via vår prisma studio.

// Så det var hela backend uppgiften för både modul 16 och 17 alltså nu har vi kopplat oss till ne riktig databas med vår egen skapade backend.

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
