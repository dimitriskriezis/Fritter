import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import TagCollection from './collection';

const isFreetExists =  async(req: Request, res: Response, next: NextFunction) => {
    if (!req.body.freetId){
        res.status(404).json({
            message: "No id specified"
        });
        return;
    }

    const validFormat = Types.ObjectId.isValid(req.body.freetId);
    const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
    if(!freet){
        res.status(404).json({
            message: "No freet with freetId exists" 
        });
        return;
    }
    next();
}


const isFreetUsers =  async(req: Request, res: Response, next: NextFunction) => {
    const freetUser = await FreetCollection.findOne(req.body.freetId);
    console.log(freetUser.authorId._id.toString());
    console.log(req.session.userId);
    const isSameUser = freetUser.authorId._id.toString() === req.session.userId
    if(!isSameUser){
        res.status(410).json({
            message: "Cannot add a tag to another Users post"
        });
        return;
    }
    next();
}

const isTagExists =  async(req: Request, res: Response, next: NextFunction) => {
    if (!req.body.freetId){
        res.status(404).json({
            message: "No id specified"
        });
        return;
    }
    if (!req.body.tag){
        res.status(404).json({
            message: "No tag specified"
        });
        return;
    }

    const tagentry = await TagCollection.findOne(req.body.freetId, req.body.tag);
    if (tagentry){
        res.status(405).json({
            message: "Already added this tag"
        });
        return;
    }
    next();
}

const isTagIdExists = async(req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    if(!req.params.tagId){
        res.status(404).json({
            message: "No id specified"
        });
        return;
    }
    const validFormat = Types.ObjectId.isValid(req.params.tagId);
    const tag = validFormat ? await TagCollection.findOneById(req.params.tagId) : '';
    if(!tag){
        res.status(404).json({
            message: "No tag with tagId exists"
        });
        return;
    }
    next();
}

const isTagUsers = async(req: Request, res: Response, next: NextFunction) => {
    const tag = await TagCollection.findOneById(req.params.tagId);
    const freetUser = await FreetCollection.findOne(tag.freetId);
    console.log(freetUser.authorId._id.toString());
    console.log(req.session.userId);
    const isSameUser = freetUser.authorId._id.toString() === req.session.userId
    if(!isSameUser){
        res.status(410).json({
            message: "Cannot remove tag from another users freet"
        });
        return;
    }
    next();
}

const isUserInSearch = async(req: Request, res: Response, next: NextFunction) => {
    if(!req.session.search){
        res.status(410).json({
            message: "You have to be in search mode to perform this action"
        });
        return;
    }
    next();
}





export {
    isFreetExists,
    isTagExists,
    isTagIdExists,
    isFreetUsers,
    isTagUsers,
    isUserInSearch
};