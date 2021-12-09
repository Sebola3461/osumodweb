import { Schema } from "mongoose";

export default new Schema({
    _id: {
        type: String
    },
    username: {
        type: String
    },
    hasQueue: {
        type: Boolean,
        default: false
    },
    banner: {
        type: String,
        default: "/static/assets/images/genericbg.jpg"
    },
    isBn: {
        type: Boolean,
        default: false
    },
    country: {
        type: Object,
        default: {
            name: "Undefined",
            code: "undefined"
        }
    },
    account_token: {
        type: String
    },
    access_token: {
        type: String,
    },
    refresh_token: {
        type: String,
    },
    push:{
        type: Object,
        default: {}
    },
    requests: {
        type: Array,
        default: []
    },
    session: {
        type: Object,
        default: {
            online: false,
            currentId: "",
            date: Date
        }
    },
    notifications: {
        type: Array,
        default: []
    }
})