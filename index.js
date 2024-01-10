const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const cartRoutes = require("./routes/cart");
const coursesRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");
const ordersRoutes = require("./routes/orders");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const User = require("./models/user");
const { hasUncaughtExceptionCaptureCallback } = require("process");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("659bdd6cc62abbc1758eca5d");
    req.user = user;
    next();
  } catch (err) {
    throw new Error(err);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", homeRoutes);
app.use("/courses", coursesRoutes);
app.use("/add", addRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);

const PORT = process.env.PORT || 3500;

async function start() {
  try {
    const password = "BsbNil29Bt2RbzNd";
    const url = `mongodb+srv://kolomietzd:${password}@cluster0.cprkwoi.mongodb.net/shop`;
    await mongoose.connect(url);
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: "kolomietz@ukr.net",
        name: "Denys",
        cart: {
          items: [],
        },
      });
      await user.save();
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    throw new Error(err);
  }
}

start();
