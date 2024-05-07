import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IQuestion extends Document {
  assessment: Types.ObjectId;
  number: string[];
  versions: {
    text: string;
    author: Types.ObjectId;
    createdAt: Date;
    isAnonymous: boolean;
  }[];
  answers: Types.ObjectId[];
  reporters: Types.ObjectId[];
  comments: Types.ObjectId[];
  latestContributor: Types.ObjectId;
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
            type: Date,
            default: Date.now()
          },
          isAnonymous: {
            type: Boolean,
            default: false
          }
        }
      ]
    },
    answers: {
      type: [Schema.Types.ObjectId],
      ref: 'Answer'
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
    }
  },
  {
    timestamps: {}
  }
);

const Question: Model<IQuestion> = mongoose.model('Question', questionSchema);
export default Question;
