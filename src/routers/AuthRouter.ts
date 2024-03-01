import express from 'express';
import { checkshopid, login, register } from '../controllers/UserAuthentication';

export default ( router: express.Router ) => {
    router.get('/auth/checkshopid/:shopid', checkshopid);
    router.post('/auth/register', register);
    router.post('/auth/login', login);
};