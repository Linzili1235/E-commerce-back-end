import {Err, ErrStr, HttpCode} from "../helper/Err";

const jwt = require('jsonwebtoken');
require('dotenv').config();
import { NextFunction, Request, Response } from 'express';

interface GetUserInfo extends Request {
    email: string,
    auth_type: string
}

const verifyJWT = (req: GetUserInfo, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(HttpCode.E404).send(new Err(HttpCode.E404, ErrStr.ErrToken))
    console.log(authHeader) // Bearer token
    const token = authHeader.split(' ')[1]
    // check if token is expired
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, jwtPayload) => {
            if (err) res.status(HttpCode.E404).send(new Err(HttpCode.E404, ErrStr.ErrToken))
            req.email = jwtPayload.email
            req.auth_type = jwtPayload.auth_type
            console.log(jwtPayload)
            next()
        }
    )
}

export default verifyJWT;