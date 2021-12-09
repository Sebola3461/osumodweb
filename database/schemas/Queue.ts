import { Schema } from "mongoose";

export default new Schema({
    _id: {
        type: String
    },
    banner: {
        type: String,
        default: "/static/assets/images/genericbg.jpg"
    },
    name: {
        type: String
    },
    open: {
        type: Boolean,
        default: false
    },
    stats: {
        type:Object,
        default: {
            rejected: 0,
            accepted: 0,
            finished: 0,
            pending: 0
        }
    },
    m4m: {
        type: Boolean,
        default: false
    },
    cooldown: {
        type: Number,
        default: 0
    },
    rules: {
        type: String,
        default: "Welcome to my queue!"
    },
    modes: {
        type: Array,
        default: [0]
    },
    autoclose: {
        type: Object,
        default: { enable: true, size: 5 }
    },

    // ? this queue accepts:
    genres: {
        type: Array,
        default: ["Video Game", "Anime", "Rock", "Pop", "Other", "Novelty", "Hip Hop", "Electronic", "Metal", "Classical", "Folk", "Jazz"]    
    },
    languages: {
        type: Array,
        default: ["English", "Chinese", "French", "German", "Italian", "Japanese", "Korean", "Spanish", "Swedish", "Russian", "Polish", "Instrumental", "Other"]    
    },
    blacklist: {
        type: Object,
        default: {
            users: [],
            artists: []
        }
    },
    isBn: {
        type: Boolean,
        default: false
    },
    country: {
        type: Object,
        default: {
            code: String,
            name: String,
            flag_url: String
        }
    },
    requests: {
        type: Array,
        default: []
    }
})