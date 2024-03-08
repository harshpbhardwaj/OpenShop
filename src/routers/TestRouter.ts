import {Router} from 'express';
import {TestController} from '../controllers/TestController';

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
        this.router.get('/all-users', TestController.getAllUsers);
    }

    postRoutes() {
        
    }

    patchRoutes() {
    }

    deleteRoutes() {

    }
}

export default new UserRouter().router;
