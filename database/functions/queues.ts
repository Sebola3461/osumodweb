import {osuUserApiResponse, createQueueRequest } from "../../types/types";
import * as database from "./../database";

export async function createNewQueue(queueData:createQueueRequest, requestedUser:osuUserApiResponse) {
    console.log("[Database]".bgYellow.black + "Creating a queue! %s (%s)".bgYellow.black, requestedUser.username, queueData.user_id)

    try {
        let newQueue = new database.queues({
            _id: queueData.user_id,
            name: requestedUser.username,
            m4m: true,
            country: {
                code: requestedUser.country.code.toLowerCase(),
                name: requestedUser.country.name,
                flag_url: `https://flagcdn.com/${requestedUser.country.code.toLowerCase()}.svg`
            },
            banner: requestedUser.cover.custom_url,
            cooldown: 5,
            rules: "### Hello, welcome to my queue!",
            modes: [0],
            isBn: await checkBn()
        })
        
        await newQueue.save()

        await database.users.findOneAndUpdate({ _id: queueData.user_id }, {hasQueue:true})

        console.log("[Database]".bgYellow.black + "New new queue created! %s (%s)".bgGreen.black, requestedUser.username, queueData.user_id)

        async function checkBn() {
            let groups = requestedUser.groups;
            let _r = false;
            
            groups.forEach(g => {
                if (g.identifier == "lvd") return _r = true;
                if (g.identifier == "nat" || g.identifier == "bn") return _r = true;
            })

            return _r;
        }

        return {
            _id: queueData.user_id,
            name: requestedUser.safe_username,
            m4m: true,
            country: {
                code: requestedUser.country.code.toLowerCase(),
                name: requestedUser.country.name,
                flag_url: `https://flagcdn.com/${requestedUser.country.code.toLowerCase()}.svg`
            },
            banner: requestedUser.cover.custom_url,
            cooldown: 5,
            autoclose: 5,
            rules: "### Hello, welcome to my queue!",
            modes: [0],
            isBn: await checkBn()
        }
    } catch(error) {
        console.error(error)
        throw error
    }
}

export async function getQueue(queue_id:string) {
    try {
        let requestedQueue = await database.queues.findOne({ _id: queue_id });
        if (!requestedQueue) throw { code: 404, message: "Queue not found!" };

        return requestedQueue
    } catch (error) {
        throw error;
    }
}