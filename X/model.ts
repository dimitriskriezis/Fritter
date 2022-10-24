import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type X = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    freetId: Types.ObjectId; // user who made a group
    userThatXed: Types.ObjectId;
    dateXed: Date;
};

const XSchema = new Schema<X>({
    freetId: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Freet'
      },
      userThatXed: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
    dateXed: {
        type: Date,
        required: true
    },
});

const XModel = model<X>('X', XSchema);
export default XModel;
