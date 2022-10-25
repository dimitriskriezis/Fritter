import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FeedCollection from '../multifeed/collection';
import FreetCollection from '../freet/collection';
import TagCollection from '../tagged-search/collection';
import XCollection from './collection';

const isFreetAlreadyXed = async(req: Request, res: Response, next: NextFunction) => {
    if(!req.body.freetId){
        res.status(404).json({
            message: "Cannot X a non-existent freet"
        });
        return;
    }

    const validFromat = Types.ObjectId.isValid(req.body.freetId);
    const X = await XCollection.findOne(req.body.freetId, req.session.userId);
    if(X){
        res.status(404).json({
            message: "You have already x-ed this post"
        });
        return;
    }

    next();
}

const isXedFreetInSearch = async(req: Request, res: Response, next: NextFunction) => {
    const allFreets = await FeedCollection.findAllFreetsByTag(req.session.userId, req.session.tag, 0);
    const allFreetIds = new Set();
    for (const freet of allFreets){
        allFreetIds.add(freet._id.toString());
    }
    console.log(allFreetIds);
    console.log(req.body.freetId);
    if (!allFreetIds.has(req.body.freetId)){
        res.status(406).json({
            message: "Post you X must be in your search feed"
        });
        return;
    }
    next();
}

export {isFreetAlreadyXed, isXedFreetInSearch};