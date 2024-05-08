import mongoose, { Types, Schema, Model } from 'mongoose';
import { AssessmentType, SemesterType } from './assessment-enums';

export interface IAssessment extends Document {
  type: AssessmentType;
  number?: number;
  year: number;
  semester: SemesterType;
  questions: Types.ObjectId[];
  course: Types.ObjectId;
  name?: string;
  latestContributor: Types.ObjectId;
  newestQuestion: Types.ObjectId;
}

const assessmentSchema: Schema<IAssessment> = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Course'
    },
    name: {
      type: String
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
      default: SemesterType.SEMESTER_1,
      required: true
    },
    questions: {
      type: [Schema.Types.ObjectId],
      ref: 'Question'
    },

    latestContributor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    newestQuestion: {
      type: Schema.Types.ObjectId,
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
