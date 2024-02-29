import express from "express";
import authentication from "./AuthRouter";
import UserRouter from "./UserRouter";
import {isAuthenticated} from '../middlewares/';
import {home} from '../controllers/index';

const router = express.Router();

export default(): express.Router => {
    authentication(router);
    router.use('/user', isAuthenticated, UserRouter);





    router.use('/', home);
    return router;
}