import { Request, Response } from 'express';
import Comment from './comment-model';
import Answer from '../answer/answer-model';
import { CreateCommentDTO } from './comment-dto';
import { validationResult } from 'express-validator';
import Question from '../question/question-model';
import { MakeVoteDTO } from '@shared/types/models/answer/answer';
import User from '../user/user-model';
import { VoteDirection } from '@shared/types/enums/VoteDirection';

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
    const {
      text,
      author,
      isAnonymous,
      rating = {
        upvotes: 0,
        downvotes: 0
      }
    } = req.body; // assuming request body contains comment data

    // Get the answer by its ID
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    const question = await Question.findById(answer.question);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    Object.assign(question, {
      __v: question.__v + 1,
      latestContributor: isAnonymous ? null : author
    });

    question.save();

    // create a new comment instance
    const comment = new Comment({
      answer: req.params.answerId,
      text,
      author,
      rating,
      isAnonymous
    });

    // save the comment to the database
    const createdComment = await comment.save();

    // add the comment ID to the answer's comments
    answer.comments.push(createdComment._id);

    // save the answer with the updated comments array
    await answer.save();

    res.status(201).json(createdComment); // respond with the created comment
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
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
      return res.status(404).json({ error: 'Answer not found' });
    }

    // fetch all comments from the database
    const comments = await Comment.find({ _id: { $in: answer.comments } });

    console.log(comments);

    res.status(200).json(comments); // respond with the fetched comments
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
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
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(comment); // respond with the fetched comment
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
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
    const { text, rating } = req.body; // assuming request body contains updated comment data

    // Get the comment by its ID
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // update the comment fields
    comment.text = text;
    comment.rating = rating;

    // save the updated comment to the database
    const updatedComment = await comment.save();

    res.status(200).json(updatedComment); // respond with the updated comment
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
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
      return res.status(404).json({ error: 'Comment not found' });
    }

    // remove the comment from the database
    await Comment.deleteOne({ _id: comment._id });

    res.status(204).json({ error: 'Comment deleted successfully' }); // respond with success error
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

export const voteComment = async (
  req: Request<{ commentId: string }, {}, MakeVoteDTO>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the comment by its ID
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const { userId, oldVoteDirection, newVoteDirection } = req.body;

    const user = await User.findById(userId);

    // get the user by ID
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // update the comment and user
    if (oldVoteDirection === VoteDirection.UP) {
      user.upvotedComments = user.upvotedComments.filter((id) => {
        if (id.equals(comment._id)) {
          comment.rating.upvotes--;
          return false;
        }
        return true;
      });
    } else if (oldVoteDirection === VoteDirection.DOWN) {
      user.downvotedComments = user.downvotedComments.filter((id) => {
        if (id.equals(comment._id)) {
          comment.rating.downvotes--;
          return false;
        }
        return true;
      });
    }
    if (newVoteDirection === VoteDirection.UP) {
      if (!user.upvotedComments.find((id) => id.equals(comment._id))) {
        user.upvotedComments.push(comment._id);
        comment.rating.upvotes++;
      }
    } else if (newVoteDirection === VoteDirection.DOWN) {
      if (!user.downvotedComments.find((id) => id.equals(comment._id))) {
        user.downvotedComments.push(comment._id);
        comment.rating.downvotes++;
      }
    }

    await user.save();
    const updatedComment = await comment.save();

    res.status(201).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
