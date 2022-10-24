import {NextFunction, Request, Response, Router} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import XCollection from './collection';

const router = express.Router();

// router.get(
//     'X',
//     [],
//     async(req:Request, res:Resps){

//     }
// )


export {router as XRouter};
