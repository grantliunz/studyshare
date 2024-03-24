import express from "express";
import * as University from "./university-controller";

const router = express.Router();

router.get("/getAllUniversities", University.getAllUniversities);
router.post("/createUniversity", University.createUniversity);

export default router;
