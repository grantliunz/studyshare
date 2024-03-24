import mongoose, { Model, Schema } from 'mongoose';

export interface IReward extends Document {
    Name: string;
    Badge: string;
}

const rewardSchema: Schema<IReward> = new Schema({

    Name: {
        type: String,
        required: true
    },
    Badge: {
        type: String,
    },
}, {
    timestamps: {}
});

const Reward: Model<IReward> = mongoose.model('Reward', rewardSchema);
export default Reward;