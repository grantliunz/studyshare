import mongoose, { Model, Schema, models } from 'mongoose';
import { WatchlistEntry } from '@shared/types/models/watchlist/WatchlistEntry';

export interface IUser extends Document {
  name: string;
  email?: string;
  questions: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  watchList: WatchlistEntry[];
  rewards: Schema.Types.ObjectId[];
}

const userSchema: Schema<IUser> = new Schema(
  {
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
    rewards: {
      type: [Schema.Types.ObjectId],
      ref: 'Reward'
    }
  },
  {
    timestamps: {}
  }
);

const User: Model<IUser> = mongoose.model('User', userSchema);
export default User;
