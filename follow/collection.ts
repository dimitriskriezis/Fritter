import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';

/**
 * This file contains a class with functionality to interact with followers stored
 * in MongoDB, including adding a follower/followee pair, finding all followees of a user, and unfollowing a user. 
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
 class FollowCollection {
    /**
     * Follow user
     *
     * @param {string} username - The username of the user
     * @return {Promise<HydratedDocument<User>>} - The newly created user/followee entry
     */
    static async addOneById(userId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
      const dateadded = new Date();
  
      const follow = new FollowModel({userId, followeeId, dateadded});
      await follow.save(); // Saves user to MongoDB
      return follow;
    }

    static async findOne(user_Id: Types.ObjectId | string, userFollowed_Id: Types.ObjectId | string) {
      return FollowModel.findOne({userId: user_Id,  userFollowedId: userFollowed_Id});
    }

    /**
     * Follow user
     *
     * @param {string} username - The username of the user
     * @return {Promise<HydratedDocument<User>>} - The newly created user/followee entry
     */
     static async addOneByUsername(userId: Types.ObjectId | string, followeeName: string): Promise<HydratedDocument<Follow>> {
        const dateFollowed = new Date();
        const followee = await UserCollection.findOneByUsername(followeeName);
        const userFollowedId = followee._id;
        const follow = new FollowModel({userId, userFollowedId, dateFollowed});
        await follow.save(); // Saves user to MongoDB
        return follow;
      }
  
    /**
     * Get all the users a given user follows
     *
     * @param {string} username - The username of the user whose followers we are looking for
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the followees
     */
    static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
        const user = await UserCollection.findOneByUsername(username);
        return FollowModel.find({userId: user._id}).populate('userId');
    }
    
    /**
     * Unfollow a user
     *
     * @param {string} user_Id - The id of the user that unfollows
     * @param {string} followedUsername - The id of the user to unfollow
     * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
     */
    static async deleteOne(user_Id: Types.ObjectId | string, followedUsername: string): Promise<boolean> {
      const followerObj = await UserCollection.findOneByUsername(followedUsername);
      const follow_entry = await FollowModel.deleteOne({userId: user_Id, userFollowedId: followerObj._id});
      return follow_entry !== null;
    }
  }
  
  export default FollowCollection;
  