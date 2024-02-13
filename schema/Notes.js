import { Schema, model } from "mongoose";

const schema = new Schema({
    userid: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    }
}, {
    collection: "notes",
    versionKey: false
})

export default model("Notes", schema);