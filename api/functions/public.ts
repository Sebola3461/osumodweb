import * as database from "../../database/database";
import * as expressTypes from "express";
import { modwebUser, searchQueueRequest, userNotification, userNotificationObject } from "../../types/types";
import { fetchUserBeatmaps, getUserInfo } from "./requests/osu";
import axios from "axios";
import { sendErrorPage } from "../../errors";

export async function getUser(user_id:string) {
    let user:modwebUser = await database.users.findOne({_id: user_id })
    if (user == null) throw { code: 404, message: "User not found! "};

    return Promise.resolve({
        user_id: user._id,
        username: user.username,
        hasQueue: user.hasQueue
    })
}

export async function getUserBeatmaps(user_id:string, account_token:string) {
    let user:modwebUser = await database.users.findOne({_id: user_id })
    if (user == null) return Promise.reject({ code: 404, message: "User not found! "});
    
    if (account_token == undefined || account_token == "undefined") return Promise.reject({ code: 404, message: "Missing account token!"})

    if (user["account_token"] != account_token) throw { code: 400, message: "Invalid account token!" }

    let maps = await fetchUserBeatmaps(user_id);

    return Promise.resolve(maps)
}

export async function getUserNotifications(user_id:string, account_token:string) {
    let user:modwebUser = await database.users.findOne({_id: user_id })
    if (user == null) return Promise.reject({ code: 404, message: "User not found! "});
    
    if (account_token == undefined || account_token == "undefined") throw{ code: 404, message: "Missing account token!"}

    if (user["account_token"] != account_token) throw { code: 400, message: "Invalid account token!" }

    return user.notifications
}

export async function processNotification(user_id:string, notification_id:string, account_token:string, res:expressTypes.Response) {
    try {
        let user:modwebUser = await database.users.findOne({_id: user_id })
        if (user == null) return res.send({ code: 404, message: "User not found! " })
        
        if (account_token == undefined || account_token == "undefined") return res.send({ code: 404, message: "Missing account token!"})
    
        if (user["account_token"] != account_token) return res.send({ code: 400, message: "Invalid account token!" })

        let notification = user.notifications.filter(n => n.id == notification_id)[0];
    
        if (notification == undefined) return res.status(404).send(sendErrorPage({ code: 404, message: "Notification not found or already validated." }))

        user.notifications.splice(user.notifications.findIndex(n => n.id == notification.id), 1)

        await database.users.findOneAndUpdate({ _id: user_id }, { notifications: user.notifications })
    
        return res.redirect(notification.redirect)
    } catch(e) {
        return res.send(e)
    }
}

export async function lookupWebsite() {
    let queues:Array<Object> = await database.queues.find({open: true })
    let users:Array<Object> = await database.users.find()

    return Promise.resolve({
        queues_size: queues.length,
        users_size: users.length
    })
}

export async function listQueues(req:expressTypes.Request, res:expressTypes.Response) {
    try {
        let search = req.query;
        let keys = Object.create({})

         Object.keys(search).forEach((key) => {
            if (search[key] != "any") {
                if (search[key] == undefined) return;
                if (search[key] == "") return;
                keys[key] = search[key];
            }
        });

        let queues = await database.queues.find(keys)

        return res.status(200).send(queues)
    } catch (error) {
        console.error(error)
        return res.status(500).send({code: 500, message: "Internal server error" })
    }
}