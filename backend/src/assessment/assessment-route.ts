import express from "express";
import * as Assessment from "./assessment-controller";

const router = express.Router();

// Dummy route to see how it works
router.get("/hello", Assessment.dummyTest);

export default router;
