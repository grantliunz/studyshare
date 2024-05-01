import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IAnswer extends Document {
  text: string;
  rating: {
    upvotes: number;
    downvotes: number;
  };
  comments: [Types.ObjectId];
  author: Types.ObjectId;
  isAnonymous?: boolean;
}

const answerSchema: Schema<IAnswer> = new Schema(
  {
    text: {
      type: String
    },
    rating: {
      upvotes: {
        type: Number,
        required: true
      },
      downvotes: {
        type: Number,
        required: true
      }
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isAnonymous: {
      type: Boolean
    }
  },
  {
    timestamps: {}
  }
);

const Answer: Model<IAnswer> = mongoose.model('Answer', answerSchema);
export default Answer;
