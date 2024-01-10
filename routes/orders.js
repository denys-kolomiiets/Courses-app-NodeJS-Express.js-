const { Router } = require("express");
const Order = require("../models/order");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({
      "user.userId": req.user._id,
    }).populate("user.userId");

    res.render("orders", {
      isOrders: true,
      title: "Orders",
      orders: orders.map((order) => ({
        ...order._doc,
        price: order.courses.reduce((total, c) => {
          return (total += c.count * c.course.price);
        }, 0),
      })),
    });
  } catch (err) {
    throw new Error(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.courseId");

    const courses = user.cart.items.map((item) => ({
      count: item.count,
      course: { ...item.courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses: courses,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;
