import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from './user-model';
import { CreateUserDTO, UpdateUserDTO } from './user-dto';
import Question from '../question/question-model';
import mongoose from 'mongoose';
import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';

// Controller function to create a new user
export const createUser = async (
  req: Request<{}, {}, CreateUserDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body; // assuming request body contains user data

    // create a new user instance
    const user = new User({ name, email });

    // save the user to the database
    const createdUser = await user.save();

    res.status(201).json(createdUser); // respond with the created user
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

// Controller function to get all users
export const getAllUsers = async (req: Request<{}, {}, {}>, res: Response) => {
  try {
    // fetch all users from the database
    const users = await User.find();

    res.status(200).json(users); // respond with the users
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

export const getNotifications = async (
  req: Request<{ userId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the user by its ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Aggregation pipeline to compare lastViewed with the last update of a question
    const watchedQuestions = await User.aggregate([
      {
        $match: {
          _id: user._id
        }
      },
      {
        $unwind: '$watchList'
      },
      {
        $lookup: {
          from: 'questions',
          localField: 'watchList.questionId',
          foreignField: '_id',
          as: 'question'
        }
      },
      {
        $unwind: '$question'
      },
      {
        $lookup: {
          from: 'users', // Name of the users collection
          localField: 'question.author', // Field in the questions collection
          foreignField: '_id', // Field in the users collection
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $project: {
          questionId: '$question._id',
          questionSummary: '$question.text',
          authorName: '$author.name', // Get the author's name
          lastViewed: '$watchList.lastViewed',
          updatedAt: '$question.updatedAt',
          timeDifference: {
            $subtract: ['$watchList.lastViewed', '$question.updatedAt']
          }
        }
      }
    ]);

    // Sort watchedQuestions array
    watchedQuestions.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );

    // Declare notifications array
    const notifications: NotificationDTO[] = [];

    // Counter variable for generating IDs
    let idCounter = 1;

    // Map through watchedQuestions and populate notifications array
    watchedQuestions.forEach((watchedQuestion: any) => {
      notifications.push({
        id: String(idCounter++),
        questionID: watchedQuestion.questionId,
        commenterName: watchedQuestion.authorName,
        questionSummary: watchedQuestion.questionSummary.replace(
          /<[^>]*>?/gm,
          ''
        ), // strips html tags
        timestamp: watchedQuestion.updatedAt
      });
    });

    return res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

// Controller function to get a single user
export const getUser = async (
  req: Request<{ userId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the user by its ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user); // respond with the user
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

// Controller function to update a user
export const updateUser = async (
  req: Request<{ userId: string }, {}, UpdateUserDTO>,
  res: Response
) => {
  try {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the user by its ID
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user with the request body
    Object.assign(user, req.body);

    // Save the updated user
    await user.save();

    res.status(200).json(user); // Respond with the updated user
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

// Controller function to delete a user
export const deleteUser = async (
  req: Request<{ userId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the user by its ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // delete the user from the database
    await User.findByIdAndDelete(req.params.userId);

    res.status(204).end(); // respond with no content
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
