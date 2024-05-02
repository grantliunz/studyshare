import mongoose, { Model, Schema, Types, models } from 'mongoose';
import { WatchlistEntry } from '@shared/types/models/watchlist/WatchlistEntry';

export interface IUser extends Document {
  authId: string;
  name: string;
  email: string;
  questions: Types.ObjectId[];
  answers: Types.ObjectId[];
  watchList: WatchlistEntry[];
  upvotedAnswers: Types.ObjectId[];
  downvotedAnswers: Types.ObjectId[];
  upvotedComments: Types.ObjectId[];
  downvotedComments: Types.ObjectId[];
}

const userSchema: Schema<IUser> = new Schema(
  {
    authId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true
    },
    questions: {
      type: [Schema.Types.ObjectId],
      ref: 'Question'
    },
    answers: {
      type: [Schema.Types.ObjectId],
      ref: 'Answer'
    },
    watchList: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: 'Question'
        },
        lastViewed: {
          type: Date,
          default: Date.now
        }
      }
    ],
    upvotedAnswers: {
      type: [Schema.Types.ObjectId],
      ref: 'Answer'
    },
    downvotedAnswers: {
      type: [Schema.Types.ObjectId],
      ref: 'Answer'
    },
    upvotedComments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment'
    },
    downvotedComments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment'
    }
  },
  {
    timestamps: {}
  }
);

const User: Model<IUser> = mongoose.model('User', userSchema);
export default User;
