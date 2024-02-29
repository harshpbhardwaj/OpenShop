import express from 'express';
import { get, identity, merge } from 'lodash';
import { getUserBySessionToken } from '../model/users';
import { ErrorRequestHandler } from "express";

export const isOwner =async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        const id = req.params.id;
        const current_user_id = get( req, 'identity._id') as string;
        if (!current_user_id) {
            return res.status(403).json({ message: 'Try login first!'})
        }

        if (current_user_id != id) {
            return res.status(403).json({ message: 'Unauthorised access!'});
        }

        next();

    } catch (e) {
        return res.status(400).json({ message: 'Something went worng!'});
    }
}
export const isAuthenticated = async (req: express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        const sessionToken = req.cookies['HEXA-AUTH'];
        if(!sessionToken){
            return res.status(403).json({ message: 'Please login first!'});
        }
        
        const sessionUser = await getUserBySessionToken(sessionToken);
        if (!sessionUser) {
            return res.status(401).json({ message: 'Unauthorized access!'});
        }

        merge(req, { identity: sessionUser });

        return next();
    } catch (e) {
        console.log({'error':e});
        res.sendStatus(400);
    }
}


export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).send({ errors: [{ message: "Something went wrong" }] });
  };