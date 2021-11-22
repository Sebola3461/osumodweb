import * as database from "../../database/database";
import * as expressTypes from "express";
import { getUser } from "../../database/functions/users";
import {createQueueRequest} from "./../../types/types";
import { createNewQueue } from "../../database/functions/queues";
import { getUserInfo } from "./requests/osu";

export async function createQueue(req:expressTypes.Request, res:expressTypes.Response) {
    const data:createQueueRequest = req.body["data"];
    const authorization = req.headers["authorization"];

    if (data == undefined) return res.status(400).send({ code: 400, message: "Missing body data field" })
    
    if (data["maxpending"] == undefined || data["maxpending"] < 0) return res.status(400).send({ code: 400, message: "Invalid maxpending field value" }) 

    if (data["maxpending"] == undefined || data["maxpending"] > 60) return res.status(400).send({ code: 400, message: "Invalid maxpending field value" }) 

    if (data["cooldown"] == undefined || data["cooldown"] < 0) return res.status(400).send({ code: 400, message: "Invalid cooldown field value" }) 

    if (data["cooldown"] == undefined || data["cooldown"] > 60) return res.status(400).send({ code: 400, message: "Invalid cooldown field value" }) 

    if (data["color"] == undefined || data["color"] > 360) return res.status(400).send({ code: 400, message: "Invalid color field value" }) 

    if (data["modes"] == undefined || data["modes"].length < 0) return res.status(400).send({ code: 400, message: "Invalid modes value" }) 

    if (data["modes"] == undefined || data["modes"].length > 4) return res.status(400).send({ code: 400, message: "Invalid modes value" }) 

    if (checkModes().length > 0) return res.status(400).send({ code: 400, message: "Invalid modes value" }) 

    // ? This will return invalid modes
    function checkModes() {
        let _r:Array<number> = [];
        data["modes"].forEach(mode => {
            if (mode > 3) _r.push(mode)
            if (mode < 0) _r.push(mode)
        });

        return _r;
    }

    data["rules"] = data["rules"].replace("<script>", "");

    let requestedUser = await getUser(data["user_id"]);
    let requestedUserData = await getUserInfo(requestedUser.access_token)

    if (requestedUser.account_token != authorization) return res.status(401).send({ code: 401, message: "Unauthorized, invalid account_token provided." })

    createNewQueue(data, requestedUserData).then(r => {
        return Promise.resolve(res.status(200).send(r))
    }).catch(e => {
        return Promise.resolve(res.status(500).send(e))
    })
}