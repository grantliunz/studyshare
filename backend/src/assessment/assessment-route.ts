import express from "express";
import * as Assessment from "./assessment-controller";

const router = express.Router();

router.post("/createAssessment/:courseId", Assessment.createAssessment);
router.get("/getAllAssessments", Assessment.getAllAssessments);
router.get("/getAllAssessments/:courseId", Assessment.getAllAssessmentsInCourse);
router.get("/getAssessment/:id", Assessment.getAssessment);
router.put("/updateAssessment/:id", Assessment.updateAssessment);
router.delete("/deleteAssessment/:id", Assessment.deleteAssessment);



export default router;
