import { Schema } from "mongoose";

export default new Schema({
    _id: {
        type: String
    },
    name: {
        type: String
    },
    open: {
        type: Boolean,
        default: false
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
    hue: {
        type: Number,
        default: 200
    },
    autoclose: {
        type: Object,
        default: { enable: false, size: 0 }
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
    isBn: {
        type: Boolean,
        default: false
    },
    requests: {
        type: Array,
        default: []
    }
})