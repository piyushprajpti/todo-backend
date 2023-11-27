import { Schema, model } from "mongoose";

const schema = new Schema({
    userid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    collection: "notes",
    versionKey: false
})

export default model("Notes", schema);