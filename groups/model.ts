import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Group = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: Types.ObjectId; // user who made a group
    groupName: string; // the name of the group
    dateCreated: Date; // when the group was created
  };

const GroupSchema = new Schema<Group>({
    userId: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
    groupName: {
        // Use Types.ObjectId outside of the schema
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true
    },
});


export type DefaultGroup = {
    _id: Types.ObjectId; 
    userId: Types.ObjectId; // the id of the group
    groupId: Types.ObjectId; // a user id
    dateCreated: Date; // when a user was added to the group
}

const DefaultGroupSchema = new Schema<DefaultGroup>({
    userId: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
    groupId: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Group'
    },
    dateCreated: {
        type: Date,
        required: true
    },
});

export type GroupMember = {
    _id: Types.ObjectId; 
    groupId: Types.ObjectId; // the id of the group
    groupMemberId: Types.ObjectId; // a user id
    dateAdded: Date; // when a user was added to the group
}


const GroupMemberSchema = new Schema<GroupMember>({
    groupId: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Group'
      },
    groupMemberId: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dateAdded: {
        type: Date,
        required: true
    },
});

const GroupModel = model<Group>('Group', GroupSchema);
const GroupMemberModel = model<GroupMember>('GroupMember', GroupMemberSchema);
const DefaultGroupModel = model<DefaultGroup>('DefaultGroup', DefaultGroupSchema)

export {GroupModel, GroupMemberModel, DefaultGroupModel};