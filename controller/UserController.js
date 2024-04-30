const Users = require('../models/Users.js');
const ProfilePicture = require('../models/ProfilePicture.js');
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
const { Op } = require('sequelize');

dotenv.config();

const Login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await Users.findOne({
            where : {
                email : email
            }
        })
        if(user == null){
            req.flash('error', 'User Not Found')
            return res.redirect(`/login`);
        }
        const match = await bcrypt.compare(password, user.dataValues.password);
        if(!match) {
            req.flash('error', 'Password Salah');
            return res.redirect(`/login`)
        }
        req.session.userId = user.dataValues.id;
        res.redirect('/home')
    } catch (error) {
        console.log(error);
        req.flash('error', 'Internal Server Error');
        res.redirect(`/login`)
    }
}

const Register = async (req, res) => {
    const {username, email, password, pass_conf, agreement} = req.body;
    if(password != pass_conf){
        req.flash('error', 'Password and Confirmation must identic');
        return res.redirect('/register');
    }
    if(agreement == null){
        req.flash('error', 'You Must Agree With Terms and Service');
        return res.redirect('/register')
    }
    const user = await Users.findOne({
        where : {
            email : email
        }
    })
    if(user != null){
        req.flash('error', 'This Email Already Registered')
        return res.redirect('/register')
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const createdUser = await Users.create({
            name : username,
            email : email,
            password : hashedPassword
        })
        await ProfilePicture.create({
            user_id : createdUser.dataValues.id,
            image : 'default.png'
        })
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/register');
    }
}

const Logout = (req, res) => {
    try {
        if(req.session.userId){
            req.session.destroy((err) => {
                res.redirect('/');
            })
        } else {
            req.flash('error', "You're not Logged In yet");
            res.redirect('/')
        }
    
    } catch (error) {
        console.log(error);
    }
}

const searchUser = async (req, res) => {
    const {search, room_id} = req.query;
    const users = await Users.findAll({
        where : {
            [Op.or] : [
                {
                    name : {
                        [Op.like] : `%${search}%`,
                    }
                },
                {
                    email : {
                        [Op.like] : `%${search}%`
                    }                    
                }
            ]
        }
    })
    res.render('partials/search-item', {
        users,
        room_id
    })
}

module.exports = {
    Login,
    Register,
    Logout,
    searchUser,
}