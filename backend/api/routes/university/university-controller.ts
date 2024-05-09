import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import University from './university-model';
import Course from '../course/course-model';
import { CreateUniversityDTO } from './university-dto';
import { getRandomClockTower } from '../../utils/clockTower';

// Controller function to create a new university
export const createUniversity = async (
  req: Request<{}, {}, CreateUniversityDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, courses } = req.body; // Assuming request body contains university data

    // Check if university with the same name already exists
    const existingUniversity = await University.findOne({ name });
    if (existingUniversity) {
      return res
        .status(400)
        .json({ error: 'University with the same name already exists' });
    }

    // Create an array to store the IDs of the courses
    const courseIds = [];
    // Iterate over the courses received in the request body
    if (courses) {
      for (const courseData of courses) {
        // Check if course already exists
        const existingCourse = await new Course(courseData).save();
        // Push the ID of the saved course into the courseIds array
        courseIds.push(existingCourse._id);
      }
    }
    const randomClockTower = getRandomClockTower();
    // Create a new university instance with the courseIds array
    const university = new University({
      name,
      image: randomClockTower,
      courses: courseIds
    });

    // Save the university to the database
    const createdUniversity = await university.save();

    return res.status(201).json(createdUniversity); // Respond with the created university
  } catch (error) {
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to get all universities
export const getAllUniversities = async (req: Request, res: Response) => {
  try {
    // Fetch all universities from the database
    const universities = await University.find();

    res.status(200).json(universities); // Respond with all universities
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to get a university by its ID
export const getUniversityById = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    // Fetch the university by its ID
    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.status(200).json(university); // Respond with the university
  } catch (error) {
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
