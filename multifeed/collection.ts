import type {HydratedDocument, Types} from 'mongoose';
import UserCollection from '../user/collection';
import GroupCollection from '../groups/collection'
import FreetCollection from '../freet/collection';
import {Freet} from '../freet/model';
import TagCollection from '../tagged-search/collection';
import XCollection from '../X/collection';  


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
        // get all Xed freets of user and don't display them on user's feed
        const notIncludeFreets = new Set();
        const xedPosts = await XCollection.findAllByUserId(userId);
        for (const xedPost of xedPosts){
            notIncludeFreets.add(xedPost.freetId.toString());
        }

        // get all flagged user freets and add them to freets not included
        const flaggedUsers = await UserCollection.findAllFlagged();
        for (const flaggedUser of flaggedUsers){
            const flaggedUserFreets = await FreetCollection.findAllByUserIdAndMode(flaggedUser._id, Number(mode));
            for (const flaggedUserFreet of flaggedUserFreets){
                notIncludeFreets.add(flaggedUserFreet._id.toString());
            }
        }
        // get all followed users and add their freets to freets not inclided
        const defaultGroup = await GroupCollection.findOneDefaultGroup(userId);
        const followedUsers = await GroupCollection.findAllMembersByGroupId(defaultGroup.groupId);
        console.log(followedUsers);
        for (const followedUser of followedUsers) {
            const userFreets = await FreetCollection.findAllByUserIdAndMode(followedUser.groupMemberId, Number(mode));
            for (const userFreet of userFreets){
                notIncludeFreets.add(userFreet._id.toString());
            }
        }
        console.log(notIncludeFreets);
        const allFreetIdsWithTag = await TagCollection.findAllWithTag(tag);
        console.log(allFreetIdsWithTag)
        const resultFreets = [];
        for(const freetIdWithTag of allFreetIdsWithTag){
            console.log(freetIdWithTag);
            if(!notIncludeFreets.has(freetIdWithTag.freetId.toString())){
                const freet = await FreetCollection.findOneWithMode(freetIdWithTag.freetId, Number(mode));
                if(freet){
                    resultFreets.push(freet);
                }
            }
        }
        return resultFreets;
    }
}

export default FeedCollection;