import mongoose, { Model, Schema, Types } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  code: string;
  assessments: Types.ObjectId[];
}

const courseSchema: Schema<ICourse> = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String
    },
    assessments: {
      type: [Schema.Types.ObjectId],
      ref: 'Assessment',
      default: []
    }
  },
  {
    timestamps: {}
  }
);

const Course: Model<ICourse> = mongoose.model('Course', courseSchema);
export default Course;
