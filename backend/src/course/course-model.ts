import mongoose, { Model, Schema, Types } from 'mongoose';

export interface ICourse extends Document {
    Name: string;
    Code: string;
    Assessments: Types.ObjectId[];
}


const courseSchema: Schema<ICourse> = new Schema({
    Name: {
        type: String,
        required: true
    },
    Code: {
        type: String,
    },
    Assessments: {
        type: [Schema.Types.ObjectId],
        ref: 'Assessment',
        default: []
    },
}, {
    timestamps: {}
});

const Course: Model<ICourse> = mongoose.model('Course', courseSchema);
export default Course;