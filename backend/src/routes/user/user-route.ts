import express from "express";
import * as User from "./user-controller";

const router = express.Router();

// Dummy route to see how it works
router.get("/hello", User.dummyTest);

export default router;
