import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import TagCollection from './collection';
import FeedCollection from '../multifeed/collection';
import XCollection from '../X/collection';
import * as freetUtil from '../freet/util';
import * as groupUtil from '../groups/util';
import * as tagValidator from './middleware';
import GroupCollection from '../groups/collection';

const router = express.Router();


/**
 * 
 * Add a tag to a post
 * 
 * @name POST /api/tag
 * 
 * @param freetId - the if of the freet to which I am adding a tag
 * @param tag - the tag that I am adding to the post
 * 
 * @throws {403} - if user is not logged in
 * @throws {404} - if post does not exist
 * @throws {405} - if I have already added this tag to this post
 * @throws {410} - if I try to add a tag to another users post
 * 
 */
router.post(
    "/",
    [
        userValidator.isUserLoggedIn,
        tagValidator.isFreetExists,
        tagValidator.isFreetUsers,
        tagValidator.isTagExists,
    ],
    async (req: Request, res:Response) =>{
        const tag = await TagCollection.addOneTag(req.body.freetId, req.body.tag);
        res.status(201).json({
            message: `You have succesfully added this tag`
        });
    }
);

/**
 * Delete a tag from a post
 * 
 * @name DELETE /api/tag/delete/:tagId
 * 
 * @throws {403} - if user is not logged in
 * @throws {404} - if tagId does not exist
 * @throws {410} - if I try to delete tag of a user that doesn't exit
 */
router.delete(
    "delete/:tagId?",
    [
        userValidator.isUserLoggedIn,
        tagValidator.isTagIdExists,
        tagValidator.isTagUsers
    ],
    async (req: Request, res:Response) =>{
        await TagCollection.deleteOneTagById(req.params.tagId);
        res.status(201).json({
            message: `You have succesfully removed this tag`
        });
    }
);

/**
 * Get all posts with tag
 * 
 * @name GET api/tag?tagname=tagname
 * 
 * @throws {403} - if user is not logged in
 *  
 */

router.get(
    "/",
    [
        userValidator.isUserLoggedIn
    ],
    async (req: Request, res:Response) =>{
        req.session.search = true;
        req.session.tag = req.query.tagname.toString();
        const freets = await FeedCollection.findAllFreetsByTag(req.session.userId, req.query.tagname.toString(), 0);
        const response = freets.map(freetUtil.constructFreetResponse);
        res.status(200).json(response);
    }


);

/**
 * leave the search functionality
 * 
 * @name DELTE /api/tag/search
 * 
 * @throws {403} - if user is not logged in
 * @throws {404} - if user not in search mode
 */
 router.delete(
    "/search",
    [
        userValidator.isUserLoggedIn,
        tagValidator.isUserInSearch
    ],
    async (req: Request, res:Response) =>{
        req.session.search = false;
        req.session.tag = undefined
        // if I was in a group before search return to group otherwise return to main page
        if(req.session.groupId){
            const allFreets = await FeedCollection.findAllFreetsInGroup(req.session.groupId, 0);
            const response = allFreets.map(freetUtil.constructFreetResponse);
            res.status(200).json(response);
        }else{
            const allGroups = await GroupCollection.findAllGroupsByUserId(req.session.userId);
            const response = allGroups.map(groupUtil.constructGroupResponse);
            res.status(200).json(response);
        }
    
    }


);


export {router as tagRouter};
