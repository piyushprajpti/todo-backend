import { Schema, model } from "mongoose";

const schema = new Schema({
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
}, {
    collection: "token",
    versionKey: false,
    timestamps: true
});

schema.index({updatedAt: 1}, {expireAfterSeconds: 300});

export default model("Token", schema);