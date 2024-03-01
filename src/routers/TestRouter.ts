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
        
    }

    postRoutes() {
        
    }

    patchRoutes() {
    }

    deleteRoutes() {

    }
}

export default new UserRouter().router;
