import express from "express";
import meHandler from "./postAuth/me.ts";
import profileHandler from "./postAuth/profile.ts";
import firstTimeHandler from "./postAuth/firstTime.ts";
import profilesHandler from "./postAuth/profiles.ts";
import checkTokens from "../middleware/checkTokens.ts";

const protectedRouter = express.Router();

protectedRouter.use(checkTokens)
protectedRouter.use('/me', meHandler)
protectedRouter.use('/profile', profileHandler)
protectedRouter.use('/profile/first-time', firstTimeHandler)
protectedRouter.use('/profiles', profilesHandler)

export default protectedRouter;
