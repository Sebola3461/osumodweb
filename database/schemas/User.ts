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
    notifications: {
        type: Array,
        default: []
    }
})