import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IComment extends Document {
  text: string;
  previousComment: Types.ObjectId;
  author: Types.ObjectId;
  rating: Types.ObjectId;
}

const commentSchema: Schema<IComment> = new Schema(
  {
    text: {
      type: String
    },
    previousComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Schema.Types.ObjectId,
      ref: 'Rating'
    }
  },
  {
    timestamps: {}
  }
);

const Comment: Model<IComment> = mongoose.model('Comment', commentSchema);
export default Comment;
