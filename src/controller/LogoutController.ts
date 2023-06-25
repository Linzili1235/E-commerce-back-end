import {Request, Response} from "express"
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {UserController} from "./UserController";


const handleLogout = async (req: Request, res: Response) => {
    //On client, need to delete access token
    const cookies = req.cookies
    // check if there is a jwt in the cookie
    if (!cookies?.jwt) return res.status(HttpCode.E200).send('no jwt, no need to clear')
    const refreshToken = cookies.jwt
    // each loggedIn user has their own jwt token
    const foundUser = await UserController.repo.findOne({where: {refreshToken}})
    // no user, but has cookies
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true, maxAge: 0, path: '/'})
        return res.status(HttpCode.E200)
    }
    foundUser.refreshToken = ""

    // // Delete the refresh token for the user in the db and cookie --- logout
    // const otherUser = (await UserController.repo.find()).filter(user => user.refreshToken !== foundUser.refreshToken)
    // const currentUser = {...foundUser, refreshToken: ''};
    // TODO: why not just update the currentUser, is that how to update?
    // await UserController.repo.save([...otherUser, currentUser])
    await UserController.repo.save(foundUser)
    // delete the cookie
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true, maxAge: 0, path: '/'}) // secure: true - only serves on https

    return res.status(HttpCode.E200).send(new Err(HttpCode.E201, ErrStr.LoggedOut))
}
export default handleLogout;