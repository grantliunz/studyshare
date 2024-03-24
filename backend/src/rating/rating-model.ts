import mongoose, { Model, Schema } from 'mongoose';

export interface IRating extends Document {
    Upvotes: number;
    Downvotes: number;
}

const ratingSchema: Schema<IRating> = new Schema({
    Upvotes: {
        type: Number,
    },
    Downvotes: {
        type: Number,
    },
}, {
    timestamps: {}
});

const Rating: Model<IRating> = mongoose.model('Rating', ratingSchema);
export default Rating;