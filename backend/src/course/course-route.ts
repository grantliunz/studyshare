import express from "express";
import * as Course from "./course-controller";

const router = express.Router();

// Dummy route to see how it works
router.get("/hello", Course.dummyTest);

export default router;
