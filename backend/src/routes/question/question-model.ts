import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IQuestion extends Document {
  assessment: Types.ObjectId;
  number: string[];
  versions: {
    text: string;
    author: Types.ObjectId;
    createdAt: Date;
  }[];
  answers: Types.ObjectId[];
  watchers: Types.ObjectId[];
  reporters: Types.ObjectId[];
  comments: Types.ObjectId[];
  latestContributor: Types.ObjectId;
  isAnonymous: boolean;
}

const questionSchema: Schema<IQuestion> = new Schema(
  {
    assessment: {
      type: Schema.Types.ObjectId,
      required: true
    },
    number: {
      type: [String],
      required: true
    },
    versions: {
      type: [
        {
          text: {
            type: String
          },
          author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
          },
          createdAt: {
            type: Date
          }
        }
      ]
    },
    answers: {
      type: [Schema.Types.ObjectId],
      ref: 'Answer'
    },
    watchers: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    reporters: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment'
    },
    latestContributor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {}
  }
);

const Question: Model<IQuestion> = mongoose.model('Question', questionSchema);
export default Question;
