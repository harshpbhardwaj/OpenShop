const express = require("express");
import http from "http";
import bodyParser from "body-parser";
import coockieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from 'mongoose';
import router from './routers';
import { errorHandler } from "./middlewares";
import "express-async-errors";
const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(coockieParser());
app.use(bodyParser.json());
app.use('/', router());
app.use(errorHandler);


const mongo_uri = "mongodb+srv://iamharshpbhardwaj:YCBRJLmIt0IMPwDd@openshop.vxojhhd.mongodb.net/?retryWrites=true&w=majority&appName=OpenShop";
mongoose.Promise = Promise;
mongoose.connect(mongo_uri);
mongoose.connection.on( 'error', ( error: Error)=> console.log(error))

const server = http.createServer(app);
const port = 5050;
server.listen(port,() => {
    const address = server.address();
    console.log('Server running on http://localhost:'+String(port)+' and http://127.0.0.1:'+String(port));
});
