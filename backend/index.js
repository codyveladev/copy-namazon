require("dotenv").config();
import express from "express";
import mongoose from "mongoose";

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const users = require("./routes/users");
const storeItem = require("./routes/storeItems");
const cart = require("./routes/cart");

const app = express();
const router = express.Router();

app.use(express.json());
const PORT = 3000;

let database;
//Connect MongoDB
let initDatabase = async () => {
  let database = (mongoose.Promise = global.Promise);
  await mongoose.connect(
    `mongodb+srv://cody:Commando112@cluster0.o5xz8.mongodb.net/Namazon?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  if (database) {
    app.use(
      session({
        secret: "mySecret",
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
      })
    );
    app.use(router);
    console.log(`connected to database`);
  } else {
    console.log(`database connection failed!`);
  }
};

initDatabase();

app.get("/", (req, res) => {
  res.send("I am running!");
});

app.use("/users", users);
app.use("/storeItems", storeItem);
app.use("/cart", cart);

// /**
//  * Middleware
//  */

app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader) {
      const jwtToken = authHeader.split(" ")[1];

      const user = jwt.verify(jwtToken, accessTokenSecret);

      req.user = user;
    } else {
      res.send(401);
    }
  } catch (error) {
    res.send(404);
  }

  next();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
