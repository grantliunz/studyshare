import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CourseDTO } from './course-dto';
import Course from './course-model';
import University from '../university/university-model';
import { isValidObjectId } from 'mongoose';

// controller function to create a new course
export const createCourse = async (
  req: Request<{ universityId: string }, {}, CourseDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, code } = req.body; // assuming request body contains course data

    // Remove spaces from course code and convert to uppercase
    const courseCode = code?.replace(/\s/g, '').toUpperCase();
    if (courseCode!.trim().length > 30) {
      return res
        .status(404)
        .json({ error: 'Course code must be less than 30 characters.' });
    }

    // Get the university by its ID
    const university = await University.findById(req.params.universityId);
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }
    // check if course with the same name already exists
    const existingCourse = await Course.findOne({
      code: courseCode,
      university: req.params.universityId
    });
    if (existingCourse) {
      return res.status(400).json({
        error: 'Course with the same code already exists in this university'
      });
    }

    // create a new course instance and add code and assessments if available
    const course = new Course({
      name,
      code: courseCode,
      university: req.params.universityId
    });

    // save the course to the database
    const createdCourse = await course.save();

    // add the course ID to the university's courses array
    university.courses.push(createdCourse._id);

    // save the university with the updated courses array
    await university.save();

    res.status(201).json(createdCourse); // respond with the created course
  } catch (error) {
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

// controller function to get all courses in a university
export const getAllCoursesInUniversity = async (
  req: Request,
  res: Response
) => {
  try {
    // Validate universityId
    if (!isValidObjectId(req.params.universityId)) {
      return res.status(404).json({ error: 'University not Found' });
    }
    // get the university by its ID
    const university = await University.findById(req.params.universityId);
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    // fetch all courses in the university
    const courses = await Course.find({ _id: { $in: university.courses } });
    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ error: 'No courses found in this university' });
    }
    res.status(200).json(courses); // respond with all courses in the university
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controller function to get a course by its ID
export const getCourse = async (req: Request, res: Response) => {
  try {
    // fetch the course by its ID from the database
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(course); // respond with the course
  } catch (error) {
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controller function to update a course by its ID
export const updateCourse = async (
  req: Request<{ id: string }, {}, CourseDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, code } = req.body; // assuming request body contains course data

    // find the course by its ID and update it
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { name, code },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(updatedCourse); // respond with the updated course
  } catch (error) {
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

// controller function to delete a course by its ID
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    // delete the course by its ID
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.status(200).json(deletedCourse); // respond with the deleted course
  } catch (error) {
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};
