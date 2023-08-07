//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
const md5 = require('md5');
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.set("view engine","ejs");

mongoose.connect("mongodb://127.0.0.1:27017/authenticate",console.log("Connected"));

const userSchema = new mongoose.Schema({
    email : {type : String, required : true},
    password : {type : String, required : true}
})

const secret = process.env.SECRET;

// userSchema.plugin(encrypt,{secret : secret , encryptedFields : ['password']});

const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",(req,res)=>{
    const userName = req.body.username;
    const pass = md5(req.body.password);
    const newUser = new User({
        email : userName,
        password : pass
    })
    newUser.save().then(()=>{
        res.render("secrets");
    });
})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const pass = md5(req.body.password);
    User.findOne({email : username}).then((found)=>{
        if (found) {
            if(found.password === pass){
                res.render("secrets");
            }
        }
    })
})

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})

