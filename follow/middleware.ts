import type {Request, Response, NextFunction} from 'express';
import { relativeTimeRounding } from 'moment';
import {Types} from 'mongoose';
import FollowCollection from '../follow/collection';
import UserCollection from '../user/collection';


/**
 * Checks if a user to be followed exists
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  if (!req.body.followedUsername) {
    res.status(400).json({
      error: 'Provided username has to be nonempty.'
    });
    return;
  }

  const followeeUsername = req.body.followedUsername
  const followeeId = await UserCollection.findOneByUsername(followeeUsername)
  console.log("here")
  console.log(followeeId)
  if (!followeeId) {
    res.status(404).json({
      error: {
        userNotFound: `User with username ${followeeUsername} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Check if the user tries to follow himselfs
 */
const isUserFollowHimself = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.body.followedUsername);
  const userId = user._id
  if (userId == req.session.userId){
    res.status(403).json({
      error: {
        userNotFound: 'You cannot follow yourself'
      }
    });
    return;
  }
  next();
};

/**
 * Check if user already follows a user
 */
const isUserAlreadyFollowed = async (req: Request, res: Response, next: NextFunction) => {
  const followeduser = await UserCollection.findOneByUsername(req.body.followedUsername);
  const followedUserId = followeduser._id;
  const already = await FollowCollection.findOne(req.session.userId, followedUserId);
  if (already){
    res.status(410).json({
      error:{
        userAlreadyExists: `You are already following this user`
      }
    });
    return;
  }
  next()
}

/**
 * Check if a username is followed by req.session.userId 
 */
const isUserFollowed = async(req:Request, res:Response, next: NextFunction) => {
  const userToUnfollow = await UserCollection.findOneByUsername(req.body.followedUsername);
  if (!userToUnfollow){
    res.status(404).json({
      error: {
        userNotFound: 'User you are trying to unfollow doesn\'t exist'
      }
    });
    return;
  }
  const userToUnfollowId = userToUnfollow._id;
  const follow = await FollowCollection.findOne(req.session.userId, userToUnfollowId);
  if (!follow){
    res.status(401).json({
      error: {
        userNotFollowed: 'You are not following the user you are trying to unfollow'
      }
    })
  }

}

/**
 * Checks if a user to be followed exists
 */
 const isUserExistsUnfollow = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params);
  if (!req.params.followedUsername) {
    res.status(400).json({
      error: 'Provided username has to be nonempty.'
    });
    return;
  }

  const followeeUsername = req.params.followedUsername
  const followeeId = await UserCollection.findOneByUsername(followeeUsername)
  console.log("here")
  console.log(followeeId)
  if (!followeeId) {
    res.status(404).json({
      error: {
        userNotFound: `User with username ${followeeUsername} does not exist.`
      }
    });
    return;
  }

  next();
};

const isUserFollowedUnfollow = async(req:Request, res:Response, next: NextFunction) => {
  const userToUnfollow = await UserCollection.findOneByUsername(req.params.followedUsername);
  const userToUnfollowId = userToUnfollow._id;
  const follow = await FollowCollection.findOne(req.session.userId, userToUnfollowId);
  if (!follow){
    res.status(401).json({
      error: {
        userNotFollowed: 'You are not following the user you are trying to unfollow'
      }
    });
    return;
  }
  next();
}



export {isUserExists, isUserFollowHimself, isUserFollowed, isUserExistsUnfollow, isUserFollowedUnfollow, 
        isUserAlreadyFollowed};