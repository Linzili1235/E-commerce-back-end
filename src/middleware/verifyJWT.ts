import {Err, ErrStr, HttpCode} from "../helper/Err";

const jwt = require('jsonwebtoken');
require('dotenv').config();
import { NextFunction, Request, Response } from 'express';

interface GetUserInfo extends Request {
    email: string,
    // auth_type: string
}

const verifyJWT = (req: GetUserInfo, res: Response, next: NextFunction):void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(HttpCode.E403).send(new Err(HttpCode.E403, ErrStr.ErrToken))
    }
    const token = authHeader && authHeader.split(' ')[1] // bearer token
    // check if token is expired
    console.log('verifyJWT, split bearToken')
    if (typeof token === "string") {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err: any, decoded: { email: string; }) => {
                // decoded is the information from the token's payload section
                // token = payload + secret + options
                console.log(`error is ${err}`)
                if (err || !decoded.email) {
                    return res.status(HttpCode.E403).send(new Err(HttpCode.E403, ErrStr.ErrToken))
                }

                req.email = decoded.email
                next()
                return
            }
        )
    }
}

export default verifyJWT;