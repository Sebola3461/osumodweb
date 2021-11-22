import * as expressTypes from "express";
import bodyParser from "body-parser";
import { validateRefreshToken, validateUser } from "./functions/auth";
import { getUser, getUserBeatmaps, listQueues, searchQueues } from "./functions/public";
import webpush from "web-push";
import { subscribePushNotifications } from "./functions/push";
import { createQueue } from "./functions/queues";
import { getQueue } from "../database/functions/queues";
webpush.setVapidDetails(`mailto:${process.env.NOTIFICATIONS_MAIL}`, `${process.env.NOTIFICATIONS_PUBLIC_KEY}`, `${process.env.NOTIFICATIONS_PRIVATE_KEY}`);

export default function apiRoutes(app:expressTypes.Application) {
    app.get("/api/validate/",  (req, res) => {
        validateUser(req.query["code"]?.toString() || "undefined", res)
    })

    app.post("/api/refresh_token", bodyParser.json(), (req, res) => {
        validateRefreshToken(req, res)
    })

    app.get("/api/users/:user_id",  (req, res) => {
        getUser(req.params["user_id"]).then(user => {
            res.status(200).send(user)
        }).catch(e => {
            res.status(404).send(e)
        })
    })

    app.get("/api/queue/:queue_id",  (req, res) => {
        getQueue(req.params["queue_id"]).then(queue => {
            res.status(200).send(queue)
        }).catch(e => {
            res.status(404).send(e)
        })
    })

    // KmBYb/B3+av5kbF0caMj

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

    app.post("/api/createqueue", bodyParser.json(), (req, res) => {
        createQueue(req, res)
    })

    app.get("/api/listing/", (req,res) => {
        listQueues(req, res)
    })

    app.get("/api/search/", (req,res) => {
        searchQueues(req, res)
    })

    console.log("[Api]".bgYellow.black + "Running!".bgGreen.black)
}