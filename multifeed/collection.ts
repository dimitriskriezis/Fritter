import type {HydratedDocument, Types} from 'mongoose';
import UserCollection from '../user/collection';
import GroupCollection from '../groups/collection'
import FreetCollection from '../freet/collection';
import {Freet} from '../freet/model';
import TagCollection from '../tagged-search/collection';

class FeedCollection {  
    /**
     * Find all freets of specific mode
     */
    static async findAllFreetsInGroup(groupId: Types.ObjectId | string, mode:Number): Promise<Array<HydratedDocument<Freet>>>{
        const groupMembers = await GroupCollection.findAllMembersByGroupId(groupId);
        console.log(groupMembers);
        const allFreets = []
        for (const groupMember of groupMembers){
            const freets = await FreetCollection.findAllByUserIdAndMode(groupMember.groupMemberId, Number(mode))
            console.log(freets);
            allFreets.push(...freets);
        }
        return allFreets;
    }

    static async findAllFreetsByTag(userId: Types.ObjectId | string, tag: string, mode:Number):Promise<Array<HydratedDocument<Freet>>>{
        const defaultGroup = await GroupCollection.findOneDefaultGroup(userId);
        const followedUsers = await GroupCollection.findAllMembersByGroupId(defaultGroup.groupId);
        console.log(followedUsers);
        const followedFreets = new Set();
        for (const followedUser of followedUsers) {
            const userFreets = await FreetCollection.findAllByUserIdAndMode(followedUser.groupMemberId, Number(mode));
            for (const userFreet of userFreets){
                followedFreets.add(userFreet._id.toString());
            }
        }
        console.log(followedFreets);

        const allFreetIdsWithTag = await TagCollection.findAllWithTag(tag);
        console.log(allFreetIdsWithTag)
        const resultFreets = [];
        for(const freetIdWithTag of allFreetIdsWithTag){
            console.log(freetIdWithTag);
            if(!followedFreets.has(freetIdWithTag.freetId.toString())){
                const freet = await FreetCollection.findOne(freetIdWithTag.freetId);
                resultFreets.push(freet);
            }
        }
        return resultFreets;
    }
}

export default FeedCollection;