import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import jwt from 'jsonwebtoken'
import UserSchema from '../models/model'

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: 'http://localhost:5000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user:any = await UserSchema.findOne({ googleId: profile.id }) //fk typeSafety
      if (!user) {
        user = await UserSchema.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
          displayName: profile.displayName
        })
      }

      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' })
      const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET , { expiresIn: '7d' })

      user.accessToken = accessToken
      user.refreshToken = refreshToken

      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }
))

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserSchema.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

export default passport