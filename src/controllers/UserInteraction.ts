import { followNow, getFollowers, getFollowing, getFriends, getUserByShopId, unfollowNow } from "../model/users";



export class UserController {



    static async follow(req, res, next){
        try {
            const username = req.params.u;
            if (req.identity.shopid == req.params.u) {
                return res.status(400).json({ message: "Self request!"});
            }

            const checkUser = await getUserByShopId(username);
            if (!checkUser) {
                return res.status(400).json({ message: 'Corporation does not exists!'});
            }

            const friend_id = checkUser._id;
            const sended = await followNow( req.identity._id.toHexString(), friend_id.toHexString());
            if (!sended) {
                return res.status(500).json({message: 'Unable to follow!'});
            }

            return res.status(sended.status).json({message:sended.message});
        } catch (e) {
            return res.status(400).json({ message: 'Something went wrong'});
        }
    }

    static async unfollow(req, res, next){
        try {
            const username = req.params.u;
            // if (req.identity.shopid == req.params.u) {
            //     return res.status(400).json({ message: "Self request!"});
            // }

            const checkUser = await getUserByShopId(username);
            if (!checkUser) {
                return res.status(400).json({ message: 'Corporation does not exists!'});
            }

            const user_id = checkUser._id;
            const sended = await unfollowNow( req.identity._id.toHexString(), user_id.toHexString());
            if (!sended) {
                return res.status(500).json({message: 'Unable to unfollow!'});
            }

            return res.status(sended.status).json({message:sended.message});
        } catch (e) {
            return res.status(400).json({ message: 'Something went wrong'});
        }
    }

    static async myfollowers(req, res, next){
        try {
            const user_id = req.identity._id;
            const users = await getFollowers(user_id.toHexString());
            if (!users) {
                return res.status(200).json({ count:0, message: 'No new followers!'});
            }
            const count_users = users.length;
            if (!count_users) {
                return res.status(200).json({ count:0, message: 'No new followers!'});
            }
            let s = '';
            if (count_users > 1) {
                s = 's';
            }
            return res.status(201).json({
                count: count_users,
                users: users,
                message: "You have " + count_users.toString() + " follower"+s+"."
            });
        } catch (e) {
            return res.status(400).json({ message: 'Something went wrong'});
        }
    }

    static async myfriends(req, res, next){
        try {
            const my_user_id = req.identity._id;
            const users = await getFriends(my_user_id.toHexString());
            if (!users) {
                return res.status(200).json({ count:0, message: 'You do not have mutual following with anyone!'});
            }
            const count_users = users.length;
            if (!count_users) {
                return res.status(200).json({ count:0, message: 'You do not have mutual following with anyone!'});
            }
            let s = '';
            if (count_users > 1) {
                s = 's';
            }
            return res.status(201).json({
                count: count_users,
                users: users,
                message: "You have " + count_users.toString() + " friend"+s+'.'
            });
        } catch (e) {
            console.log({error:e});
            return res.status(400).json({ message: 'Something went wrong'});
        }
    }

    static async myfollowing(req, res, next){
        try {
            const my_user_id = req.identity._id;
            const users = await getFollowing(my_user_id.toHexString());
            if (!users) {
                return res.status(200).json({ count:0, message: 'You are not following any account!'});
            }
            const count_users = users.length;
            if (!count_users) {
                return res.status(200).json({ count:0, message: 'You are not following any account!'});
            }
            let s = '';
            if (count_users > 1) {
                s = 's';
            }
            return res.status(201).json({
                count: count_users,
                users: users,
                message: "You are following " + count_users.toString() + " accounts"+s+'.'
            });
        } catch (e) {
            console.log({error:e});
            return res.status(400).json({ message: 'Something went wrong'});
        }
    }

    

  
}