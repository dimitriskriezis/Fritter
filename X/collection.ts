import type {HydratedDocument, Types} from 'mongoose';
import UserCollection from '../user/collection';
import GroupCollection from '../groups/collection'
import FreetCollection from '../freet/collection';
import XModel from './model';
import {X} from  './model';
import { isValidFreetModifier } from 'freet/middleware';

class XCollection {  
  /**
   * Add an X
   */
  static async addOne(freetId: Types.ObjectId | string, userThatXed: Types.ObjectId | string):Promise<HydratedDocument<X>>{
    const dateXed = new Date();
    const X = new XModel({freetId:freetId, userThatXed:userThatXed, dateXed: dateXed});
    await X.save();
    return X;
  }


  /**
   * Find an X made by user on a post
   */
   static async findOne(freetId: Types.ObjectId | string, userThatXed: Types.ObjectId | string) :Promise<HydratedDocument<X>>{
    return XModel.findOne({freetId: freetId, userThatXed: userThatXed});
  }

  /**
   * Find all Xs of post
   */
   static async findAllByFreetId(freetId: Types.ObjectId | string) : Promise<Array<HydratedDocument<X>>>{
    return XModel.find({freetId: freetId});
  }

  /**
   * Find all Xed posts of user
   */
   static async findAllByUserId(userId: Types.ObjectId | string) : Promise<Array<HydratedDocument<X>>>{
    return XModel.find({userThatXed: userId});
  }

}

export default XCollection;