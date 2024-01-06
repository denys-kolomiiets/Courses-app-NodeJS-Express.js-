const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const cardRoutes = require("./routes/card");
const coursesRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", homeRoutes);
app.use("/courses", coursesRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);

const PORT = process.env.PORT || 3500;

async function start() {
  try {
    const password = "BsbNil29Bt2RbzNd";
    const url = `mongodb+srv://kolomietzd:${password}@cluster0.cprkwoi.mongodb.net/shop`;
    await mongoose.connect(url);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    throw new Error(err);
  }
}

start();
