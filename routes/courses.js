const { Router } = require("express");
const Course = require("../models/course");

const router = Router();

router.get("/", async (req, res) => {
  const courses = await Course.find();

  res.render("courses", {
    title: "Courses",
    isCourses: true,
    courses,
  });
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("course", {
    layout: "empty",
    title: `Course ${course.title}`,
    course,
  });
});

router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  const course = await Course.findById(req.params.id);
  res.render("course-edit", {
    title: `Edit ${course.title}`,
    course,
  });
});

router.post("/edit", async (req, res) => {
  const { id, ...updatedFields } = req.body;
  await Course.findOneAndUpdate({ _id: id }, updatedFields);
  res.redirect("/courses");
});

router.post("/remove", async (req, res) => {
  const { id } = req.body;
  await Course.findByIdAndDelete({ _id: id });
  res.redirect("/courses");
});

module.exports = router;
