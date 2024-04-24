import mongoose, { Model, Schema } from 'mongoose';

export interface IUser extends Document {
    Name: string;
    Email?: string;
    Questions: Schema.Types.ObjectId[];
    Answers: Schema.Types.ObjectId[];
    WatchList: Schema.Types.ObjectId[];
    Rewards: Schema.Types.ObjectId[];

}
const userSchema: Schema<IUser> = new Schema({
   
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        unique: true
    },
    Questions: {
        type: [Schema.Types.ObjectId],
        ref: "Question"
    },
    Answers: {
        type: [Schema.Types.ObjectId],
        ref: "Answer"
    },
    WatchList: {
        type: [Schema.Types.ObjectId],
        ref: "Question"
    },
    Rewards: {
        type: [Schema.Types.ObjectId],
        ref: "Reward"
    }
}, {
    timestamps: {}
});

const User: Model<IUser> = mongoose.model('User', userSchema);
export default User;