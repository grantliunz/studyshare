import mongoose, { Types, Schema, Model } from 'mongoose';
import { AssessmentType, SemesterType } from './assessment-enums';

export interface IAsssessment extends Document {
    AssessmentType: AssessmentType;
    Number: number;
    Year: number;
    Semester: SemesterType;
    Questions: Types.ObjectId[];
    AnswerText: string;
}

const assessmentSchema: Schema<IAsssessment> = new Schema({
    AssessmentType: {
        type: String,
        enum: Object.values(AssessmentType),
        default: AssessmentType.EXAM,
        required: true
    },
    Number: {
        type: Number,
    },
    Year: {
        type: Number,
        required: true
    },
    Semester: {
        type: String,
        enum: Object.values(SemesterType),
        default: SemesterType.FIRST,
        required: true
    },
    Questions: {
        type: [Schema.Types.ObjectId],
        ref: "Question"
    },
}, {
    timestamps: {}
});

const Assessment: Model<IAsssessment> = mongoose.model('Assessment', assessmentSchema);
export default Assessment;