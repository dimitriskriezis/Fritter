import type {HydratedDocument, Types} from 'mongoose';
import type {Group, GroupMember, DefaultGroup} from './model';
import {GroupModel, GroupMemberModel, DefaultGroupModel} from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class GroupCollection {
  /**
   * Create a new default group for a new user
   */
  static async addOneDefault(userId: Types.ObjectId | string): Promise<HydratedDocument<Group>>{
    const dateCreated = new Date();
    const group = new GroupModel({userId: userId, groupName: "Default", dateCreated: dateCreated});
    const defaultgroup = new DefaultGroupModel({userId: userId, groupId: group._id, dateCreated: dateCreated})
    await defaultgroup.save()
    await group.save();
    return group;
  }

  /**
   * Find one default group
   * 
   * @param userId
   * @return the default group object
   */
  static async findOneDefaultGroup(userId: Types.ObjectId | string): Promise<HydratedDocument<DefaultGroup>>{
    return DefaultGroupModel.findOne({userId: userId});
  }


  /**
   * Add a new group
   * 
   * @param userId - the id of the user who creates the group
   * @param groupName - the name of the group that is being created
   * @return the newly created group
   * 
   */
  static async addOneGroup(userId: Types.ObjectId | string, groupName: Types.ObjectId | string) : Promise<HydratedDocument<Group>> {
    const dateCreated = new Date();
    const group = new GroupModel({userId, groupName, dateCreated});
    await group.save();
    return group;
  }

  /**
   * Add a user to a group
   * 
   * @param groupId - the id of the group to which I add a user
   * @param groupMemberId - the if of the user that I add to a group
   * @returns the newly created member group pair
   */
  static async addOneMemberById(groupId: Types.ObjectId | string, groupMemberId: Types.ObjectId | string): Promise<HydratedDocument<GroupMember>>{
    const dateAdded = new Date();
    const groupmember = new GroupMemberModel({groupId, groupMemberId, dateAdded});
    await groupmember.save();
    return groupmember;
  }

  /**
   * Remove a user from a group
   * 
   * @param groupId  - the id of the group from which I am removing a user
   * @param groupMemberId - the id of the user I am removing from the group with groupId
   * @returns - whether or not the user was removed from the group
   */
  static async deleteOneMemberById(groupId: Types.ObjectId | string, groupMemberId: Types.ObjectId | string): Promise<boolean> {
    const groupmember = await GroupMemberModel.deleteOne({groupId: groupId, groupMemberId: groupMemberId});
    return groupmember != null;
  }

  /**
   * Delete a group
   * 
   * @param groupId - the id of the group I am deleting
   * @returns - whether or not the group was deleted
   * 
   */
  static async deleteOneGroupById(groupId: Types.ObjectId | string): Promise<boolean>{
    console.log(groupId);
    const group = await GroupModel.deleteOne({_id: groupId});
    return group != null;
  }

  /**
   * Get all groups of a given user
   * 
   * @param userId
   * @returns an array of all the groups
   */
  static async findAllGroupsByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Group>>>{
    return GroupModel.find({userId: userId}).populate('userId');
  }

  /**
   * Get all members of a given group
   * @param groupId the id of the group whose members we want to find
   * @returns array of all the member of the group with groupId
   */
  static async findAllMembersByGroupId(groupId: Types.ObjectId| string): Promise<Array<HydratedDocument<GroupMember>>>{
    return GroupMemberModel.find({groupId: groupId}).populate('groupId');
  }

  /**
   * Find a group by group id
   * 
   * @param groupId the id of the group we want to find 
   * @retuns group object that corresponds to groupId
   */
  static async findOneGroupByGroupId(groupId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Group>>{
    return GroupModel.findOne({_id: groupId, userId: userId});
  }


  /**
   * Find a group member
   * 
   * @param groupId the id of the group
   * @param userId the id of the user
   * @returns the group member object corresponding to groupId and userId
   */
  static async findOneMemberById(groupId: Types.ObjectId | string , userId: Types.ObjectId | string): Promise<HydratedDocument<GroupMember>> {
    return GroupMemberModel.findOne({groupId: groupId, groupMemberId: userId});
  }

  /**
   * Delete all group members that belong to the same group
   * 
   * @param groupId  the id of the group
   */
  static async deleteAllMembersOfGroupId(groupId: Types.ObjectId | string): Promise<void>{
    await GroupMemberModel.deleteMany({groupId: groupId});
  }

  /**
   * Delete all groups of userId and delete all members of those groups
   * 
   * @param userId - the id of the user whose groups we are deleting
   */
  static async deleteAllGroupsOfUserId(userId: Types.ObjectId | string) : Promise<void>{
    const allgroups = await this.findAllGroupsByUserId(userId);
    for (const group of allgroups){
      await this.deleteAllMembersOfGroupId(group._id);
    }
    await GroupModel.deleteMany({userId: userId});
  }

  /**
   * Delete the default group of a user
   * 
   * @param userId - the id of the user whose default group we are deleting
   */
  static async deleteDefaultGroup(userId: Types.ObjectId | string) : Promise<boolean>{
    const defaultgroup = await DefaultGroupModel.deleteOne({userId: userId});
    return defaultgroup != null;
  }

}

export default GroupCollection;