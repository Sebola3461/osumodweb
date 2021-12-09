import dotenv from "dotenv";
dotenv.config()
import express from 'express';
import "./database/database";
import * as api from "./api/routes";
import "colors";
import { getQueuePage } from "./functions/getQueue";
import { sendErrorPage } from "./errors";
const app = express()
app.use("/static/", express.static(__dirname.concat("/static")))

// *================ WEBSITE ROUTES ====================*
app.get("/", (req, res) => {
    console.log("[Routes]".bgYellow.black + "A new access has been requested".bgBlue.black)
    res.sendFile(__dirname.concat("/views/index.html"))
})

app.get("/settings", (req, res) => {
    console.log("[Routes]".bgYellow.black + "A new access has been requested".bgBlue.black)
    res.sendFile(__dirname.concat("/views/options.html"))
})

app.get("/queue/:user", (req, res) => {
    console.log("[Routes]".bgYellow.black + "A new queue has been requested".bgBlue.black)
    getQueuePage(req.params["user"]).then((queue) => {
        res.status(200).send(queue);
    }).catch(e => {
        res.status(e["code"] || 500 ).send(sendErrorPage(e))
    })
})

// ? send page icon
app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/favicon.ico")
})

// ? send notification worker
app.get("/worker.js", (req, res) => {
    res.sendFile(__dirname + "/static/js/worker.js")
})

// ? login endpoint
app.get("/validateme", (req, res) => {
    res.sendFile(__dirname + "/views/auth.html")
})

api.default(app);

app.listen(3000 || process.env.PORT, () => {
    console.log("[Server]".bgYellow.black.concat("Running!".bgGreen.black))
})