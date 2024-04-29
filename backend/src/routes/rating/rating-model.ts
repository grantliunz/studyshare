import mongoose, { Model, Schema } from 'mongoose';

export interface IRating extends Document {
  upvotes: number;
  downvotes: number;
}

const ratingSchema: Schema<IRating> = new Schema(
  {
    upvotes: {
      type: Number
    },
    downvotes: {
      type: Number
    }
  },
  {
    timestamps: {}
  }
);

const Rating: Model<IRating> = mongoose.model('Rating', ratingSchema);
export default Rating;
