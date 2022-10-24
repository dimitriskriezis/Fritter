import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Tag = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    freetId: Types.ObjectId; // user who made a group
    tag: string; // the name of the group
    dateAdded: Date;
};

const TagSchema = new Schema<Tag>({
    freetId: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Freet'
      },
    tag: {
        // Use Types.ObjectId outside of the schema
        type: String,
        required: true,
    },
    dateAdded: {
        type: Date,
        required: true
    },
});

const TagModel = model<Tag>('Tag', TagSchema);
export default TagModel;
