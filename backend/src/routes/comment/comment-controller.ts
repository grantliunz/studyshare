import { Request, Response } from 'express';
import Comment from './comment-model';
import Answer from '../answer/answer-model';
import { CreateCommentDTO } from './comment-dto';
import { validationResult } from 'express-validator';
import Rating from '../rating/rating-model';

// Controller function to create a new comment
export const createComment = async (
  req: Request<{ answerId: string }, {}, CreateCommentDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { Text, PreviousComment, Author } = req.body; // assuming request body contains comment data

    // Get the answer by its ID
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // create a new Rating instance
    const rating = new Rating({ Upvotes: 0, Downvotes: 0 });

    // save the rating to the database
    const createdRating = await rating.save();

    // create a new comment instance
    const comment = new Comment({
      Text,
      PreviousComment,
      Author,
      Rating: createdRating._id
    });

    // save the comment to the database
    const createdComment = await comment.save();

    // add the comment ID to the answer's comments
    answer.Comments.push(createdComment._id);

    // save the answer with the updated comments array
    await answer.save();

    res.status(201).json(createdComment); // respond with the created comment
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};

// Controller function to get all comments
export const getAllComments = async (
  req: Request<{ answerId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the answer by its ID
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // fetch all comments from the database
    const comments = await Comment.find({ _id: { $in: answer.Comments } });

    res.status(200).json(comments); // respond with the fetched comments
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};

// Controller function to get a single comment
export const getComment = async (
  req: Request<{ commentId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the comment by its ID
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json(comment); // respond with the fetched comment
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};

// Controller function to update a comment
export const updateComment = async (
  req: Request<{ commentId: string }, {}, CreateCommentDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { Text, PreviousComment, Author } = req.body; // assuming request body contains updated comment data

    // Get the comment by its ID
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // update the comment fields
    comment.Text = Text;

    // save the updated comment to the database
    const updatedComment = await comment.save();

    res.status(200).json(updatedComment); // respond with the updated comment
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};

// Controller function to delete a comment
export const deleteComment = async (
  req: Request<{ commentId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the comment by its ID
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // remove the comment from the database
    await Comment.deleteOne({ _id: comment._id });

    res.status(204).json({ message: 'Comment deleted successfully' }); // respond with success message
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};
