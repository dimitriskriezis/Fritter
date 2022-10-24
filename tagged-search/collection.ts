import type {HydratedDocument, Types} from 'mongoose';
import UserCollection from '../user/collection';
import GroupCollection from '../groups/collection'
import FreetCollection from '../freet/collection';
import TagModel from './model';
import {Tag} from  './model';
import { isValidFreetModifier } from 'freet/middleware';

class TagCollection {  
    /**
     * Add a tag to a post
     * 
     * @param freetId - the id of the freet to which I am adding a tag
     * @param tag - the tag that I am adding to that freet
     * 
     * @return
     */
    static async addOneTag(freetId: Types.ObjectId | string, tag: string): Promise<HydratedDocument<Tag>>{
        const dateAdded = new Date();
        const freettag = new TagModel({freetId: freetId, tag: tag, dateAdded: dateAdded});
        await freettag.save();
        return freettag;
    }

   /**
   * Delete a tag
   * 
   * @param tagId - the id of the tag I am deleting
   * @returns - wether or not the tagged was removed from the post
   */
  static async deleteOneTagById(tagId: Types.ObjectId | string): Promise<boolean> {
    const tag = await TagModel.deleteOne({_id: tagId});
    return tag != null;
  }

  /**
   * find one post id tag id pair
   */
  static async findOne(freetId: Types.ObjectId | string, tag: string) :Promise<HydratedDocument<Tag>>{
    return TagModel.findOne({freetId, tag});
  }

   /**
   * find tag by tagid
   */
    static async findOneById(tagId: Types.ObjectId | string) :Promise<HydratedDocument<Tag>>{
      return TagModel.findOne({_id:tagId});
    }

  /**
   * find all freetids with a specific tag
   */
  static async findAllWithTag(tag:string) : Promise<Array<HydratedDocument<Tag>>>{
    return TagModel.find({tag: tag});
  }
    
}

export default TagCollection;