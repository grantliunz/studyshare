import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from './user-model';
import { CreateUserDTO } from './user-dto';

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
  req: Request<{ userId: string }, {}, CreateUserDTO>,
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

    const newDetails = { ...user, ...req.body };

    user.set(newDetails);

    const updatedUser = await user.save();

    res.status(200).json(updatedUser); // respond with the updated user
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
