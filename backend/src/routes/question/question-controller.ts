import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Assessment from '../assessment/assessment-model';
import Question from './question-model';
import { CreateQuestionDTO } from './question-dto';

// Controller function to create a new question
export const createQuestion = async (
  req: Request<{ assessmentId: string }, {}, CreateQuestionDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { QuestionNumber, Image, QuestionText, Author } = req.body; // assuming request body contains question data

    // Get the assessment by its ID
    const assessment = await Assessment.findById(req.params.assessmentId);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // create a new question instance
    const question = new Question({
      QuestionNumber,
      Image,
      QuestionText,
      Author
    });
    // save the question to the database
    const createdQuestion = await question.save();

    // add the question ID to the assessment's questions
    assessment.questions.push(createdQuestion._id);

    // save the assessment with the updated questions array
    await assessment.save();

    res.status(201).json(createdQuestion); // respond with the created question
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};

// Controller function to get all questions
export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    // Get the assessment by its ID
    const assessment = await Assessment.findById(req.params.assessmentId);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // fetch all questions from the database
    const questions = await Question.find({
      _id: { $in: assessment.questions }
    });

    res.status(200).json(questions); // respond with all questions
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get a question by its ID
export const getQuestion = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the question by its ID
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(question); // respond with the question
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to update a question
export const updateQuestion = async (
  req: Request<{ id: string }, {}, CreateQuestionDTO>,
  res: Response
) => {
  try {
    const { QuestionNumber, Image, QuestionText } = req.body; // assuming request body contains question data

    // Get the question by its ID
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // update the question with the new data
    question.QuestionNumber = QuestionNumber;
    question.Image = Image;
    question.QuestionText = QuestionText;

    // save the updated question
    const updatedQuestion = await question.save();

    res.status(200).json(updatedQuestion); // respond with the updated question
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};

// Controller function to delete a question
export const deleteQuestion = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    // delete the question by its ID
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    return res.status(200).json(deletedQuestion); // respond with the deleted question
  } catch (error) {
    return res.status(500).json({ message: `Internal server error: ${error}` });
  }
};
