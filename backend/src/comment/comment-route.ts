import express from "express";
import * as Comment from "./comment-controller";

const router = express.Router();

// Dummy route to see how it works
router.get("/hello", Comment.dummyTest);

export default router;
