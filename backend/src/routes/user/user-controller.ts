import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from './user-model';
import { CreateUserDTO, UpdateUserDTO } from './user-dto';
import Question from '../question/question-model';
import mongoose from 'mongoose';
import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';
import {
  UpdateReportedAction,
  UpdateReportedDTO,
  UpdateWatchListAction,
  UpdateWatchListDTO,
  WatchListType
} from '@shared/types/models/user/user';
import Assessment from '../assessment/assessment-model';

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
      reported = [],
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
      reported,
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
          localField: 'watchList.watchedId',
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
          entityID: '$question._id',
          entitySummary: {
            $ifNull: [
              {
                $reduce: {
                  input: { $slice: ['$question.versions', -1] },
                  initialValue: '',
                  in: {
                    $cond: {
                      if: { $ne: ['$$this.text', null] },
                      then: '$$this.text',
                      else: '$$value'
                    }
                  }
                }
              },
              '$assessment.summary'
            ]
          },
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
          entityUrl: {
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
    console.log(watchedQuestions);
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
        entityID: watchedQuestion.entityID,
        commenterName: watchedQuestion.authorName,
        entitySummary: watchedQuestion.entitySummary.replace(/<[^>]*>?/gm, ''), // strips html tags
        entityUrl: watchedQuestion.entityUrl,
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

// controller to update watchlist
export const updateWatchList = async (
  req: Request<{ userId: string }, {}, UpdateWatchListDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { watchedId, action, watchType } = req.body;

    // Get the user by its ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Define the model based on the watchType
    let Model: mongoose.Model<any>;
    if (watchType === WatchListType.QUESTION) {
      Model = Question;
    } else if (watchType === WatchListType.ASSESSMENT) {
      Model = Assessment;
    } else {
      return res.status(400).json({ error: 'Invalid watchType' });
    }

    const entity = await Model.findById(watchedId);
    if (!entity) {
      return res.status(404).json({ errors: `${Model.modelName} not found` });
    }
    if (action === UpdateWatchListAction.WATCH) {
      if (!user.watchList.find((entry) => entry.watchedId.equals(watchedId))) {
        user.watchList.push({
          watchedId: entity._id,
          lastViewed: new Date(),
          watchType: watchType
        });
      }
      if (!entity.watchers.find((id: any) => id.equals(user._id))) {
        entity.watchers.push(user._id);
      }
    } else if (action === UpdateWatchListAction.UNWATCH) {
      user.watchList = user.watchList.filter((entry) => {
        return !entry.watchedId.equals(watchedId);
      });
      entity.watchers = entity.watchers.filter(
        (id: any) => !id.equals(user._id)
      );
    }

    // Save user and entity
    await user.save();
    await entity.save();

    res.status(204).end(); // respond with no content
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

export const updateReported = async (
  req: Request<{ userId: string }, {}, UpdateReportedDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { questionId, action } = req.body;

    // Get the user by its ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ errors: 'Question not found' });
    }

    if (action === UpdateReportedAction.REPORT) {
      if (!user.reported.find((entry) => entry.equals(questionId))) {
        user.reported.push(question._id);
      }
      if (!question.reporters.find((id) => id.equals(user._id))) {
        question.reporters.push(user._id);
      }
    } else if (action === UpdateReportedAction.UNREPORT) {
      user.reported = user.reported.filter((entry) => {
        return !entry.equals(questionId);
      });
      question.reporters = question.reporters.filter(
        (id) => !id.equals(user._id)
      );
    }

    // save user and question
    await user.save();
    await question.save();

    res.status(204).end(); // respond with no content
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
