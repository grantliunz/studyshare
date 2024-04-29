import mongoose, { Model, Schema, Types } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  code: string;
  university: Types.ObjectId;
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
    university: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'University'
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
