import {Request, Response, Router} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import GroupCollection from '../groups/collection';
import FeedCollection from './collection';
import * as userValidator from '../user/middleware';
import * as groupValidator from '../groups/middleware';
import * as feedValidator from './middleware';
import * as freetUtil from '../freet/util';

const router = express.Router();


/**
 * Get the posts of mode to which I am switching
 * 
 * @name POST /api/feed
 * @params mode - the value (0 if all, 1 if text, 2 if image)
 * @throws {403} -  if user is not logged in
 * @throws {410} - if user is not in a group or in a search
 * @throws {404} - user tries to switch to invalid mode
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        feedValidator.isUserInGroupOrSearch,
        feedValidator.isSwitchingToInvalidMode
    ],
    async (req:Request, res:Response) => {
        // const groupMembers = await GroupCollection.findAllMembersByGroupId(req.session.groupId);
        // console.log(groupMembers);
        // const allFreets = []
        // for (const groupMember of groupMembers){
        //     const freets = await FreetCollection.findAllByUserIdAndMode(groupMember.groupMemberId, Number(req.query.mode))
        //     console.log(freets);
        //     allFreets.push(...freets);
        // }
        if (!req.session.search){
            console.log(req.body.mode);
            const allFreets = await FeedCollection.findAllFreetsInGroup(req.session.groupId, Number(req.body.mode));
            const response = allFreets.map(freetUtil.constructFreetResponse);
            res.status(200).json(response);
        }else{
            console.log(req.body.mode);
            const allFreets = await FeedCollection.findAllFreetsByTag(req.session.userId, req.session.tag, Number(req.body.mode));
            const response = allFreets.map(freetUtil.constructFreetResponse);
            res.status(200).json(response);
        }
    
    }
);

export {router as modeRouter};