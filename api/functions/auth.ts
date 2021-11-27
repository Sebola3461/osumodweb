import * as database from "./../../database/database";
import * as expressTypes from "express";
import { createNewUser, editTokens, getUser, updateRefreshToken } from "../../database/functions/users";
import { getUserInfo, getUserToken } from "./requests/osu";

export async function validateUser(userToken:string, res:expressTypes.Response) {
    let userResponse = await getUserToken(userToken);

    // ?             has a request status == error
    if (userResponse.access_token == undefined) return res.status(400).send(userResponse);

    let osuUser = await getUserInfo(userResponse.access_token);
    let user = await getUser(osuUser.id.toString());

    if (user == null) return createNewUser(osuUser, userResponse).then((createdUser) => {
        return res.status(200).send(createdUser);
    })

    await editTokens(user._id, user.account_token, userResponse.access_token, userResponse.refresh_token)

    res.status(200).send(user)
}

export async function validateRefreshToken(req:expressTypes.Request, res:expressTypes.Response) {
    try {
        if (req.headers["authorization"] == undefined) return res.status(401).send({ code: 401,  message: "Missing authorization header." })
        if (req.body["user_id"] == undefined) return res.status(401).send({ code: 401, message: "Missing userId."});
    
        let result = await updateRefreshToken(req.body["user_id"], req.headers["authorization"]);
        let user = await getUser(req.body["user_id"]);

        return Promise.resolve(res.status(200).send({
            result,
            user
        }));
    } catch (error) {
        return Promise.resolve(res.status(401).send(error))
    }
}