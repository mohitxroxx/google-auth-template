import { Requests } from "../utils/def"
import { NextFunction, Response } from "express"
import jwt,{JwtPayload} from "jsonwebtoken"
import passport from "passport"

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] })

const googleCallback = passport.authenticate('google', { failureRedirect: '/login' })

const googleCallbackHandler = (req: Requests, res: Response) => {
    const user:any = req.user;
    res.cookie('accessToken', user.accessToken, { httpOnly: true, secure: true })
    res.cookie('refreshToken', user.refreshToken, { httpOnly: true, secure: true })
    res.send("Logged in with google!!")
    // res.redirect('/')
}

const googleLogout = async (req: Requests, res: Response, next: NextFunction) => {
    try {
        req.logout((err) => {
            if (err) { return next(err) }
            res.redirect('/')
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error occurred while logging out' })
    }
}

const isAuthenticated = (req: Requests, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('auth/google');
}

const getUserDetails = (req: Requests, res: Response) => {
    if (req.isAuthenticated()) {
        return res.status(200).json(req.user);
    }
    res.status(401).json({ error: 'User not authenticated' });
}

const refreshToken = (req: Requests, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as JwtPayload
        const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(403).json({ error: 'Invalid refresh token' });
    }
}


const all_exports = {
    googleAuth,
    googleCallback,
    googleCallbackHandler,
    googleLogout,
    isAuthenticated,
    getUserDetails,
    refreshToken
}

export default all_exports

