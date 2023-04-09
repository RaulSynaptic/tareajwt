const jwt = require("jsonwebtoken")
const express = require("express");
const User = require("./model/user");
const bcrypt = require("bcryptjs/dist/bcrypt");
const auth = require("./middleware/auth")

require("dotenv").config();
require("./config/database").connect();

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).send("Hello World 👋");
});

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 👋");
});


app.post("/register", async (req,res) => {
    try{
        const {first_name, last_name,email, password} = req.body;

        if(!(first_name, last_name,email, password)){
            res.status(400).send("Complete all form is required")
        }

        const oldUser = await User.findOne({ email })

        if(oldUser) {
            return res.status(409).send("User already exist.")
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token;

        res.status(201).json(user);
    } catch (err) {
        console.log(err)
    }
})

app.post("/login", async (req,res) => {
    try {
        
        const {email, password} = req.body;

        if(!(email && password)) {
            res.status(400).send("Complete all form is required")
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            res.status(200).json(user);
        }
        //res.status(400).send("Invalid Credentials")  Esta linea da error ya que se manda un status antes.

    } catch (err) {
        console.log(err)
    }
})

module.exports = app;