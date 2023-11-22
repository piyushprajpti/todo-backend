import User from "../schema/User.js";


export const signUp = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    let result;

    try {
        result = await User.create({name: name, email: email, password: password});
    } catch (error) {
        result = error;
    }

    res.send(result);
}