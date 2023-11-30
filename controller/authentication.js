import User from "../schema/User.js";
import Notes from "../schema/Notes.js";

// 1. signup
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
        res.send(result);

    } catch (error) {
        res.status(422).send(error.message);
    }
}

// 2. login
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
        res.send(result);
    } catch (error) {
        res.status(422).send(error.message);
    }
}

// 3. reset password

export const resetpassword = async (req, res, next) => {
    const { email } = req.body;

    let result;

    try {
        if (email.trim() === "" || email.indexOf("@") === -1) {
            throw { message: "Invalid email address" };
        }

        result = await User.findOne({ email: email });

        // const userid = result.data._id;

        res.json({
            code: 1,
            message: "SUCCESS"
        })
    } catch (error) {
        res.status(422).send(error.message);
    }

}

// 4. add note

export const addnote = async (req, res, next) => {
    const { userid, noteid, title, description } = req.body;

    let result;

    try {
        if (noteid) {
            result = await Notes.updateOne({_id: noteid}, {title: title, description: description})
        }
        else {
        result = await Notes.create({ userid: userid, title: title, description: description });
        }

        res.send(result);
    } catch (error) {
        res.status(422).send(error);
    }
}

// 5. delete note 

export const deletenote = async (req, res, next) => {
    const {noteid} = req.body;

    let result;
    try {
        result = await Notes.deleteOne({_id: noteid});

        res.send(result);
    } catch (error) {
        res.send(error);
    }
}

// 6. profile page

export const profilepage = async (req, res, next) => {
    const { userid } = req.body;

    let result;
    try {
        result = await User.findOne({ _id: userid });

        res.send(result)
    } catch (error) {
        res.status(400).send(error);
    }
}

// 7. fetch notes 

export const fetchnotes = async (req, res, next) => {
    const {userid} = req.body;

    let result;
    try {
        result = await Notes.find({userid: userid});

        res.send(result);
    } catch (error) {
        res.status(400).send(error)
    }
}