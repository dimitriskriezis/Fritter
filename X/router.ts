import {NextFunction, Request, Response, Router} from 'express';
import express from 'express';
import FeedCollection from '../multifeed/collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as tagValidator from '../tagged-search/middleware';
import * as XValidator from '../X/middleware';
import * as freetUtil from '../freet/util';

import XCollection from './collection';
import FreetCollection from '../freet/collection';


const router = express.Router();

/**
 * Add an X to a post
 * 
 * @name POST /api/X
 * 
 * @param freetId - the id of the freet to which I am adding an X
 * @throws {403} - if user is not logged in 
 * @throws {404} - if freetId does not exist
 * @throws {405} - if user not in search mode
 * @throws {406} - if user tries to X post not in his feed
 */

router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        tagValidator.isUserInSearch,
        XValidator.isFreetAlreadyXed,
        XValidator.isXedFreetInSearch
    ],
    async(req:Request, res: Response) => {
        // add an X
        // count number of X of post if greater than 10 add a strike to a user
        // when I add a strike at the user if greater than 2 flag him// add flag filter to X
        const addX = await XCollection.addOne(req.body.freetId, req.session.userId);
        const allX = await XCollection.findAllByFreetId(req.body.freetId);
        if (allX.length > 0){
            const freetPoster = await FreetCollection.findOne(req.body.freetId);
            const user = await UserCollection.addOneStrike(freetPoster.authorId);
        }
        const allFreets = await FeedCollection.findAllFreetsByTag(req.session.userId, req.session.tag, Number(req.body.mode));
            const response = allFreets.map(freetUtil.constructFreetResponse);
            res.status(200).json(response);
    }
)


export {router as XRouter};
