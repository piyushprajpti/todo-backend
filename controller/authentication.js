import User from "../schema/User.js";
import Notes from "../schema/Notes.js";
import nodeMailer from "nodemailer";
import Handlebars from "handlebars";
import Otp from "../schema/Otp.js";

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


        if (result) {
            const otp = Math.floor(100000 + Math.random() * 900000)

            let doc = await Otp.findOneAndUpdate(
                {
                    email: result.email
                },
                {
                    otp: otp
                },
                {
                    upsert: true,
                    new: true
                }
            );

            await sendResetMail(result, otp,
                (message) => {
                    throw { message: message }
                }
                ,
                () => {
                    res.send({"response": "Success! OTP sent to registered email address."});
                }
            );
        }
        res.send({"response": "Success! OTP sent to registered email address."});


    } catch (error) {

        res.status(422).send(error);
    }

}

const sendResetMail = async (user, otp, onError, onSuccess) => {
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
    
            #title {
                width: 100%;
                color: #2563eb;
                font-size: 28px;
                padding: 10px;
                border-bottom: 2px solid #e7e7e7;
            }
    
            p {
                width: 100%;
                font-weight: 400;
                padding: 8px;
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
    
            #otp {
                margin: 10px;
                text-decoration: none;
                font-weight: 700;
                color: #2563eb;
                padding: 16px 20px;
                font-size: 36px;
                width: fit-content;
                letter-spacing: 1.3px;
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
        <p id="title">ToDo - Quick Notes</p>
        <p id="header"> Dear <span style="margin-left: 12px; color: #457aed;">{{name}}</span> </p>
        <p>Here is your OTP to reset your account password.</p>
        <br>
        <div>
            <p id="otp">{{otp}}</p>
        </div>
        <p id="footer">
            You have received this email because you have an account associated with this email address on ToDo - Quick Notes website or android app
        </p>
    </body>
    
    </html>
	`;

    const mailBodyTemplate = Handlebars.compile(mailBody);

    const finalMailBody = mailBodyTemplate({
        name: user.name,
        otp: otp
    });

    const sendMailOptions = {
        from: {
            name: "ToDo - Quick Notes",
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
                error ?
                    (error.message) ? onError(error) :
                        onError({ "message": "Something went wrong while sending email" })
                    :
                    onSuccess();

            }
        )
    } catch (error) {
        error.message ? onError(error) : onError({ "message": "Something went wrong while sending email" });
    }
};

// 4. fetch otp

export const fetchotp = async (req, res, next) => {
    const { email, otp } = req.body;

    let result;

    try {
        result = await Otp.findOne({ email: email, otp: otp })

        if (result === null) {
            throw { message: "Invalid OTP, Please try again" }
        } else {
            res.send({"response":"OTP verification successfull"})
        }
    } catch (error) {
        res.status(422).send(error)
    }
}

//5. update password

export const updatepassword = async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    let result;

    try {
        if (password.trim() === "" || confirmPassword.trim() === "") {
            throw{ message: "Fields can't be empty" }
        }
        if (password !== confirmPassword) {
            throw { message: "Password mismatch" }
        }

        result = await User.updateOne({ email: email }, { password: password });

        res.send({"response":"Password updated successfully. Login to continue"})
    } catch (error) {
        res.status(422).send(error);
    }
}

// 6. add note

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

// 7. delete note 

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

// 8. profile page

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

// 9. fetch all notes 

export const fetchallnotes = async (req, res, next) => {
    const { userid } = req.body;

    let result;
    try {
        result = await Notes.find({ userid: userid });

        res.send(result);
    } catch (error) {
        res.status(400).send(error)
    }
}

// 10. fetch single note 

export const fetchanote = async (req, res, next) => {
    const { noteid } = req.body;

    let result;
    try {
        result = await Notes.findById(noteid);

        res.send(result);
    } catch (error) {
        res.status(400).send(error)
    }
}