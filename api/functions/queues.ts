/**
 * *============================== Queues.ts
 * ? Queue manager core
 * ? This will be used by routes.ts
 */

import * as database from "../../database/database";
import * as expressTypes from "express";
import { getUser } from "../../database/functions/users";
import {beatmapRequest, createQueueRequest, osuApiBeatmap, queueAutoclose, queueRequests} from "./../../types/types";
import { createNewQueue } from "../../database/functions/queues";
import { getBeatmap, getUserInfo } from "./requests/osu";
import * as crypto from "crypto";
import { sendRequestNotification, sendRequestUpdateNotification } from "./push";

// ? See the function name
export async function createQueue(req:expressTypes.Request, res:expressTypes.Response) {
    console.log("[Queues] -> createQueue".black.bgYellow.concat("Creating a new queue!".black.bgCyan))
    const data:createQueueRequest = req.body;
    const authorization = req.headers["authorization"];

    // ? Save user data
    let requestedUser = await database.users.findOne({_id: data["user_id"] });
    let requestedUserData = await getUserInfo(requestedUser.access_token)

    if (requestedUser == null) {
        console.log("[Queues] -> createQueue".black.bgYellow.concat(`Someone tried to create a queue, but this user does not exists!`.black.bgRed))

        return res.status(401).send({ code: 400, message: "Register before create a queue!" })
    }

    // ? Check if the user already have a queue
    let staticUserQueue = await database.queues.findOne({ _id: data["user_id"] });
    if (staticUserQueue != null) {
        console.log("[Queues] -> createQueue".black.bgYellow.concat(`${requestedUser.username} tried to create a queue again, but this user already have a queue!`.black.bgRed))

        return res.status(401).send({ code: 400, message: "You already have a queue!" })
    }

    // ? Check account token
    if (requestedUser.account_token != authorization) {
        console.log("[Queues] -> createQueue".black.bgYellow.concat(`${requestedUser.username} tried to create a queue, but an invalid account token has provided!`.black.bgRed))

        return res.status(401).send({ code: 401, message: "Unauthorized, invalid account_token provided." })
    }

    // ? Create the queue :3
    createNewQueue(data, requestedUserData).then(r => {
        console.log("[Queues] -> createQueue".black.bgYellow.concat(`${requestedUser.username} has a queue now!`.black.bgRed))

        return res.status(201).send(r)
    }).catch(e => {
        console.log("[Queues] -> createQueue".black.bgYellow.concat(`${requestedUser.username} tried to create a queue again, but something is wrong: ${e.message}!`.black.bgRed))

        return res.status(500).send(e)
    })
}

/**
 * * This function will manage requests to queues
 * TODO: Remove push notifications verification and pass to push.ts
 */
export async function requestBeatmapToQueue(req:expressTypes.Request, res:expressTypes.Response) {
    try {
        let authorization = req.headers["authorization"] || "undefined";
        let body:beatmapRequest = req.body;

        console.log("[Queues] -> requestBeatmapToQueue".black.bgYellow.concat("Requesting a new beatmap to queue!".black.bgCyan))
    
        // * ========================== check input data <<<<<<<<<<<<<<<<<<

        if (authorization == undefined) {res.status(401).send({ code: 401, message: "Missing or invalid authorization"});}
    
        if (!body["user_id"]) {
            console.log("[Queues] -> requestBeatmapToQueue".black.bgYellow.concat("Someone tried to request a beatmap but does not provided a valid user_id!".black.bgRed))
            return res.status(400).send({ code: 400, message: "Missing user_id field"});
        }
    
        if (!body["queue_id"]) {
            console.log("[Queues] -> requestBeatmapToQueue".black.bgYellow.concat("Someone tried to request a beatmap but does not provided a valid queue_id!".black.bgRed))
            return res.status(400).send({ code: 400, message: "Missing queue_id field"});
        }
        
        if (!body["beatmap_id"]) {
            console.log("[Queues] -> requestBeatmapToQueue".black.bgYellow.concat("Someone tried to request a beatmap but does not provided a valid beatmap_id!".black.bgRed))
            return res.status(400).send({ code: 400, message: "Missing beatmap_id field"});
        }
    
        if (!body["comment"]) {
            console.log("[Queues] -> requestBeatmapToQueue".black.bgYellow.concat("Someone tried to request a beatmap but does not provided a valid comment!".black.bgRed))
            return res.status(400).send({ code: 400, message: "Missing comment field"});
        }
    
        // ? Save request owner and queue data
        let requestOwner = await database.users.findOne({_id: body["user_id"] });
        let requestQueue = await database.queues.findOne({ _id: body["queue_id"] });
    
        // ? Check if the requester exists
        if (requestOwner == null) return res.status(404).send({ code: 404, message: "User not found!"})
    
        // ? Check the account token
        if (authorization != requestOwner.account_token) res.status(401).send({ code: 401, message: "Invalid account_token/authorization"});
    
        // ? Check if the queue exists
        if (requestQueue == null) return res.status(404).send({ code: 404, message: "Queue not found!"})
        
        // ? Check if queue is open
        if (requestQueue.open == false) return res.status(403).send({ code:403, message: "This queue is closed!" })
    
        // ? Get requested beatmap data
        let requestedBeatmap:osuApiBeatmap = await getBeatmap(requestOwner.access_token, body["beatmap_id"]);
    
        // ? check if the queue accepts the beatmap language and genre =================================
        if (!requestQueue.languages.includes(requestedBeatmap.language.name)) return res.status(403).send({code:403, message: "This queue does not accept this language, sorry (Check if you selected the beatmap genre and language in osu! website)"});
    
        if (!requestQueue.genres.includes(requestedBeatmap.genre.name)) return res.status(403).send({code:403, message: "This queue does not accept this genre, sorry (Check if you selected the beatmap genre and language in osu! website)"});
    
        // ? Check if the map is pending or accepted in the queue =================================
        let requests:queueRequests = requestQueue.requests;
    
        if (requests.filter(r => r.beatmap.id.toString() == body["beatmap_id"] && r.status == "pending").length > 0) return res.status(403).send({ code: 403, message: "This beatmap has already been requested." })

        // ? Check if the queue accepts this beatmap playmode
        if (checkMode() == false) return res.status(400).send({ code: 400, message: "This queue does not accept this playmode"})

        // * ================================= Create request data <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        // ? Generate a id for the request =================================
        let request_id = generateId()
    
        // ? Create a request object and push to "requests" variable
        requests.push({
            id: request_id,
            status: "pending",
            date: new Date(),
            owner: {
                id: requestOwner.id,
                username: requestOwner.username
            },
            comment: body["comment"],
            reply: "",
            beatmap: requestedBeatmap
        })
    
        // ? Update queue data =================================
        await database.queues.findOneAndUpdate({_id: requestQueue._id }, {
            requests: requests,
            stats: getStats(),
            open: checkAutoclose()
        })

        // ? Update user requests history =================================
        let userRequests:queueRequests = requestOwner.requests;

        userRequests.push({
            id: request_id,
            status: "pending",
            date: new Date(),
            queue_id: body["queue_id"],
            owner: {
                id: requestOwner.id,
                username: requestOwner.username
            },
            comment: body["comment"],
            reply: "",
            beatmap: requestedBeatmap
        })

        await database.users.findOneAndUpdate({ _id: requestOwner.id }, { requests: userRequests })
    
        // * ================================= Functions <<<<<<<<<<<<<<<<<<<<<<
        
        // ? Check autoclose
        function checkAutoclose() {
            let autoclose:queueAutoclose = requestQueue.autoclose;
                if (autoclose.enable == true) {
                if (requests.length >= autoclose.size) return false;
                return true;
            } else {
                return true;
            }
        }
    
        // ? Generic id generator function
        function generateId() {
            return crypto.randomBytes(30).toString("hex").slice(0, 40)
        }

        // ? Get queue updated statistics, its used when a new request is done
        function getStats() {
            return {
                "rejected": requests.filter(r => r.status == "rejected").length,
                "accepted": requests.filter(r => r.status == "accepted").length,
                "finished": requests.filter(r => r.status == "finished").length,
                "pending": requests.filter(r => r.status == "pending").length
              }
        }

        // ? Check if the queue accepts this beatmap playmode
        function checkMode() {
            let pass = false; // ? If this number == 0, the queue doesnt accepts this mode

            let modesList:Array<string> = ["osu", "taiko", "fruits", "mania"];

            requestedBeatmap.beatmaps.forEach(b => {
                if (requestQueue.modes.includes(b.mode_int.toString())) pass = true;
            })

            return pass;
        }

        // ? Send notification to queue owner
        try {
            let queueOwner = await database.users.findOne({ _id: requestQueue._id })
            sendRequestNotification(queueOwner, requestQueue, requestedBeatmap)
        } catch(e) {
            console.error(e)
        }
    
        return res.status(200).send(requests.pop())
    } catch(e) {
        return res.send(e)
    }
}

// ? Update beatmap request inside a queue
export async function updateRequest(req:expressTypes.Request, res:expressTypes.Response) {
    try {
        let queue_id = req.body["queue_id"];
        let request_id = req.body["request_id"];
        let authorization = req.headers["authorization"];
    
        // * ========================== check input data <<<<<<<<<<<<<<<<<<
        if (queue_id == undefined) throw { code: 400, message: "Missing queue id!" }
        if (request_id == undefined) throw { code: 400, message: "Missing request id!" }
        if (authorization == undefined) throw { code: 400, message: "Missing authorization!" }
    
        // ? Check if the queue owner exists
        let queue_owner = await database.users.findOne({_id: queue_id });
        if (queue_owner == null) throw { code: 403, message: "Queue not found!" };
    
        // ? Check account token
        if (authorization != queue_owner.account_token) throw { code: 401, message: "Invalid token!" }
    
        // ? Check the request body
        if (!req.body) throw { code: 400, message: "Missing request body!" }
    
        // ? Check if the queue exists
        let queue = await database.queues.findOne({ _id: queue_id });
        if (queue == null) throw { code: 403, message: "Queue not found!" }
        
        // ? Save current queue requests
        let requests:queueRequests = queue.requests;
    
        // ? Check the requesed action
        if (req.body["action"] == undefined) throw { code: 400, message: "Missing action field." }
    
        // * ========================== Update request data <<<<<<<<<<<<<<<<<<
        try {
            switch(req.body["action"]) {
                case "reject":
                    await updateStatus("rejected", req.body["reply"])
                    break;
                case "accept":
                    await updateStatus("accepted", req.body["reply"])
                    break;
                case "finish":
                    await updateStatus("finished", req.body["reply"])
                    break;
                default:
                    throw { code: 400, message: "Invalid or missing action." }
            }
        } catch(e) {
            throw e;
        }
    
        // * ========================== functions <<<<<<<<<<<<<<<<<<

        // ? This will update the request data
        async function updateStatus(status:string, reply:string | undefined) {

            // ? check request data
            let index = requests.findIndex(r => r.id == request_id);
            if (index < 0) throw { code: 403, message: "Request not found!" };
            if (requests[index].status == status) throw { code: 400, message: `This map is already ${status}` };
            
            // ? Check if the queue owner has replied the request
            if (reply != undefined) {
                if (reply.trimStart().trimEnd() != "") requests[index].reply = reply;
            }

            // ? Update request data
            requests[index].status = status;
            requests[index].date = new Date();

            // ? Update queue statistics too
            function getStats() {
                return {
                    "rejected": requests.filter(r => r.status == "rejected").length,
                    "accepted": requests.filter(r => r.status == "accepted").length,
                    "finished": requests.filter(r => r.status == "finished").length,
                    "pending": requests.filter(r => r.status == "pending").length
                  }
            }

            // ? Save data
            await database.queues.findOneAndUpdate({ _id: queue_id }, { requests: requests, stats: getStats() })
            sendRequestUpdateNotification(requests[index].owner.id, queue, status, requests[index].beatmap)

            return requests;
        }
    
        return res.status(200).send({ code: 200, message: "Status updated!" })
    } catch(e) {
        return res.send(e)
    }
}

// ? This function will update queue configs and params
export async function updateQueueConfig(req:expressTypes.Request, res:expressTypes.Response) {
    try {
        let authorization = req.headers["authorization"];
        let queue_id = req.body["queue_id"];
        let options = req.body["options"];
    
        // * ================= Check request data <<<<<<<<<<<<
        if (!queue_id) {
            return res.status(400).send({ code: 400, message: "Invalid queue id provided!"})
        }
        if (!options) {
            return res.status(400).send({ code: 400, message: "Invalid options provided!"})
        }
        if (!authorization) {
            return res.status(400).send({ code: 400, message: "Invalid account token provided!"})
        }
    
        // ? Save queue and user data
        let queue = await database.queues.findOne({ _id: queue_id })
        let user = await database.users.findOne({ _id: queue_id })
    
        // ? Check queue and user data
        if (queue == null) {
            return res.status(404).send({ code:404, message: "Queue not found!" })
        }
    
        if (user == null) {
            return res.status(404).send({ code:404, message: "User not found!" })
        }
    
        // ? Check authorization
        if (authorization != user.account_token) {
            return res.status(401).send({ code: 401, message: "Unauthorized."})
        }
    
        // * ================= Update queue data <<<<<<<<<<<<
    
        const blacklist:Array<string> = ["name", "_id", "isBn", "requests", "banner", "country", "stats"]
        Object.keys(options).forEach(option => {
            if (queue[option] == undefined) return;
            if (blacklist.includes(option)) return;
            queue[option] = options[option];
        }) // ? Bruh, dumb be like
    
        await database.queues.findOneAndUpdate({ _id: queue_id }, queue)
    
        return res.status(200).send({ code: 200, message: "Saved!" })
    } catch(e) {
        console.error(e);
        res.send(e)
    }
}