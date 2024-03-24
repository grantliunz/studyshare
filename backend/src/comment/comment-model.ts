import mongoose, { Model, Schema } from 'mongoose';

export interface IComment extends Document {
    Text: string;
    PreviousComment: Schema.Types.ObjectId;
    Author: Schema.Types.ObjectId;
    Rating: Schema.Types.ObjectId;
}


const commentSchema: Schema<IComment> = new Schema({
    Text: {
        type: String,
    },
    PreviousComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    Author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    Rating: {
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }
}, {
    timestamps: {}
});

const Comment: Model<IComment> = mongoose.model('Comment', commentSchema);
export default Comment;