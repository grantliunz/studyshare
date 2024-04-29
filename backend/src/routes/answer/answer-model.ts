import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IAnswer extends Document {
    AnswerText: string;
    AnswerImage: string;
    Rating: Types.ObjectId;
    Comments: [Types.ObjectId];
    Author: Types.ObjectId;
}

const answerSchema: Schema<IAnswer> = new Schema({
    AnswerText: {
        type: String,
    },
    AnswerImage: {
        type: String,
    },
    Rating: {
        type: Schema.Types.ObjectId,
        ref: "Rating",
    },
    Comments: {
        type: [Schema.Types.ObjectId],
        ref: "Comment",
    },
    Author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: {}
});

const Answer: Model<IAnswer> = mongoose.model('Answer', answerSchema);
export default Answer;