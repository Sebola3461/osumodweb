import * as database from "../../database/database";
import * as expressTypes from "express";
import { modwebUser, searchQueueRequest } from "../../types/types";
import { fetchUserBeatmaps } from "./requests/osu";

export async function getUser(user_id:string) {
    let user:modwebUser = await database.users.findOne({_id: user_id })
    if (user == null) return Promise.reject({ code: 404, message: "User not found! "});

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

    if (user["account_token"] != account_token) return Promise.reject({ code: 400, message: "Invalid account token!" })

    let maps = await fetchUserBeatmaps(user_id);

    return Promise.resolve(maps)
}

export async function listQueues(req:expressTypes.Request, res:expressTypes.Response) {
    try {
        let search = req.query;
        let keys = Object.create({})

        let searchObject = Object.keys(search);

        searchObject.forEach((key) => {
            if (search[key] != "any") {
                if (search[key] == undefined) return;
                keys[key] = search[key];
            }
        });

        let queues = await database.queues.find(keys);
        return Promise.resolve(res.status(200).send(queues))
    } catch (error) {
        console.error(error)
        return Promise.resolve(res.status(500).send({code: 500, message: "Internal server error" }))
    }
}

export async function searchQueues(req:expressTypes.Request, res:expressTypes.Response) {
    try {
        let search = req.query;
        let name = req.query["username"]?.toString().toLowerCase() || "undefined";
        let keys = Object.create({})

        if (name == "undefined") return Promise.resolve(res.status(401).send({ code: 401, message: "Provide a valid username" }))

        let searchObject = Object.keys(search);

        searchObject.forEach((key) => {
            if (search[key] != "any") {
                if (search[key] == undefined) return;
                keys[key] = search[key];
            }
        });

        let queues = await database.queues.find(keys);

        queues = queues.filter(q => q.name.toLowerCase().includes(name) == true)
        return Promise.resolve(res.status(200).send(queues))
    } catch (error) {
        return Promise.resolve(res.status(500).send({code: 500, message: "Internal server error" }))
    }
}