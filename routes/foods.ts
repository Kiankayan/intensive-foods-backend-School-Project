import express from "express";
import { validate } from "../schema/Food";
import { PrismaClient } from "@prisma/client";

// Registrera en användare

// Vi har kopplat vår foods och categories till vår egna backend men vi kan inte skapa eller logga in en användare men det kommer vi lösa.

// Finns tre saker som ska göras:

// Första är att skapa en route för /api/users.
// Andra är att skapa zod schema för våra users.
// Tredje är att skapa en prisma modell så vi kan skapa våra users i databasen.

// Skapa först users routern i index.ts filen alltså såhär:

// import users from "./routes/users";

// app.use("/api/users", users);

// Vår "import users from "./routes/users";" är röd markerad pga vi inte har en router så in i routes mappen och skapa en ny fil med namnet "users.ts" fil.

// Sedan skapar vi denna kod i vår users.ts fil alltså såhär:

// import express from "express";

// const router = express.Router();

// router.post("/", (req, res) => {
//   return res.send("creating user");
// });

// export default router;

// Sedan fixar vi importen i index.ts filen.

// Efter går man till Postman och dubbellkollar om vi får vår "creating user" texten så ändra URL:n till "localhost:5432/api/users" med POST sen trycker Send och om vi får "creating user" texten betyder att vi har skapat en route.

// Låt oss nu skapa vår zod schema för vår users så i schemas mappen skapar vi en ny fil som heter "User.ts" där vi skriver denna kod "import { z } from "zod";

// Vår user schema finns i vår frontend projekt i filen "Register.tsx" så vi kan kopiera den sedan klistra in den i vår User.ts fil alltså såhär i helhet:

// import { z } from "zod";

// const schema = z.object({
//  name: z.string().min(1, { message: "Name is required" }),

//  username: z
//    .string()
//    .min(1, { message: "Email is required" })
//    .min(3, { message: "Invalid email." }),

//  password: z
//    .string()
//    .min(1, { message: "Password is required" })
//    .min(5, { message: "Password is too short" }),
// });

// Sedan exporterar vi en validate funktion som validerar body beroende på schema alltså såhär:

// export function validate(body: any) {
//   return schema.safeParse(body);
// }

// Låt oss byta ut vår "any" till en FormData som är samma TypeScript typ som kommer in genom våra zod schema det får vi hjälp med att skriva z.infer<FormData> alltså såhär:

// type Formdata = z.infer<typeof schema>;

// För att se hela vår User.ts fil så kan du kolla anteckningar/bilder.

// Sedan ska vi gå in i vår schema.prisma fil för att skapa en ny modell i vår databas som innehåller User alltså såhär:

// model User {
//  id String @id @default(cuid())
//  name String
//  username String
//  password String
// }

// Nu när vi gjorde en ändring i vår schema.prisma fil så måste vi in i terminalen och skriva "npx prisma migrate dev -n added_user_model" föär att skapa en migration och synka vår databas samt automatiskt generera en ny prisma client som vi sedan kan använda i våra routes för att prata med den här user modellen i databasen.

// Sedan kan vi se i vår migrations mapp att vi har nu 2 migrations mappar som är init och added_user_model.

// Nu kan vi gå tillbaka till vår users.ts fil för att lägga till några users. Vi börjar med att importera prismaclienten samt vår const prisma instans alltså såhär:

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// Sedan skapar vi vår await inom vår router.post alltså såhär:

// await prisma.user.create({
//   data: {
//     name: req.body.name,
//     username: req.body.username,
//     password: req.body.password,
//   },
// });

// Vi måste också validera genom att använda validate funktionen alltså importera den i vår users.ts fil samt validera vår req.body inne i router.post samt skicka en res.status(400) och sedan en sista grej så vi inte skapar flera users med samma username  alltså såhär i helhet:

// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import { validate } from "../schema/User";

// const prisma = new PrismaClient();
// const router = express.Router();

// router.post("/", async (req, res) => {
// const validation = validate(req.body);

//  if (!validation.success) {
//    return res.status(400).send(validation.error.issues[0]?.message);
//  }

//  const existingUser = await prisma.user.findFirst({
//    where: { username: req.body.username },
//  });

//  if (existingUser) {
//    return res.status(400).send("User already exists.");
//  }

//  const user = await prisma.user.create({
//    data: {
//     name: req.body.name,
//     username: req.body.username,
//     password: req.body.password,
//   },
//  });

//  return res.send(user);
// });

// export default router;

// Låt oss nu testa det i Postman genom att skriva ett namn, username med mejladress sedan password alltså såhär:

// {
//  "name": "Kian",
//  "username": "Kian.taklif@gmail.com",
//  "password": "12345"
// }

// Med URL:n "localhost:5432/api/users" och metod POST sen trycker på Send så ska vi få tillbaka med status 200 OK som visar att vi lyckades skapa en ny user. Trycker vi på Send en gång till så får vi text meddelande "User already exists." som visar att vi inte skapar flera users med samma username.

// Detta betyder nu att vi kan nu skapa users på vår backend. Vi kan även gå till vår frontend och testa i vår register på "http://localhost:5173/register" och skriva samma namn, mejl, lösenord som vi gjorde i postman så kommer vi få att "User already exists"

// Även om vi registrera så blir vi inte automatisk inloggade eftersom vi inte skickade tillbaka en Jason Web Token "JSW" från vår user routes alltså users.ts fil men det kommer vi kolla på lite längre fram i utbildningen.

// Men vi har ett annat viktigare problem först! Om vi går in och startar vår prisma studio alltså skriver i terminalen "npx prisma studio" så ser vi att vi har 3 styckna users men koden visas i klartext som var "12345" och detta är jätte allvarligt ifall vår databas skulle bli utsatt för ett intrång så kommer hackern kunna se lösenorden i klartext och att de flesta människorna anänvder samma lösenord överallt alltså att det innebär att hackern får tillgång till personens lösenord till många andra system tex internetbanker.

// Därför är det viktigt att man krypterar lösenorden innan man lägger in det i databasen och det kommer vi lära oss nästa lektion med lösenordskryptering.

// Men glöm inte att commita så

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
