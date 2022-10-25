import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import GroupCollection from './collection';
import * as userValidator from '../user/middleware';
import * as groupValidator from './middleware';
import * as util from './util';
import { GroupMemberModel } from './model';
import FeedCollection from '../multifeed/collection';
import * as freetUtil from '../freet/util';

const router = express.Router();

/**
 * Create a group
 * 
 * @name POST /api/groups/create
 * 
 * @param group_name - the name of the group
 * @throws {400} - if user is not logged in
 * @throws {403} - if user is not logged in
 */
router.post(
    '/create',
    [
        userValidator.isUserLoggedIn
    ],
    async(req: Request, res: Response) => {
        const group = await GroupCollection.addOneGroup(req.session.userId, req.body.group_name);
        const allGroups = await GroupCollection.findAllGroupsByUserId(req.session.userId);
        const response = allGroups.map(util.constructGroupResponse);
        res.status(201).json(response);
    }
);

/**
 * Add a user to a group
 * 
 * @name POST /api/groups/add
 * 
 * @param {string} userId - the id of the user I am adding to a group
 * @throws {403} - if user is not logged in
 * @throws {404} - if group cannot be found or user cannot be found
 * @throws {406} - if user already in group
 * @throws {405} - if current logged in user is not in a group
 * @throws {412} - if user tries to add himself to a group
 * 
 */
router.post(
    "/add",
    [
        userValidator.isUserLoggedIn,
        groupValidator.isUserInGroup,
        groupValidator.isGroupMemberExists,
        groupValidator.isUserAddsHimself,
    ],
    async(req:Request, res: Response) => {
        const defaultGroup = await GroupCollection.findOneDefaultGroup(req.session.userId);
        const follow = await GroupCollection.findOneMemberById(defaultGroup.groupId, req.body.userId);
        // const follow = await FollowCollection.findOne(req.session.userId, req.body.userId);
        if(!follow && defaultGroup.groupId.toString() !== req.session.groupId){
            // await FollowCollection.addOneById(req.session.userId, req.body.userId);
            await GroupCollection.addOneMemberById(defaultGroup.groupId, req.body.userId);
        }
        const user = await GroupCollection.addOneMemberById(req.session.groupId, req.body.userId);
        const allFreets = await FeedCollection.findAllFreetsInGroup(req.session.groupId, 0);
        const response = allFreets.map(freetUtil.constructFreetResponse);
        res.status(201).json(response);
    }
);

/**
 * @name DELETE /api/groups/remove?groupId=grouId&userId=userId
 * 
 * @param {string} groupId - the id of the group from which I am removing a user
 * @param {string} username - the username of the user I am removing from the group
 * 
 * @throws {403} - if the user is not logged in
 * @throws {404} - if group with groupId doesn't exist or user with username doesn't exist
 * @throws {406} - if the user with username is not in group with groupId
 */
router.delete(
    '/remove',
    [
        userValidator.isUserLoggedIn,
        groupValidator.isGroupMemberExistsDelete
    ],
    async(req:Request, res:Response) => {
        const defaultgroup = await GroupCollection.findOneDefaultGroup(req.session.userId);
        console.log("why are you not equal");
        console.log(req.query.groupId);
        console.log(defaultgroup.groupId.toString())
        if(req.query.groupId == defaultgroup.groupId.toString()){
            console.log("here");
            const allgroups = await GroupCollection.findAllGroupsByUserId(req.session.userId);
            console.log(allgroups);
            for (const group of allgroups){
                await GroupCollection.deleteOneMemberById(group._id, req.query.userId.toString());
            }
        }else{
        const groupmember = await GroupCollection.deleteOneMemberById(req.query.groupId.toString(), req.query.userId.toString()); 
        }
        res.status(201).json({
            message: `You have successfully delete the member from the group`
        });
    }
);

/**
 * 
 * Delete group with groupId groupId
 * 
 * @name DELETE /api/groups/:groupId
 * 
 * @param {string} groupId - The id of the group to be deleted
 * @throws {403} - if user is not logged in
 * @throws {404} - if group with groupId does not exist
 * @throws {412} - if group trying to delete is the default
 * 
 */
router.delete(
    '/delete/:groupId?',
    [
        userValidator.isUserLoggedIn,
        groupValidator.isGroupExists,
        groupValidator.isDefaultGroup
    ],
    async(req:Request, res:Response) => {
        const group = await GroupCollection.deleteOneGroupById(req.params.groupId);
        await GroupCollection.deleteAllMembersOfGroupId(req.params.groupId);
        // un-assign session
        res.status(201).json({
            message: `You have successfully deleted this group`
        });
    }
);


/**
 * Enter a group
 * 
 * @name POST /api/groups/session
 * 
 * @param groupId the id of the group I am entering
 * @throws {403} - if user is not logged in
 * @throws {404} - if groupId does not exist
 */
router.post(
    "/session",
    [
        userValidator.isUserLoggedIn,
        groupValidator.isGroupExistsSession
    ],
    async(req: Request, res: Response) => {
        req.session.groupId = req.body.groupId;
        req.session.search = false;
        req.session.tag = undefined;
        console.log(req.body.groupId);
        const allFreets = await FeedCollection.findAllFreetsInGroup(req.session.groupId, 0);
        const response = allFreets.map(freetUtil.constructFreetResponse);
        res.status(200).json(response);
    }
);

/**
 * Leave a group
 * 
 * @name DELETE /api/groups/session
 * 
 * @throws {403} - if user is not logged in
 * @throws {405} - if user not in a group
 */
 router.delete(
    "/session",
    [
        userValidator.isUserLoggedIn,
        groupValidator.isUserInGroup
    ],
    async(req: Request, res: Response) => {
        req.session.groupId = undefined;
        const allGroups = await GroupCollection.findAllGroupsByUserId(req.session.userId);
        const response = allGroups.map(util.constructGroupResponse);
        res.status(201).json(response);
    }
);


export {router as groupsRouter};