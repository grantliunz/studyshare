import express from "express";
import * as Course from "./course-controller";

const router = express.Router();

router.post("/createCourse/:universityId", Course.createCourse);
router.get("/getAllCourses", Course.getAllCourses);
router.get("/getAllCourses/:universityId", Course.getAllCoursesInUniversity);
router.get("/getCourse/:id", Course.getCourse);
router.put("/updateCourse/:id", Course.updateCourse);
router.delete("/deleteCourse/:id", Course.deleteCourse);

export default router;
