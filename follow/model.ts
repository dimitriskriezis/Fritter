import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Follow = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: Types.ObjectId;
    userFollowedId: Types.ObjectId;
    dateFollowed: Date;
  };


const FollowSchema = new Schema<Follow>({
    userId: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
    userFollowedId: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dateFollowed: {
        type: Date,
        required: true
    },
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;