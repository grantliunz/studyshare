import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IAnswer extends Document {
  answerText: string;
  answerImage: string;
  rating: Types.ObjectId;
  comments: [Types.ObjectId];
  author: Types.ObjectId;
}

const answerSchema: Schema<IAnswer> = new Schema(
  {
    answerText: {
      type: String
    },
    answerImage: {
      type: String
    },
    rating: {
      type: Schema.Types.ObjectId,
      ref: 'Rating'
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: {}
  }
);

const Answer: Model<IAnswer> = mongoose.model('Answer', answerSchema);
export default Answer;
