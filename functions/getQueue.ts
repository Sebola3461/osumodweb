import * as database from "./../database/database";
import  {readFileSync} from "fs";

export async function getQueuePage(user:string) {
    try {
        let requestedUser = new Number(user).valueOf();
        let query = {};
    
        if (isNaN(requestedUser)) {
            query = {
                name: user
            }
        } else {
            query = {
                _id: user
            }
        }
    
        let queue = await database.queues.findOne(query);

        if (queue == null) throw { code: 404, message: "Queue not found!"}

        // ? Send formatted html with user data
        async function formatHTML() {
            let html = readFileSync(__dirname.concat("/../views/queue.html"), "utf8")
            html = html.replace("{username}", queue.name).replace('"--queuecolor--"', queue.hue).replace('"--queuecolor--"', queue.hue)
            return Promise.resolve(html);
        }

        let html = await formatHTML()
    
        return html
    } catch (error) {
        throw error
    }
}