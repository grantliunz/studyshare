import mongoose, { Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  questions: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  watchList: Schema.Types.ObjectId[];
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
    watchList: {
      type: [Schema.Types.ObjectId],
      ref: 'Question'
    },
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
