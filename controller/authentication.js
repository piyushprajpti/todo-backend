import User from "../schema/User.js";

// signup
export const signup = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    let result;

    try {

        if (name.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword === "") {
            throw { message: "Fields can't be empty." }
        }
        if (email.indexOf("@") === -1) {
            throw { message: "Invalid email address." }
        }
        if (password.length < 5) {
            throw { message: "Weak password. Please use a strong password." }
        }
        if (password !== confirmPassword) {
            throw { message: "Password mismatch." }
        }

        result = await User.findOne({ email: email });

        if (result !== null) {
            throw { message: "User already exist. Login to continue." }
        }

        result = await User.create({ name: name, email: email, password: password });
        res.send("Account created successfully. Login to continue.");

    } catch (error) {
        res.status(422).send(error.message);
    }
}

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
        res.send("Login successfull.");
    } catch (error) {
        res.status(422).send(error.message);
    }
}

// reset password

export const resetpassword = async (req, res, next) => {
    const { email, otp, password, confirmPassword } = req.body;

    let result;

    try {
        if (email.trim() === "") {
            throw { message: "Email can't be empty." }
        }

        result = await User.findOne({ email: email });

        if (email.indexOf("@") === -1 || result === null) {
            throw { message: "Invalid email address" }
        }
        if (otp.trim() === "" || otp !== "123") {
            throw { message: "Incorrect OTP. Please try again." }
        }
        if (password.trim() === "" || confirmPassword.trim() === "") {
            throw { message: "Password can't be empty" }
        }
        if (password.length < 5) {
            throw { message: "Weak password. Please choose a strong password." }
        }
        if (password !== confirmPassword) {
            throw { message: "Password mismatch." }
        }

        await User.updateOne({ email: email }, { password: password });
        res.send("Password reset successfull. Login to continue");

    } catch (error) {
        res.status(422).send(error.message);
    }
}