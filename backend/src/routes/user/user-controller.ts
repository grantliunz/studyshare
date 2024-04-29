import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "./user-model";
import { CreateUserDTO } from "./user-dto";


// Controller function to create a new user
export const createUser = async (req: Request<{}, {}, CreateUserDTO>, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { Name, Email } = req.body; // assuming request body contains user data

    // create a new user instance
    const user = new User({ Name, Email });

    // save the user to the database
    const createdUser = await user.save();

    res.status(201).json(createdUser); // respond with the created user
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}


// Controller function to get all users
export const getAllUsers = async (req: Request<{}, {}, {}>, res: Response) => {
  try {
    // fetch all users from the database
    const users = await User.find();

    res.status(200).json(users); // respond with the users
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}


// Controller function to get a single user
export const getUser = async (req: Request<{ userId: string }, {}, {}>, res: Response) => {
  try {
    // Get the user by its ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // respond with the user
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}


// Controller function to update a user
export const updateUser = async (req: Request<{ userId: string }, {}, CreateUserDTO>, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the user by its ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user with the new data
    user.Name = req.body.Name;
    user.Email = req.body.Email;

    // save the updated user
    await user.save();

    res.status(200).json(user); // respond with the updated user
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}


// Controller function to delete a user
export const deleteUser = async (req: Request<{ userId: string }, {}, {}>, res: Response) => {
  try {
    // Get the user by its ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // delete the user from the database
    await User.findByIdAndDelete(req.params.userId);

    res.status(204).end(); // respond with no content
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}