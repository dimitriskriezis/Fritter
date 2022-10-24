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
    const X = new XModel({freetId:freetId, userThatXed:userThatXed});
    await X.save();
    return X;
  }


  /**
   * Find an X made by user
   */
   static async findOne(userThatXed: Types.ObjectId | string) :Promise<HydratedDocument<X>>{
    return XModel.findOne({userThatXed: userThatXed});
  }

  /**
   * Find all Xs of post
   */
   static async findAllByFreetId(freetId: Types.ObjectId | string) : Promise<Array<HydratedDocument<X>>>{
    return XModel.find({freetId: freetId});
  }

}

export default XCollection;