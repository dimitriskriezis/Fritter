import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import TagCollection from './collection';
import FeedCollection from '../multifeed/collection';
import * as freetUtil from '../freet/util';
import * as tagValidator from './middleware';

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
 * @name DELETE /api/tag/:tagId
 * 
 * @throws {403} - if user is not logged in
 * @throws {404} - if tagId does not exist
 * @throws {410} - if I try to delete tag of a user that doesn't exit
 */
router.delete(
    "/:tagId?",
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
        const freets = await FeedCollection.findAllFreetsByTag(req.session.userId, req.query.tagname.toString(), 0);
        const response = freets.map(freetUtil.constructFreetResponse);
        res.status(200).json(response);
    }


);

export {router as tagRouter};