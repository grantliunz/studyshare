import express from 'express';
import * as Assessment from './assessment-controller';

const router = express.Router();

router.post('/:courseId', Assessment.createAssessment);
router.get('/', Assessment.getAllAssessments);
router.get(
  '/getAllAssessments/:courseId',
  Assessment.getAllAssessmentsInCourse
);
router.get('/:id', Assessment.getAssessment);
router.put('/:id', Assessment.updateAssessment);
router.delete('/:id', Assessment.deleteAssessment);

export default router;
