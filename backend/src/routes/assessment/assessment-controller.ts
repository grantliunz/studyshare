import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateAssessmentDTO } from './assessment-dto';
import Assessment from './assessment-model';
import Course from '../course/course-model';

// Controller function to create a new assessment
export const createAssessment = async (
  req: Request<{ courseId: string }, {}, CreateAssessmentDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      type,
      year,
      semester,
      questions = [],
      name,
      number,
      latestContributor,
      newestQuestion = null
    } = req.body; // assuming request body contains assessment data

    // Get the course by its ID
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // check if assessment with the same type, year, and semester already exists
    const existingAssessment = await Assessment.findOne({
      type,
      year,
      semester,
      course: req.params.courseId,
      name,
      number
    });

    if (existingAssessment) {
      return res.status(400).json({
        error: 'Assessment with the same name already exists in this course'
      });
    }

    // create a new assessment instance
    const assessment = new Assessment({
      course: req.params.courseId,
      type,
      year,
      semester,
      questions,
      name,
      number,
      latestContributor,
      newestQuestion
    });

    // save the assessment to the database
    const createdAssessment = await assessment.save();

    // add the assessment ID to the course's assessments
    course.assessments.push(createdAssessment._id);

    // save the course with the updated assessments array
    await course.save();

    res.status(201).json(createdAssessment); // respond with the created assessment
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

export const getAllAssessments = async (req: Request, res: Response) => {
  try {
    // fetch all assessments from the database
    const assessments = await Assessment.find();

    res.status(200).json(assessments); // respond with all assessments
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllAssessmentsInCourse = async (
  req: Request<{ courseId: string }, {}, {}>,
  res: Response
) => {
  try {
    // fetch all assessments from the database
    const assessments = await Assessment.find({ course: req.params.courseId });

    res.status(200).json(assessments); // respond with all assessments
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAssessment = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    // fetch the assessment by its ID
    const assessment = await Assessment.findById(req.params.id).populate({
      path: 'questions'
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.status(200).json(assessment); // respond with the assessment
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAssessment = async (
  req: Request<{ id: string }, {}, CreateAssessmentDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // fetch the assessment by its ID
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const { type, year, semester, userId } = req.body;

    // update the assessment with the new data
    assessment.type = type;
    assessment.year = year;
    assessment.semester = semester;
    assessment.latestContributor = userId;
    // come back to this

    if (req.body.number) {
      assessment.number = req.body.number;
    }

    // save the updated assessment
    const updatedAssessment = await assessment.save();

    res.status(200).json(updatedAssessment); // respond with the updated assessment
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

export const deleteAssessment = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    // delete the assessment by its ID
    const deletedAssessment = await Assessment.findByIdAndDelete(req.params.id);

    if (!deletedAssessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.status(200).json(deletedAssessment); // respond with the deleted assessment
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
