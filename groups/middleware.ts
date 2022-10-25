import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import GroupCollection from '../groups/collection';
import UserCollection from '../user/collection';

const isGroupMemberExists = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req.body as {userId: string};
    
    if(!userId){
        res.status(404).json({
            message: `No user specified`
        });
        return;
    }

    const validUserIdFormat = Types.ObjectId.isValid(userId);
    const user = validUserIdFormat ? await UserCollection.findOneByUserId(userId) : '';
    if(!user){
        res.status(405).json({
            message: `User does not exist`
        });
        return;
    }
    
    const groupmember = await GroupCollection.findOneMemberById(req.session.groupId, userId);
    if(groupmember){
        res.status(406).json({
            message: `User already in group`
        });
        return;
    }
    next();
} 

const isUserAddsHimself = async(req:Request, res:Response, next:NextFunction) => {
    const {userId} = req.body as {userId: string};
    if(userId == req.session.userId){
        res.status(412).json({
            message: "can't add yourself to a group"
        });
        return;
    }
    next();
}

const isGroupMemberExistsDelete = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.query.groupId){
        res.status(404).json({
            message: `No group specified`
        });
        return;
    }

    if(!req.query.userId){
        res.status(404).json({
            message: `No user specified`
        });
        return;
    }
    const validUserIdFormat = Types.ObjectId.isValid(req.query.userId.toString());
    const user = validUserIdFormat ? await UserCollection.findOneByUserId(req.query.userId.toString()) : '';
    if(!user){
        res.status(405).json({
            message: `User does not exist`
        });
        return;
    }

    const validFormat = Types.ObjectId.isValid(req.query.groupId.toString());
    const group = validFormat ? await GroupCollection.findOneGroupByGroupId(req.query.groupId.toString(), req.session.userId) : '';
    if(!group){
        res.status(404).json({
            message: `group with group id and user id does not exist`
        });
        return;
    }
    console.log(req.query);
    console.log(req.query.groupId.toString());
    console.log(req.query.userId.toString());
    const groupmember = await GroupCollection.findOneMemberById(req.query.groupId.toString(), req.query.userId.toString());
    if(!groupmember){
        res.status(406).json({
            message: `User to be removed not in group`
        });
        return;
    }
    next();
} 

const isGroupExists = async (req:Request, res:Response, next: NextFunction) => {
    if(!req.params.groupId){
        res.status(404).json({
            message: `No group specified`
        });
        return;
    }
     console.log(req.params);
    const validFormat = Types.ObjectId.isValid(req.params.groupId);
    const group  = validFormat ? await GroupCollection.findOneGroupByGroupId(req.params.groupId, req.session.userId) : '';
    console.log(group);
    if (!group){
        res.status(404).json({
                message: `Group you are trying to delete doesn't exist`
        });
        return;
    }
    next();
}

const isGroupExistsSession = async(req: Request, res:Response, next: NextFunction) => {
    const {groupId} = req.body as {groupId: string;};
    if(!groupId){
        res.status(404).json({
            message: `No group specified`
        });
        return;
    }

    const validFormat = Types.ObjectId.isValid(req.body.groupId);
    const group  = validFormat ? await GroupCollection.findOneGroupByGroupId(req.body.groupId, req.session.userId) : '';
    if (!group){
        res.status(404).json({
                message: `Group you are trying to access doesn't exist`
        });
        return;
    }
    next();
}

const isUserInGroup = async (req:Request, res:Response, next: NextFunction) => {
    console.log(req.session);
    if(!req.session.groupId){
        res.status(412).json({
            message: `You must be a group to complete this action`
        });
        return;
    }
    next();
}

const isDefaultGroup = async (req:Request, res:Response, next: NextFunction) => {
    const defaultGroup = await GroupCollection.findOneDefaultGroup(req.session.userId);
    if (req.params.groupId == defaultGroup.groupId.toString()) {
        res.status(412).json({
            message: `You cannot delete the default group`
        });
        return;
    }
    next();
}


export {
    isGroupMemberExists,
    isGroupMemberExistsDelete,
    isGroupExists,
    isGroupExistsSession,
    isUserInGroup,
    isUserAddsHimself,
    isDefaultGroup
};

