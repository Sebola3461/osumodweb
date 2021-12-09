import * as expressTypes from "express";
import bodyParser from "body-parser";
import { refreshUser, validateUser } from "./functions/auth";
import { getUser, getUserBeatmaps, getUserNotifications, listQueues, lookupWebsite, processNotification } from "./functions/public";
import webpush from "web-push";
import { subscribePushNotifications } from "./functions/push";
import { createQueue, requestBeatmapToQueue, updateQueueConfig, updateRequest } from "./functions/queues";
import { getQueue } from "../database/functions/queues";
webpush.setVapidDetails(`mailto:${process.env.NOTIFICATIONS_MAIL}`, `${process.env.NOTIFICATIONS_PUBLIC_KEY}`, `${process.env.NOTIFICATIONS_PRIVATE_KEY}`);

import * as io from "socket.io";
import { updateUserPushScopes } from "./functions/users";

export default function apiRoutes(app:expressTypes.Application) {
    app.post("/api/refresh_token", bodyParser.json(), (req, res) => {
        refreshUser(req, res)
    })

    app.get("/api/users/:user_id",  (req, res) => {
        getUser(req.params["user_id"]).then(user => {
            res.status(200).send(user)
        }).catch(e => {
            res.status(404).send(e)
        })
    })
    app.post("/api/update/user/push", bodyParser.json(),  (req, res) => {
        updateUserPushScopes(req, res)
    })

    app.post("/api/update/queue/settings", bodyParser.json(),  (req, res) => {
        updateQueueConfig(req, res)
    })

    app.post("/api/update/queue/request/", bodyParser.json(),  (req, res) => {
        updateRequest(req, res)
    })

    app.post("/api/queue/request/", bodyParser.json(),  (req, res) => {
        requestBeatmapToQueue(req, res)
    })

    app.get("/api/queue/:queue_id",  (req, res) => {
        getQueue(req.params["queue_id"]).then(queue => {
            res.status(200).send(queue)
        }).catch(e => {
            res.status(404).send(e)
        })
    })

    app.get("/api/beatmaps/:user_id",  (req, res) => {
        let token = req.query["token"]?.toString() || "undefined";

        getUserBeatmaps(req.params["user_id"], token).then(maps => {
            res.status(200).send(maps)
        }).catch(e => {
            res.send(e)
        })
    })

    app.post('/api/notifyme', bodyParser.json(), (req, res)=>{
        subscribePushNotifications(req, res)
    })

    app.get("/api/notifications/:user_id/:notification_id/", (req,res) => {
        let token = req.query["token"]?.toString() || "undefined";
        processNotification(req.params["user_id"], req.params["notification_id"], token, res)
    })

    app.get("/api/notifications/:user_id", (req,res) => {
        let token = req.query["token"]?.toString() || "undefined";
        getUserNotifications(req.params["user_id"], token).then(r => {
            res.send(r)
        }).catch(e => {
            res.send(e)
        })
    })

    app.post("/api/createqueue", bodyParser.json(), (req, res) => {
        createQueue(req, res)
    })

    app.get("/api/listing/", (req,res) => {
        listQueues(req, res)
    })

    app.get("/api/validate", (req, res) => {
        let token:string = req.query["code"]?.toString() || "undefined";
        validateUser(token, res)
    })

    console.log("[Api]".bgYellow.black + "Running!".bgGreen.black)
}