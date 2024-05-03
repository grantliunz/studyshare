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

    // Check if the user already exists using the firebase ID
    const existing = await User.findOne({ authId: req.body.authId });

    if (existing) {
      return res.status(201).json(existing);
    }

    const {
      authId,
      name,
      email,
      questions = [],
      answers = [],
      watchList = [],
      upvotedAnswers = [],
      downvotedAnswers = [],
      upvotedComments = [],
      downvotedComments = []
    } = req.body; // assuming request body contains user data

    // Create a new user with the data
    const newUser = new User({
      authId,
      name,
      email,
      questions,
      answers,
      watchList,
      upvotedAnswers,
      downvotedAnswers,
      upvotedComments,
      downvotedComments
    });

    // save the user to the database
    const createdUser = await newUser.save();

    res.status(201).json(createdUser); // respond with the created user
  } catch (error) {
    console.log(error);
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
          from: 'assessments',
          localField: 'question.assessment',
          foreignField: '_id',
          as: 'assessment'
        }
      },
      {
        $unwind: '$assessment'
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'assessment.course',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $lookup: {
          from: 'universities',
          localField: 'course.university',
          foreignField: '_id',
          as: 'university'
        }
      },
      {
        $unwind: '$university'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'question.author',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'question.latestContributor',
          foreignField: '_id',
          as: 'latestContributor'
        }
      },
      {
        $unwind: {
          path: '$latestContributor',
          preserveNullAndEmptyArrays: true // Preserve documents if the latestContributor field is null
        }
      },
      {
        $project: {
          questionId: '$question._id',
          questionSummary: '$question.text',
          authorName: {
            $cond: {
              if: { $eq: ['$question.latestContributor', null] }, // Check if latestContributor is null
              then: 'Anonymous',
              else: '$latestContributor.name'
            }
          },
          lastViewed: '$watchList.lastViewed',
          updatedAt: '$question.updatedAt',
          timeDifference: {
            $subtract: ['$question.updatedAt', '$watchList.lastViewed']
          },
          // Construct the URL by concatenating _id fields
          questionUrl: {
            $concat: [
              { $toString: '$university._id' },
              '/',
              { $toString: '$course._id' },
              '/',
              { $toString: '$assessment._id' }
            ]
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
      if (watchedQuestion.timeDifference < 0) {
        return;
      }
      notifications.push({
        id: String(idCounter++),
        questionID: watchedQuestion.questionId,
        commenterName: watchedQuestion.authorName,
        questionSummary: watchedQuestion.questionSummary.replace(
          /<[^>]*>?/gm,
          ''
        ), // strips html tags
        questionUrl: watchedQuestion.questionUrl,
        timedifference: watchedQuestion.timeDifference,
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
    // Get the user by its firebase ID
    let user = await User.findOne({ authId: req.params.userId });

    // If the user is not found by firebase ID, try to find by ID
    user = user ?? (await User.findOne({ _id: req.params.userId }));

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
