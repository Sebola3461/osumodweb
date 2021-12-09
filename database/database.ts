import mongoose from "mongoose";
import User from "./schemas/User";
import Queue from "./schemas/Queue";
import "colors";

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zv5wv.mongodb.net/${process.env.DB_NAME}`, (err) => {
    if (err) return console.log(err);
    console.log('[Database]'.bgYellow.black + "Conected!".bgGreen.black)
})

export const users = mongoose.model("Users", User);
export const queues = mongoose.model("Queues", Queue);