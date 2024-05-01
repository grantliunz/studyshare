import { Request, Response } from 'express';
import Rating from './rating-model';
import Answer from '../answer/answer-model';
import Comment from '../comment/comment-model';
import { CreateRatingDTO } from './rating-dto';
import { validationResult } from 'express-validator';

// Controller function to get rating of Answer
export const getRatingByAnswer = async (
  req: Request<{ answerId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the answer by its ID
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // fetch the rating of the answer
    const rating = await Rating.findById(answer.rating);

    res.status(200).json(rating); // respond with the rating
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to get rating of Comment
export const getRatingByComment = async (
  req: Request<{ commentId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the comment by its ID
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // fetch the rating of the comment
    const rating = await Rating.findById(comment.rating);

    res.status(200).json(rating); // respond with the rating
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to get a single rating
export const getRating = async (
  req: Request<{ ratingId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the rating by its ID
    const rating = await Rating.findById(req.params.ratingId);

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    res.status(200).json(rating); // respond with the rating
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to update a rating
export const updateRating = async (
  req: Request<{ ratingId: string }, {}, CreateRatingDTO>,
  res: Response
) => {
  try {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the rating by its ID
    const rating = await Rating.findById(req.params.ratingId);

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    // Update the rating
    rating.upvotes = req.body.upvotes !== undefined ? req.body.upvotes : 0;
    rating.downvotes =
      req.body.downvotes !== undefined ? req.body.downvotes : 0;

    // Save the updated rating to the database
    const updatedRating = await rating.save();

    res.status(200).json(updatedRating); // respond with the updated rating
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to delete a rating
export const deleteRating = async (
  req: Request<{ ratingId: string }, {}, {}>,
  res: Response
) => {
  try {
    // Get the rating by its ID
    const rating = await Rating.findById(req.params.ratingId);

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    // Delete the rating
    await rating.deleteOne({ _id: rating._id });

    res.status(200).json({ error: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
