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
  WatchListType,
  UserProfileDTO,
  ProfileCardDTO
} from '@shared/types/models/user/user';
import Assessment from '../assessment/assessment-model';
import { watch } from 'fs';

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
    console.error(error);
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to get all users
export const getAllUsers = async (req: Request<{}, {}, {}>, res: Response) => {
  try {
    // fetch all users from the database
    const users = await User.find();

    res.status(200).json(users); // respond with the users
  } catch (error) {
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
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

    // Aggregation pipeline to fetch watched questions
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
          authorId: '$question.latestContributor',
          authorName: {
            $cond: {
              if: { $eq: ['$question.latestContributor', null] },
              then: 'Anonymous',
              else: '$latestContributor.name'
            }
          },
          lastViewed: '$watchList.lastViewed',
          updatedAt: '$question.updatedAt',
          timestamp: '$question.updatedAt',
          timeDifference: {
            $subtract: ['$question.updatedAt', '$watchList.lastViewed']
          },
          entityType: WatchListType.QUESTION,
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

    // Aggregation pipeline to fetch watched assessments
    const watchedAssessments = await User.aggregate([
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
          from: 'assessments',
          localField: 'watchList.watchedId',
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
          localField: 'assessment.latestContributor',
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
          entityID: '$assessment._id',
          entitySummary: {
            $concat: [
              { $toString: '$assessment.semester' },
              ' ',
              '$assessment.type',
              ' ',
              { $toString: '$assessment.year' }
            ]
          },
          authorId: '$assessment.latestContributor',
          authorName: {
            $cond: {
              if: { $eq: ['$assessment.latestContributor', null] },
              then: 'Anonymous',
              else: '$latestContributor.name'
            }
          },
          lastViewed: '$watchList.lastViewed',
          updatedAt: '$assessment.updatedAt',
          timestamp: '$assessment.updatedAt',
          timeDifference: {
            $subtract: ['$assessment.updatedAt', '$watchList.lastViewed']
          },
          questionId: '$assessment.newestQuestion',
          entityType: WatchListType.ASSESSMENT,
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
    // Merge watchedQuestions and watchedAssessments into a single array
    const notifications: NotificationDTO[] = [
      ...watchedQuestions,
      ...watchedAssessments
    ];
    notifications.forEach((notification) => {
      notification.entitySummary = notification.entitySummary.replace(
        /<[^>]*>?/gm,
        ''
      );
    });
    // Sort notifications array
    notifications.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const filteredNotifications = notifications.filter(
      (notification) =>
        notification.timeDifference >= 0 &&
        !notification.authorId.equals(user._id)
    );

    // Format and send the response
    return res.status(200).json(filteredNotifications);
  } catch (error) {
    // Handle errors
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};


// Controller function to get a user's profile
export const getProfile = async (
  req: Request<{ userId: string }, {}, {}>,
  res: Response
) => {
  try {

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const regex = /(<([^>]+)>)/ig;

    const questionsAdded = await User.aggregate([
      {
        $match: {
          _id: user._id
        }
      },
      {
        $unwind: '$questions'
      },
      {
        $lookup: {
          from: 'questions',
          localField: 'questions',
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
        $project: {
          _id: '$question._id',
          number: '$question.number',
          versions: '$question.versions',
          year: {
            $concat: [
              '$course.code',
              ' / ',
              '$assessment.semester',
              ' ',
              '$assessment.type', 
              ' ',
              { $toString: '$assessment.year' }
            ]
          },
          DateCreated: '$question.createdAt',
          Path: {
            $concat: [
              '/',
              { $toString: '$course.university' },
              '/',
              { $toString: '$course._id' },
              '/',
              { $toString: '$assessment._id' }
            ]
          }
        }
      }
    ]);

    // Create an array of ProfileCardDTO Question objects
    const questionsAddedCard: ProfileCardDTO[] = questionsAdded.map((question) => {
      return {
        id: question._id,
        Title: question.number.join('.'),
        Description: question.versions[question.versions.length - 1].text.replace(regex, ''),
        Year: question.year,
        DateCreated: new Date(question.DateCreated).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        Path: question.Path
      };
    });

    const questionsAnswered = await User.aggregate([
      {
        $match: {
          _id: user._id
        }
      },
      {
        $unwind: '$answers'
      },
      {
        $lookup: {
          from: 'answers',
          localField: 'answers',
          foreignField: '_id',
          as: 'answer'
        }
      },
      {
        $unwind: '$answer'
      },
      {
        $lookup: {
          from: 'questions',
          localField: 'answer.question',
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
        $project: {
          _id : '$question._id',
          text: '$answer.text',
          question: '$question.versions',
          year: {
            $concat: [
              '$course.code',
              ' / ',
              '$assessment.semester',
              ' ',
              '$assessment.type', 
              ' ',
              { $toString: '$assessment.year' }
            ]
          },
          DateCreated: '$answer.createdAt',
          Path: {
            $concat: [
              '/',
              { $toString: '$course.university' },
              '/',
              { $toString: '$course._id' },
              '/',
              { $toString: '$assessment._id' }
            ]
          }
        }
      }
    ]);

    // Create an array of ProfileCardDTO Answer objects
    const questionsAnsweredCard: ProfileCardDTO[] = questionsAnswered.map((answer) => {
      return {
        id: answer._id,
        Title: answer.question[answer.question.length - 1].text.replace(regex, ''),
        Description: answer.text.replace(regex, ''),
        Year: answer.year,
        DateCreated: new Date(answer.DateCreated).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        Path: answer.Path
      };
    });

    const watchListed = await User.aggregate([
      {
        $match: {
          _id: user._id
        }
      },
      {
        $unwind: '$watchList'
      },
      {
        $facet: {
          questionDocs: [
            {
              $match: {
                'watchList.watchType': WatchListType.QUESTION
              }
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
              $unwind: {
                path: '$question',
                preserveNullAndEmptyArrays: true
              }
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
              $unwind: {
                path: '$assessment',
                preserveNullAndEmptyArrays: true
              }
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
              $unwind: {
                path: '$course',
                preserveNullAndEmptyArrays: true
              }
            }
          ],
          assessmentDocs: [
            {
              $match: {
                'watchList.watchType': WatchListType.ASSESSMENT
              }
            },
            {
              $lookup: {
                from: 'assessments',
                localField: 'watchList.watchedId',
                foreignField: '_id',
                as: 'assessment'
              }
            },
            {
              $unwind: {
                path: '$assessment',
                preserveNullAndEmptyArrays: true
              }
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
              $unwind: {
                path: '$course',
                preserveNullAndEmptyArrays: true
              }
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
              $unwind: {
                path: '$university',
                preserveNullAndEmptyArrays: true
              }
            }
          ]
        }
      },
      {
        $project: {
          watchListedQuestions: {
            $concatArrays: ['$questionDocs', '$assessmentDocs']
          }
        }
      },
      {
        $unwind: '$watchListedQuestions'
      },
      {
        $project: {
          _id: {
            $cond: {
              if: { $eq: ['$watchListedQuestions.watchList.watchType', WatchListType.QUESTION] },
              then: '$watchListedQuestions.question._id',
              else: '$watchListedQuestions.assessment._id'
            }
          },
          watch: '$watchListedQuestions.watchList.watchType',
          number: {
            $cond: {
              if: { $eq: ['$watchListedQuestions.watchList.watchType', WatchListType.QUESTION] },
              then: '$watchListedQuestions.question.number',
              else: null
            }
          },
          versions: {
            $cond: {
              if: { $eq: ['$watchListedQuestions.watchList.watchType', WatchListType.QUESTION] },
              then: '$watchListedQuestions.question.versions',
              else: null
            }
          },
          year: {
            $concat: [
              '$watchListedQuestions.course.code',
              ' / ',
              '$watchListedQuestions.assessment.semester',
              ' ',
              '$watchListedQuestions.assessment.type', 
              ' ',
              { $toString: '$watchListedQuestions.assessment.year' }
            ]
          },
          DateCreated: {
            $cond: {
              if: { $eq: ['$watchListedQuestions.watchList.watchType', WatchListType.QUESTION] },
              then: '$watchListedQuestions.question.createdAt',
              else: '$watchListedQuestions.assessment.createdAt'
            }
          },
          Path: {
            $concat: [
              '/',
              { $toString: '$watchListedQuestions.course.university' },
              '/',
              { $toString: '$watchListedQuestions.course._id' },
              '/',
              { $toString: '$watchListedQuestions.assessment._id' }
            ]
          }
        }
      }
    ]);
    
    // Create 2 arrays for watchlisted questions and assessments
    const watchListedQuestions: ProfileCardDTO[] = [];
    const watchListedAssessments: ProfileCardDTO[] = [];

    watchListed.forEach((doc) => {
      if (doc.watch === WatchListType.QUESTION) {
        watchListedQuestions.push({
          id: doc._id.toString(),
          Title: doc.number.join('.'),
          Description: doc.versions[doc.versions.length - 1].text.replace(regex, ''),
          Year: doc.year,
          DateCreated: new Date(doc.DateCreated).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          Path: doc.Path
        });
      } else {
        watchListedAssessments.push({
          id: doc._id.toString(),
          Title: doc.year,
          Description: new Date(doc.DateCreated).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          Year: '',
          DateCreated: '',
          Path: doc.Path
        });
      }
    });

    // Create a UserProfileDTO object
    const profile: UserProfileDTO = {
      watchListedQuestions,
      addedQuestions: questionsAddedCard,
      answeredQuestions: questionsAnsweredCard,
      watchListedAssessments
    };
    res.status(200).json(profile);

  } catch (error) {
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}



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
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
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
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
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
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
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
    } else if (action === UpdateWatchListAction.UNWATCH) {
      user.watchList = user.watchList.filter((entry) => {
        return !entry.watchedId.equals(watchedId);
      });
    }

    // Save user
    await user.save();

    res.status(204).end(); // respond with no content
  } catch (error) {
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
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
    if (error instanceof Error && error.name == 'CastError') {
      res.status(404).json({ error: 'Invalid ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};
