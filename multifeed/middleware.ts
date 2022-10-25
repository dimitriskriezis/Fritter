import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

const isSwitchingToInvalidMode = async(req: Request, res: Response, next: NextFunction) => {
    console.log(req.body.mode);
    if (!req.body.mode){
        res.status(404).json({
            message: "Switching to invalid mode"
        });
        return;
    }

    if(req.body.mode!="0" && req.body.mode != "1" && req.body.mode !="2"){
        res.status(404).json({
            message: "Switching to invalid mode"
        });
        return;
    }
    next();
}

const isUserInGroupOrSearch = async(req: Request, res: Response, next: NextFunction) => {
    if(!req.session.groupId && !req.session.search){
        res.status(412).json({
            message: "user cannot mode toggle outside group or search"
        });
        return;
    }
    next();
}


export {isSwitchingToInvalidMode, isUserInGroupOrSearch};