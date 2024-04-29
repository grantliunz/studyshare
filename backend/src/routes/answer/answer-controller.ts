import { Request, Response } from 'express';
import Answer from './answer-model';
import Question from '../question/question-model';
import { CreateAnswerDTO } from './answer-dto';
import { validationResult } from 'express-validator';
import Rating from '../rating/rating-model';

// Controller function to create a new answer
export const createAnswer = async (
  req: Request<{ questionId: string }, {}, CreateAnswerDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { AnswerText, AnswerImage, Author } = req.body; // assuming request body contains answer data

    // Get the question by its ID
    const question = await Question.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // create a new Rating instance
    const rating = new Rating({ Upvotes: 0, Downvotes: 0 });

    // save the rating to the database
    const createdRating = await rating.save();

    // create a new answer instance
    const answer = new Answer({
      AnswerText,
      AnswerImage,
      Author,
      Rating: createdRating._id
    });
    // save the answer to the database
    const createdAnswer = await answer.save();

    // add the answer ID to the question's answers
    question.Answers.push(createdAnswer._id);

    // save the question with the updated answers array
    await question.save();

    res.status(201).json(createdAnswer); // respond with the created answer
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};

// Controller function to get all answers
export const getAllAnswers = async (
  req: Request<{ questionId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the question by its ID
    const question = await Question.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // fetch all answers from the database
    const answers = await Answer.find({ _id: { $in: question.Answers } });

    res.status(200).json(answers); // respond with all answers
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get a single answer
export const getAnswer = async (
  req: Request<{ answerId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the answer by its ID
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.status(200).json(answer); // respond with the answer
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to update an answer
export const updateAnswer = async (
  req: Request<{ answerId: string }, {}, CreateAnswerDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { AnswerText, AnswerImage } = req.body; // assuming request body contains answer data

    // Get the answer by its ID
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // update the answer properties
    answer.AnswerText = AnswerText;
    answer.AnswerImage = AnswerImage ?? '';

    // save the updated answer
    const updatedAnswer = await answer.save();

    res.status(200).json(updatedAnswer); // respond with the updated answer
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to delete an answer
export const deleteAnswer = async (
  req: Request<{ answerId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the answer by its ID
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // delete the answer
    await Answer.deleteOne({ _id: answer._id });

    res.status(204).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
