const { Router } = require("express");
const Course = require("../models/course");

const router = Router();

function mapCartItems(cart) {
  return cart.items.map((course) => ({
    ...course.courseId._doc,
    count: course.count,
  }));
}

function computePrice(courses) {
  return courses.reduce((total, course) => {
    return (total += course.price * course.count);
  }, 0);
}
router.post("/add", async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect("/cart");
});

router.get("/", async (req, res) => {
  const user = await req.user.populate("cart.items.courseId");

  const courses = mapCartItems(user.cart);
  res.render("cart", {
    title: "Cart",
    isCard: true,
    courses: courses,
    price: computePrice(courses),
  });
});

router.delete("/remove/:id", async (req, res) => {
  const card = await Card.remove(req.params.id);
  res.status(200).json(card);
});

module.exports = router;
