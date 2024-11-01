import express, { Response,NextFunction } from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Requests } from './utils/def'
import passport from 'passport'
import session from 'express-session'
import 'dotenv/config'
import './config/passport'
import gAuth from './router/authRoutes'
import './config/db'

const app = express()

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true
    })
)



app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())


app.get('/', (req: Requests, res: Response): Response => {
    return res.status(201).json({ msg: "Server is Live!!🚀" })
})

app.use('/auth',gAuth)

const port: number = Number(process.env.PORT) || 6000

app.listen(port, () => {
    console.log(`Server is up and Running at http://localhost:${port}`)
})
