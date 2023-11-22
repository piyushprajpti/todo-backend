import { Schema, model } from "mongoose";

const schema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    collection: "user",
    versionKey: false
})

export default model("User", schema);