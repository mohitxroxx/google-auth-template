import { Router } from "express";
import ctrl from '../controllers/authControllers'
const app: Router = Router();

app.get('/google',ctrl.googleAuth)
app.get('/google/callback',ctrl.googleCallback,ctrl.googleCallbackHandler)
app.get('/logout',ctrl.googleLogout)
app.get('/profile', ctrl.isAuthenticated, ctrl.getUserDetails)
app.post('/refresh-token', ctrl.refreshToken)

export default app
