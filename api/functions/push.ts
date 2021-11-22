import * as expressTypes from "express";
import * as database from "./../../database/database"
import { getUser } from "../../database/functions/users";

export async function subscribePushNotifications(req:expressTypes.Request, res:expressTypes.Response) {
    try {
        const subscription = req.body["subscription"];
        const requestedUser = req.body["user_id"];
        const account_token = req.headers["authorization"];
        const scopes = req.body["scopes"]
    
        console.log("[Push Notifications]".bgYellow.black + "A new subscriber has been requested to be notified (%s)".bgCyan.black, requestedUser)
    
        if (subscription == undefined) {
            console.log("[Push Notifications]".bgYellow.black + "Subscription for (%s) has failed with code 400 (Invalid subscription params)".bgRed.black, requestedUser)
            return res.status(400).send({ code: 400, message: "Invalid subscription parameter."});
        }
        if (requestedUser == undefined) {
            console.log("[Push Notifications]".bgYellow.black + "Subscription for a user has failed with code 400 (Invalid targetUser)".bgRed.black)
            return res.status(400).send({ code: 400, message: "Missing target user."})
        }
        if (account_token == undefined) {
            console.log("[Push Notifications]".bgYellow.black + "Subscription for (%s) has failed with code 400 (Invalid authorization)".bgRed.black, requestedUser)
            return res.status(400).send({ code: 400, message: "Invalid authorization token."})
        }
    
        if (scopes == undefined) {
            console.log("[Push Notifications]".bgYellow.black + "Subscription for (%s) has failed with code 400 (Missing scopes)".bgRed.black, requestedUser)
            return res.status(400).send({ code: 400, message: "Missing scopes."})
        }
    
        if (scopes > 2) {
            console.log("[Push Notifications]".bgYellow.black + "Subscription for (%s) has failed with code 400 (Invalid scopes size)".bgRed.black, requestedUser)
            return res.status(400).send({ code: 400, message: "Missing scopes."})
        }
    
        if (!scopes.includes("newQueueRequest") || !scopes.includes("queueRequestUpdate")) {
            console.log("[Push Notifications]".bgYellow.black + "Subscription for (%s) has failed with code 400 (Invalid scope[0] -> %s)".bgRed.black, requestedUser, scopes)
            return res.status(400).send({ code: 400, message: "Invalid scopes."})
        }
    
        let databaseUser = await getUser(requestedUser);
        if (databaseUser == null) {
            console.log("[Push Notifications]".bgYellow.black + "Subscription for (%s) has failed with code 404 (User not found.)".bgRed.black, requestedUser)
            return res.status(404).send({ code: 404, message: "User not found!"})
        }
    
        if (databaseUser.account_token != account_token) {
            console.log("[Push Notifications]".bgYellow.black + "Subscription for (%s) has failed with code 401 (Invalid authorization)".bgRed.black, requestedUser)
            return res.status(401).send({ code: 401, message: "Invalid authorization token."})
        }
    
        await database.users.findOneAndUpdate({ _id: requestedUser }, { push: { enable: true, auth: subscription, scopes: scopes } })
    
        console.log("[Push Notifications]".bgYellow.black + "Subscription for (%s) has been finished with success!".bgGreen.black, requestedUser)
    
        return Promise.resolve(res.status(201).json({ code: 201, message: "subscribed!"}))
    } catch(e) {
        console.error(e)
        return res.status(500).send({ code: 500, message: "Internal server error." })
    }
}