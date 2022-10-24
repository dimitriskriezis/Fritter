import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

const isSwitchingToInvalidMode = async(req: Request, res: Response, next: NextFunction) => {
    console.log(req.query.mode);
    if (!req.query.mode){
        res.status(404).json({
            message: "Switching to invalid mode"
        });
        return;
    }

    if(req.query.mode!="0" && req.query.mode != "1" && req.query.mode !="2"){
        res.status(404).json({
            message: "Switching to invalid mode"
        });
        return;
    }
    next();
}


export {isSwitchingToInvalidMode};