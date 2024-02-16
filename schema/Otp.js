import { Schema, model } from "mongoose";

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
}, {
    collection: "otp",
    versionKey: false,
    timestamps: true
});

schema.index({updatedAt: 1}, {expireAfterSeconds: 300});

export default model("Otp", schema);