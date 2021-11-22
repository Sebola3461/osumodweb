import * as database from "./../database";
import { modwebUser, osuUserApiResponse, osuUserToken } from "../../types/types";
import {getNewTokenByRefresh} from "./../../api/functions/requests/osu";
import crypto from "crypto";

export async function getUser(id:string):Promise<modwebUser> {
    let user = await database.users.findOne({_id:id});
    return Promise.resolve(user)
}

export async function createNewUser(user:osuUserApiResponse, tokens:osuUserToken) {
    console.log("[Database]".bgYellow.black + "Creating a new user! %s (%s)".bgYellow.black, user.username, user.id)
    try {
        let accountToken = generateAccountToken()
        let newUser = new database.users({
            _id: user.id,
            username: user.username,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            account_token: accountToken
        })
        
        await newUser.save()
    
        function generateAccountToken() {
            return crypto.randomBytes(20).toString("hex").slice(0, 40)
        }

        console.log("[Database]".bgYellow.black + "New user created! %s (%s)".bgGreen.black, user.username, user.id)

        return Promise.resolve({
            _id: user.id,
            username: user.username,
            hasQueue: false,
            account_token: accountToken
        })
    } catch(error) {
        return Promise.reject(error)
    }
}

export async function updateRefreshToken(userId:string, authorization:string) {
    console.log("[Database]".bgYellow.black + "Updating refresh token for %s".bgYellow.black, userId)

    try {
        let databaseUser = await getUser(userId);
        if (databaseUser.account_token != authorization) return Promise.reject({ code: 400, message: "Invalid account_token"})
    
        let newTokens = await getNewTokenByRefresh(databaseUser.refresh_token)
        await database.users.findOneAndUpdate({ _id: userId }, { refresh_token: newTokens.refresh_token, access_token: newTokens.access_token});

        console.log("[Database]".bgYellow.black + "Done! token updated for %s".bgGreen.black, userId)
    
        return Promise.resolve({ code:200, message: "Job done!"})
    } catch (error) {
        console.log("[Database]".bgYellow.black + "An error has ocurred when token update process for %s: %s".bgRed.black, userId)
        console.error(error)
        return Promise.reject(error)
    }
}

export async function editTokens(user_id:string, account_token:string, access_token:string, refresh_token:string) {
    console.log("[Database]".bgYellow.black + "Updating tokens for %s".bgYellow.black, user_id)

    try {
        let user = await getUser(user_id);
        if (user == null) return Promise.reject({code: 404, message: "User not found!"});
    
        if (account_token != user.account_token) return Promise.reject({code: 400, message: "Invalid account_token!"})
    
        await database.users.findOneAndUpdate({_id: user_id }, { access_token: access_token, refresh_token: refresh_token });
    
        user = await getUser(user_id)

        console.log("[Database]".bgYellow.black + "Done! all tokens updated for %s".bgGreen.black, user_id)
    
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function updatePushData(subscription:Object, user_id:string) {

}