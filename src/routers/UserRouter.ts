import {Router} from 'express';
import {UserController} from '../controllers/UserInteraction';

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        this.router.get('/my-followers', UserController.myfollowers);
        this.router.get('/my-following', UserController.myfollowing);
    }

    postRoutes() {
        
    }

    patchRoutes() {
        this.router.patch('/follow-now/:u', UserController.follow);
    }

    deleteRoutes() {

    }
}

export default new UserRouter().router;
