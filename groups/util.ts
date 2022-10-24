import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Group, GroupMember} from './model';

// Update this if you add a property to the Freet type!
type GroupResponse = {
  _id: string;
  groupName: string;
};

type GroupMemberResponse = {
  _id: string;
  groupMemberId : string;
}

/**
 * Transform a raw Group object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Group>} groups - A groups object
 * @returns {GroupResponse} - The Group object
 */
 const constructGroupResponse = (group: HydratedDocument<Group>): GroupResponse => {
    const groupCopy: Group = {
      ...group.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    delete groupCopy.dateCreated;
    delete groupCopy.userId;
    return {
      ...groupCopy,
      _id: groupCopy._id.toString(),
    };
  };

/**
 * Transform a raw GroupMember object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<GroupMember>} groups - A groups object
 * @returns {GroupMemberResponse} - The Group object
 */
 const constructGroupMemberResponse = (groupmember: HydratedDocument<GroupMember>): GroupMemberResponse => {
  const groupMemberCopy: GroupMember = {
    ...groupmember.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  delete groupMemberCopy.dateAdded;
  delete groupMemberCopy.groupId;
  return {
    ...groupMemberCopy,
    _id: groupMemberCopy._id.toString(),
    groupMemberId: groupMemberCopy.groupMemberId.toString()
  };
};

  
  export {
    constructGroupResponse,
    constructGroupMemberResponse
  };
  