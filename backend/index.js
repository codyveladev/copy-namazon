import express from "express";
import mongoose from "mongoose";

const cors = require("cors");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const jwt = require("jsonwebtoken");
const accessTokenSecret = "secretToken";

const users = require("./routes/users");
const storeItem = require("./routes/storeItems");
const cart = require("./routes/cart");

const app = express();
const router = express.Router();

const userData =  require("./models/userModel");
const cartData = require("./models/cartModel");

app.use(express.json());
app.use(cors())
const PORT = 8080;

const { body, validationResult } = require("express-validator");

const userValidators = [
  body("firstName").isAlpha(),
  body("lastName").isAlpha(),
  body("email").isEmail(),
];

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


/**
 * @route POST routes/users/register
 * @desc register a new user
 */
app.post("/register", userValidators, async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const cart = await cartData.create({ cartItems: [] });
  const userInfo = req.body;
  userInfo.cart = cart;
  const user = await userData.create(userInfo);

  res.send(user);
});



//////////////
// new JWT Route(s)
app.post("/login", async (req, res) => {
  console.log('being called ...')
  try {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    const user = await userData.findOne({ email, password });

    if (user) {
      //User was found, create a token!
      const accessToken = jwt.sign({ user }, accessTokenSecret);
      res.send({ accessToken, user });
    } else {
      res.send(403);
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
});



///////////////
// app middleware to check for jwt
app.use(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      //Bearer eyJhbGci...
      const jwtToken = authHeader.split(" ")[1];
      const user = jwt.verify(jwtToken, accessTokenSecret);
      req.userJwt = user;
    } else {
      console.log(`hit here`)
      return res.send(401);
    }
  } catch (err) {
    res.send(403);
  }
  next();
});

initDatabase().then( () => {
  app.use("/users", users);
  app.use("/storeItems", storeItem);
  app.use("/cart", cart);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})



