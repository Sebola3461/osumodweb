import * as expressTypes from "express";
import * as database from "../../database/database";

export async function updateUserPushScopes(req:expressTypes.Request, res:expressTypes.Response) {
    try {
        let authorization = req.headers["authorization"];
        let enable = req.body["enable"];
        let scopes = req.body["scopes"];
        let user_id = req.body["user_id"];
    
        let user = await database.users.findOne({ _id: user_id });
    
        if (!enable) return res.status(400).send({ code: 400, message: "Missing body 'options' field!" })

        if (!scopes) return res.status(400).send({ code: 400, message: "Missing body 'options' field!" })
    
        if (!authorization) return res.status(400).send({ code: 400, message: "Missing account_token!" })
    
        if (user == null) return res.status(404).send({ code: 404, message: "User not found!" });
    
        if (user.account_token != authorization) return res.status(401).send({ code: 401, message: "Unauthorized" });

        user.push["enable"] = enable;
        user.push["scopes"] = scopes;
    
        await database.users.findOneAndUpdate({ _id: user_id }, user)
    
        return res.status(200).send({ user: user, code:200, message: "Configuration updated!"})
    } catch(e) {
        return res.send(e)
    }
}