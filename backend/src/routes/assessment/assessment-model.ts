import mongoose, { Types, Schema, Model } from 'mongoose';
import { AssessmentType, SemesterType } from './assessment-enums';

export interface IAssessment extends Document {
  type: AssessmentType;
  number?: number;
  year: number;
  semester: SemesterType;
  questions: Types.ObjectId[];
  course: Types.ObjectId;
}

const assessmentSchema: Schema<IAssessment> = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Course'
    },
    type: {
      type: String,
      enum: Object.values(AssessmentType),
      default: AssessmentType.EXAM,
      required: true
    },
    number: {
      type: Number
    },
    year: {
      type: Number,
      required: true
    },
    semester: {
      type: String,
      enum: Object.values(SemesterType),
      default: SemesterType.FIRST,
      required: true
    },
    questions: {
      type: [Schema.Types.ObjectId],
      ref: 'Question'
    }
  },
  {
    timestamps: {}
  }
);

const Assessment: Model<IAssessment> = mongoose.model(
  'Assessment',
  assessmentSchema
);
export default Assessment;
