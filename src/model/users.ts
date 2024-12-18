import mongoose from "mongoose";

const followingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
    follow_type: { type: String, default:'follow' },
    followed_on: { type: Date, default:Date.now }
});

const UserSchema= new mongoose.Schema(
    {
        shopname: { type: String, required: true },
        shopid: { type: String, required: true },
        email: { type: String, required: true },
        contacts: {
            mobile_primary: { type: Number },
            mobile_alternate: { type: Number }
        },
        theme: { type: String, default: 'DefaultTheme'},
        authentication: {
            password: { type: String, required: true, select:false },
            salt: { type: String, select: false },
            sessionToken: { type: String, select: false }
        },
        updated_at: { type: Date, default: Date.now },
        created_at: { type: Date },
        address: { 
            addressline1: { type: String },
            addressline2: { type: String },
            road_name: { type: String },
            landmark: { type: String },
            pincode: { type: String }
         },

        profile:{
            description: { type: String },
            external_links: { type: Object },
            profile_logo: { type: String },
            poster_image: { type: String }
        },
        timings: {
            from: { type: String },
            to: { type: Date },
            days: {
                monday: { type: Boolean },
                tuesday: { type: Boolean },
                wednesday: { type: Boolean },
                thursday: { type: Boolean },
                friday: { type: Boolean },
                seturday: { type: Boolean },
                sunday: { type: Boolean }
            }
        },
        following: { type: [followingSchema], select:false }
    }
);

export const UserModel = mongoose.model( 'User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmailOrShopId = (shopid: string) => UserModel.findOne({ '$or':[ {shopid:shopid}, {email:shopid}]})
export const getUserByShopId = (shopid: string) => UserModel.findOne({shopid:shopid});
export const getUserByEmail = (email: String) => UserModel.findOne({email:email});
export const getUserBySessionToken = (sessionToken: String) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: String)=> UserModel.findOne( id );

export const createUser = (values: Record<string, any>)=> new UserModel( values ).save().then((user) => user.toObject());
export const deleteUserById = (id: String)=> UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: String, values: Record<string, any>)=> UserModel.findByIdAndUpdate( id, values);

export const getFollowers = async (id: String) => {
    try {
        const user = await UserModel.findOne({ _id: id, "following.follow_type": { $ne: 'blockedby'} },{ following:1, _id:0 }).select('following').populate('following.user_id');
        if (!user) {
            return false;
        }
        let followers = Array();
        let i = 0;
        for( const users of user.following){
            followers[i] = users.user_id;
            i += 1;
        }
        return followers;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const getFriends =async (id: String) => {
    try {
        const user = await UserModel.findOne({ _id: id, "following.follow_type": { $ne: 'blockedby'}},{ following:1, id:0 }).select('following');
        if (!user) {
            return false;
        }
        let friends = Array();
        let i = 0;
        for( const users of user.following){
            friends[i] = await UserModel.findOne({ _id: users.user_id, "following.user_id": id, "following.follow_type": { $ne: 'blockedby'} });
            i += 1;
        }
        return friends;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const getFollowing = async (id: String) => {
    try {
        const user_data = await UserModel.find({ "following.user_id": id, "following.follow_type": { $ne: 'blockedby'} });
            if(!user_data.length){
                return false;
            }
            return user_data;
    } catch (e) {
        console.log(e);
        return false;
    }
    };

export const followNow = async ( first_id: String, second_id:String ) => {
    try { // first_id will follow second_id
        const alreadyfollowing = await UserModel.findOne({ _id:second_id, 'following.user_id':first_id }).select('+following');
        if (alreadyfollowing) {
            const followingdata = alreadyfollowing.following.find(user => user.user_id.toHexString() == first_id);
            if (followingdata.follow_type == "blockedby") {
                return { status: 403, message: "Please unblock to follow!" };
            }
            return { status: 403, message: 'Allready following!'};
        }
        const checkifBlocked = await UserModel.findOne({ _id:first_id, 'following.user_id':second_id, "following.follow_type": 'blockedby' });
        if (checkifBlocked) {
            return false;
        }
        const sended = await UserModel.findByIdAndUpdate(second_id, { $addToSet: { following: { user_id: first_id}}});
        if (!sended) {
            return false;
        }
        return { status: 201, message: 'Successfully followed!'};
    } catch (e) {
        console.log({ 'error': e});
        return false;
    }
};

export const unfollowNow = async ( first_id: String, second_id:String ) => {
    try { // first_id will unfollow second_id
        const alreadyfollowing = await UserModel.findOne({ _id:second_id, 'following.user_id':first_id }).select('+following');
        if (!alreadyfollowing) {
            return false;
        }
        const removed = await UserModel.findByIdAndUpdate(second_id, { $pull: { following: { user_id: first_id}}});
        if (!removed) {
            return false;
        }
        return { status: 201, message: 'Successfully unfollowed!'};
    } catch (e) {
        console.log({ 'error': e});
        return false;
    }
};