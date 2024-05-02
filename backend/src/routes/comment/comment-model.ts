import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IComment extends Document {
  answer: Types.ObjectId;
  text: string;
  author: Types.ObjectId;
  rating: {
    upvotes: number;
    downvotes: number;
  };
  createdAt: Date;
}

const commentSchema: Schema<IComment> = new Schema(
  {
    answer: {
      type: Schema.Types.ObjectId,
      ref: 'Answer'
    },
    text: {
      type: String
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      upvotes: {
        type: Number
      },
      downvotes: {
        type: Number
      }
    }
  },
  {
    timestamps: {}
  }
);

const Comment: Model<IComment> = mongoose.model('Comment', commentSchema);
export default Comment;
