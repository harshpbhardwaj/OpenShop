import express from "express";
import { createUser, getUserByEmail, getUserByEmailOrShopId, getUserByShopId } from "../model/users";
import { random, authentication } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { password, shopid, shopname } = req.body;
        let email = req.body.email;
        if ( !email|| !password|| !shopid|| !shopname) {
            return res.status(400).json({message: 'Please, fill all required fields!'});
        }

        email = String(email).toLocaleLowerCase();

        const usernameRegex = /^[a-zA-Z0-9\_\.]+$/;
        const check_shopid = usernameRegex.exec(shopid);
        if (!check_shopid) {
            return res.status(400).json({ message: 'Enter a valid shopid!'});
            /* 
                Usernames can only have: 
                - Lowercase Letters (a-z) 
                - Numbers (0-9)
                - Dots (.)
                - Underscores (_)
            */
        }

        const nameRegex = /^[a-zA-Z\ ]+$/;
        const checkname = nameRegex.exec(shopname);
        if (!checkname) {
            return res.status(400).json({ message: 'Enter a valid shop name!'});
        }

        const shopidExists = await getUserByShopId(shopid);
        if (shopidExists) {
            return res.status(302).json({ message: 'Shopid already exists!'});
        }

        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const checkemail = email.match(re);
        if (!checkemail) {
            return res.status(400).json({ message: 'Enter a valid email!'});
        }

        const userExists = await getUserByEmail(email);
        if (userExists) {
            return res.status(302).json({ message: 'Email already exists!'});
        }
        
        const salt = random();
        const user = await createUser({
            shopname,
            shopid,
            email,
            authentication:{
                salt,
                password: authentication( salt, password)
            },
            created_at: Date.now()
        });
        if (!user) {
            return res.status(500).json({ message: 'Internal Server Error!'});
        }
        return res.status(201).json({ message: 'Successfully registered!'});
    } catch (e) {
        console.log(e);
        return res.status(400).json({ message: 'Something went wrong!'});
    }
}
export const checkshopid = async (req: express.Request, res: express.Response) => {
    try {
        const { shopid } = req.params;
        if (!shopid) {
            return res.status(400).json({ status:false, message: "ShopId is required!"});
        }
        const usernameRegex = /^[a-zA-Z0-9\_\.]+$/;
        const check_shopid = usernameRegex.exec(shopid);
        if (!check_shopid) {
            return res.status(422).json({ status: false, message: "Enter a valid shopid!"});
        }
        const availability = await getUserByShopId(shopid);
        if (!availability) {
            return res.status(200).json({ status: true, message: "ShopId is available."});
        }
        return res.status(200).json({ status: false, message: "ShopId is not available!"});
    } catch (e) {
        return res.status(400).json({ status:false, message: "Something went wrong!"});
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { userid, password, shopid } = req.body;
        if ( !userid|| !password) {
            return res.sendStatus(400);
        }
        
        const user = await getUserByEmailOrShopId(userid).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.status(400).json({ message: 'User does not exists!'});
        }

        const expectedHash = authentication( user.authentication.salt, password);
        if (user.authentication.password != expectedHash) {
            return res.status(403).json({ message: 'Incorrect Password!'});
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();
        res.cookie('HEXA-AUTH', user.authentication.sessionToken);
        
        return res.status(200).json({ message: 'Login Successful.'});
    } catch (e) {
        console.log(e);
        return res.status(400).json({ message: 'Something went wrong!'});
    }
}
