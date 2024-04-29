import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IQuestion extends Document {
  number: string;
  content?: {
    text: string;
    author: Types.ObjectId;
    timestamp: string;
    answers: Types.ObjectId[];
    watchers: Types.ObjectId[];
    comments: Types.ObjectId[];
  };
  subquestions?: Types.ObjectId[];
  // QuestionNumber: string;
  // Image: string[];
  // QuestionText: string;
  // Answers: Schema.Types.ObjectId[];
  // Watchers: Schema.Types.ObjectId[];
  // Comments: Schema.Types.ObjectId[];
  // Author: Schema.Types.ObjectId;
}

const questionSchema: Schema<IQuestion> = new Schema(
  {
    number: {
      type: String,
      required: true
    },
    content: {
      text: {
        type: String
      },
      answers: {
        type: [Schema.Types.ObjectId],
        ref: 'Answer'
      },
      watchers: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
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
    subquestions: {
      type: [Schema.Types.ObjectId]
    }
  },
  {
    timestamps: {}
  }
);

const Question: Model<IQuestion> = mongoose.model('Question', questionSchema);
export default Question;
