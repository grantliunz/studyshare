import mongoose, { Model, Schema } from 'mongoose';

export interface IReward extends Document {
  name: string;
  badge: string;
}

const rewardSchema: Schema<IReward> = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    badge: {
      type: String
    }
  },
  {
    timestamps: {}
  }
);

const Reward: Model<IReward> = mongoose.model('Reward', rewardSchema);
export default Reward;
