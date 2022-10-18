import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import UserCollection from '../user/collection';

const router = express.Router();


/**
 * Follow a user
 *
 * @name POST /api/follow
 *
 * @param {string} followedUsername - name of the user to follow
 * @throws {404} - If username does not exist
 * @throws {400} - If username is empty
 *
 */
 router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      followValidator.isUserExists,
      followValidator.isUserFollowHimself,
      followValidator.isUserAlreadyFollowed,
    ],
    async (req: Request, res: Response) => {
      const follow = await FollowCollection.addOneByUsername(req.session.userId, req.body.followedUsername);
      console.log(follow);
      res.status(201).json({
        message: `You have followed user ${req.body.followedUsername} successflly`,
      });
    }
  );
  
  /**
   * Unfollow a user
   * 
   * @name DELETE /api/follow
   * 
   * @param {string} followedUsername
   * @throws {404} - If username does not exist
   * @throws {400} - If username is empty
   * @throws {403} - If user is not logged in
   * @throws {401} - If usernameToUnfollow is not followed by the user
   * 
   */
  router.delete(
    '/:followedUsername',
    [userValidator.isUserLoggedIn,
      followValidator.isUserExistsUnfollow,
      followValidator.isUserFollowedUnfollow
    ],
    async (req:Request, res:Response) => {
      console.log("what is happening");
      const unfollow = await FollowCollection.deleteOne(req.session.userId, req.params.followedUsername);
      res.status(201).json({
        message:`You have successfully unfollowed user ${req.params.followedUsername} successfully`,
      });
    }
  )

export {router as followRouter};