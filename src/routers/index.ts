import express from "express";
import authentication from "./AuthRouter";
import UserRouter from "./UserRouter";
import {isAuthenticated} from '../middlewares/';
import {home} from '../controllers/index';
import TestRouter from "./TestRouter";

const router = express.Router();

export default(): express.Router => {
    authentication(router);
    router.use('/user', isAuthenticated, UserRouter);
    router.use('/test', TestRouter);





    router.use('/', home);
    return router;
}