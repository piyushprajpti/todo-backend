import User from "../schema/User.js";

// signup
export const signup = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    let result;

    try {
        // if (name.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword ==="") {

        // }


        result = await User.findOne({ email: email });

        if (result === null) result = await User.create({ name: name, email: email, password: password });
        else result = "user already exist";

    } catch (error) {
        result = error;
    }

    res.send(result);
}

// login
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    let result;

    try {
        result = await User.findOne({ email: email, password: password });

        if (result === null) result = "invalid input"
    } catch (error) {
        console.log(error);
    }

    res.send(result);
}