import User from "../schema/User.js";

// signup
export const signup = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    // let isError = false;
    // const errorObject = {};

    let result;

    try {

        if (name.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword === "") {
            // isError = true;
            // errorObject["EMPTY_FIELD"] = "Fields can't be empty.";
            throw { message: "Fields can't be empty." }
        }
        if (email.indexOf("@") === -1) {
            // isError = true;
            // errorObject["INVALID_EMAIL"] = "Invalid email address.";
            throw { message: "Invalid email address." }
        }
        if (password.length < 5) {
            // isError = true;
            // errorObject["WEAK_PASSWORD"] = "Weak password. Please use a strong password."
            throw { message: "Weak password. Please use a strong password." }
        }
        if (password !== confirmPassword) {
            // isError = true;
            // errorObject["PASSWORD_MISMATCH"] = "Password mismatch.";
            throw { message: "Password mismatch." }
        }

        result = await User.findOne({ email: email });

        if (result !== null) {
            // isError = true;
            // errorObject["USER_ALREADY_EXIST"] = "User already exist. Login to continue."
            throw { message: "User already exist. Login to continue." }
        }
        // if (isError) {
        //     throw {message: errorObject}
        // }

        result = await User.create({ name: name, email: email, password: password });
        res.send("Account created successfully");

    } catch (error) {
        res.status(422).send(error.message);
    }

    // res.send(result);
}

// const sanitizedPayload = (payload) => {


// }

// login
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    let result;

    try {
        if (email.trim() === "" || password.trim() === "") {
            throw { message: "Fields can't be empty." }
        }
        result = await User.findOne({ email: email, password: password });
        if (result === null) {
            throw { message: "Invalid Credentials. Please try again." }
        }
        res.send("Login successfull");
    } catch (error) {
        res.status(422).send(error.message);
    }
}