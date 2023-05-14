import {Request, Response} from "express"
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {UserController} from "./UserController";
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefresh = async (req: Request, res: Response) => {
    const cookies = req.cookies
    // check if there is a jwt in the cookie
    if (!cookies?.jwt) return res.status(HttpCode.E404).send(new Err(HttpCode.E404, ErrStr.ErrUnauthorized))
    const refreshToken = cookies.jwt

    // each loggedIn user has their own jwt token
    const foundUser = await UserController.repo.findOne({where: {refreshToken}})
    // check if the token is tampered with
    if (!foundUser) return res.status(HttpCode.E404).send(new Err(HttpCode.E404, ErrStr.ErrToken))

    // verify the jwt token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error: any, decoded: { email: any; }) => {
            // TODO: why not verify user email? foundUser.email !== decoded.email?
            if (error || !decoded) return res.status(HttpCode.E404).send(new Err(HttpCode.E404, ErrStr.ErrToken))
            // Give new access token
            const accessToken = jwt.sign(
                {"email": decoded.email, "auth_type": "refresh"},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME}
            )
            // send the access token
            return res.status(HttpCode.E200).json({
                accessToken,
                error: new Err(HttpCode.E200, ErrStr.LoggedIn)
            });
        }
    )
    return
}

export default handleRefresh;