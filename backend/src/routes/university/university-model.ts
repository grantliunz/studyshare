import { Document, Schema, Model, Types, model } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  image: string;
  courses: Types.ObjectId[];
}

const universitySchema: Schema<IUniversity> = new Schema<IUniversity>(
  {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course'
      }
    ]
  },
  {
    timestamps: true
  }
);

const University: Model<IUniversity> = model('University', universitySchema);

export default University;
