import mongoose, { Model, Schema } from 'mongoose';

export interface IQuestion extends Document {
    QuestionNumber: string;
    Image: string[];
    Question: string;
    Answers: Schema.Types.ObjectId[];
    Watchers: Schema.Types.ObjectId[];
    Comments: Schema.Types.ObjectId[];
    Author: Schema.Types.ObjectId;
}

const questionSchema: Schema<IQuestion> = new Schema({
    QuestionNumber: {
        type: String,
        required: true
    },
    Image: {
        type: [String]
    },
    Question: {
        type: String,
        required: true
    },
    Answers: {
        type: [Schema.Types.ObjectId],
        ref: "Answer"
    },
    Watchers: {
        type: [Schema.Types.ObjectId],
        ref: "User"
    },
    Comments: {
        type: [Schema.Types.ObjectId],
        ref: "Comment"
    },
    Author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: {}
});

const Question: Model<IQuestion> = mongoose.model('Question', questionSchema);
export default Question;