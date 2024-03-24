import { Document, Schema, Model, Types, model } from 'mongoose';

export interface IUniversity extends Document {
    Name: string;
    Image: string;
    Courses: Types.ObjectId[]; 
}

const universitySchema: Schema<IUniversity> = new Schema<IUniversity>({
    Name: {
        type: String,
        required: true
    },
    Image: {
        type: String
    },
    Courses: [{
        type: Schema.Types.ObjectId,
        ref: "Course"
    }]
}, {
    timestamps: {}
});

const University: Model<IUniversity> = model('University', universitySchema); 

export default University;
