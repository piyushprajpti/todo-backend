import User from "../schema/User.js";
import Notes from "../schema/Notes.js";
import Token from "../schema/Token.js";
import nodeMailer from "nodemailer";
import Handlebars from "handlebars";

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
        res.status(422).send(error);
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
        res.status(422).send(error);
    }
}

// 3. reset password

export const resetpassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        if (email.trim() === "" || email.indexOf("@") === -1) {
            throw { message: "Invalid email address" };
        }

        const result = await User.findOne({ email: email });

        const token = "kdjgnkjegbsdkjngskjd";

        if (result) {

            const doc = await Token.findOneAndUpdate(
                {
                    email: result.email
                },
                {
                    token: token
                },
                {
                    upsert: true,
                    new: true
                }
            );

            await sendResetMail(result, doc.token,
                (message) => {
                    throw { message: message }
                }
                ,
                () => {
                    res.send("Success! If account exist with that email address you will receive an email with password reset insturuction.");
                }
            );
        }


    } catch (error) {

        res.status(422).send(error.message);
    }

}



const sendResetMail = async (user, token, onError, onSuccess) => {
    const mailer = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: "piyushoa2004@gmail.com",
            pass: "yqcnhlzbfkghqdvb"
        }
    });

    const mailBody = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Querry from Customer</title>
    
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');
    
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                float: left;
                width: 100%;
                font-family: 'Ubuntu', sans-serif;
            }
    
            h1 {
                width: 100%;
                color: #2563eb;
                font-size: 40px;
                padding: 10px;
                border-bottom: 2px solid #e7e7e7;
            }
    
            p {
                width: 100%;
                font-weight: 400;
                padding: 20px 10px;
                font-size: 20px;
            }
    
            #header {
                font-size: 30px;
                padding: 20px 10px;
                display: flex;
                align-items: baseline;
            }
    
            div {
                width: 100%;
                align-items: center;
                justify-content: center;
            }
    
            #button {
                margin: 10px;
                text-decoration: none;
                background-color: #2563eb;
                color: white;
                border-radius: 10px;
                padding: 16px 20px;
                font-size: 20px;
                width: fit-content;
    
            }
    
            #footer {
                margin: 25px 0 25px 0;
                background: #bdd2ff;
                font-size: 18px;
                color: black;
                text-align: center;
                padding: 50px 20px;
            }
    
            @media only screen and (max-width: 768px) {
    
                h1 {
                    font-size: 30px;
                }
    
                p {
                    font-weight: 400;
                    font-size: 16px;
                }
    
                #header {
                    font-size: 22px;
                }
    
                #footer {
                    font-size: 12px;
                    padding: 40px;
                    margin-bottom: 100px;
                }
    
            }
        </style>
    </head>
    
    <body>
        <h1>ToDo</h1>
        <p id="header"> Dear <span style="margin-left: 12px; color: #457aed;">{{name}}</span> </p>
        <p>Please click on the below button to reset your password.</p>
        <br>
        <div>
            <a id="button" href="https://www.todo-4406.web.app/createpassword/{{token}}">Reset Password</a>
        </div>
        <p id="footer">
            You have received this message because you have an account associated with this email address on todo-4406.web.app
        </p>
    </body>
    
    </html>
	`;

    const mailBodyTemplate = Handlebars.compile(mailBody);

    const finalMailBody = mailBodyTemplate({
        name: user.name,
        token: token
    });

    const sendMailOptions = {
        from: {
            name: "ToDo",
            address: "support@todo.com"
        },
        to: user.email,
        subject: "Reset Password",
        html: finalMailBody
    };

    try {
        mailer.sendMail(
            sendMailOptions,
            (error, result) => {
                console.log(result)
                error ?
                    (error.message) ? onError(error.message) :
                        onError("Something went wrong while sending email")
                    :
                    onSuccess();

            }
        )
    } catch (error) {
        error.message ? onError(error.message) : onError("Something went wrong while sending email");
    }
};

// 4. add note

export const addnote = async (req, res, next) => {
    const { userid, noteid, title, description } = req.body;

    let result;

    try {
        if (noteid) {
            result = await Notes.updateOne({ _id: noteid }, { title: title, description: description })
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
    const { noteid } = req.body;

    let result;
    try {
        result = await Notes.deleteOne({ _id: noteid });

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
    const { userid } = req.body;

    let result;
    try {
        result = await Notes.find({ userid: userid });

        res.send(result);
    } catch (error) {
        res.status(400).send(error)
    }
}