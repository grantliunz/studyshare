import express from "express";
import * as Rating from "./rating-controller";

const router = express.Router();

// Dummy route to see how it works
router.get("/hello", Rating.dummyTest);

export default router;
