import { followNow, getFollowers, getFollowing, getUserByShopId } from "../model/users";



export class UserController {



    static async follow(req, res, next){
        try {
            const username = req.params.u;
            if (req.identity._id == req.params.u) {
                return res.status(400).json({ message: "Self request!"});
            }

            const checkUser = await getUserByShopId(username);
            if (!checkUser) {
                return res.status(400).json({ message: 'User does not exists!'});
            }

            const friend_id = checkUser._id;
            const sended = await followNow( req.identity._id.toHexString(), friend_id.toHexString());
            if (!sended) {
                return res.status(400).json({message: 'Unable to send friend request!'});
            }

            return res.status(sended.status).json({message:sended.message});
        } catch (e) {
            return res.status(400).json({ message: 'Something went wrong'});
        }
    }

    static async myfollowers(req, res, next){
        try {
            const user_id = req.identity._id;
            const friend_requests = await getFollowers(user_id.toHexString());
            if (!friend_requests) {
                return res.status(200).json({ message: 'No new friend requests!'});
            }
            return res.status(201).json({following:friend_requests.following});
        } catch (e) {
            return res.status(400).json({ message: 'Something went wrong'});
        }
    }

    static async myfollowing(req, res, next){
        try {
            const user_id = req.identity._id;
            const following = await getFollowing(user_id.toHexString());
            if (!following) {
                return res.status(200).json({ message: 'No new friend requests!'});
            }
            return res.status(201).json({following:following.following});
        } catch (e) {
            return res.status(400).json({ message: 'Something went wrong'});
        }
    }
    

  
}