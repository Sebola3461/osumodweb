import {osuUserApiResponse, createQueueRequest } from "../../types/types";
import * as database from "./../database";

export async function createNewQueue(queueData:createQueueRequest, requestedUser:osuUserApiResponse) {
    console.log("[Database]".bgYellow.black + "Creating a queue! %s (%s)".bgYellow.black, requestedUser.username, queueData.user_id)

    try {
        let newQueue = new database.queues({
            _id: queueData.user_id,
            name: requestedUser.username,
            m4m: queueData.m4m,
            cooldown: queueData.cooldown,
            autoclose: queueData.maxpending,
            hue: queueData.color,
            rules: queueData.rules,
            modes: queueData.modes,
            isBn: await checkBn()
        })
        
        await newQueue.save()

        await database.users.findOneAndUpdate({ _id: queueData.user_id }, {hasQueue:true})

        console.log("[Database]".bgYellow.black + "New new queue created! %s (%s)".bgGreen.black, requestedUser.username, queueData.user_id)

        async function checkBn() {
            let groups = requestedUser.groups;
            let _r = false;
            
            groups.forEach(g => {
                if (g.identifier == "nat" || g.identifier == "bn") return _r = true;
            })

            return Promise.resolve(_r)
        }

        return Promise.resolve({
            _id: queueData.user_id,
            name: requestedUser.username,
            m4m: queueData.m4m,
            cooldown: queueData.cooldown,
            autoclose: queueData.maxpending,
            hue: queueData.color,
            rules: queueData.rules,
            modes: queueData.modes,
            isBn: await checkBn()
        })
    } catch(error) {
        console.error(error)
        return Promise.reject(error)
    }
}

export async function getQueue(queue_id:string) {
    try {
        let requestedQueue = await database.queues.findOne({ _id: queue_id });
        if (!requestedQueue) return Promise.reject({ code: 404, message: "Queue not found!" });

        return Promise.resolve(requestedQueue)
    } catch (error) {
        return Promise.reject(error)
    }
}