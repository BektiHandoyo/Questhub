const express = require('express');
const {Login, Register, Logout} = require('../controller/UserController.js')

const router = express.Router();

router.post(`/api/login`, Login);
router.post('/api/register', Register);
router.get('/api/logout', Logout);

module.exports = {
    authRouter : router
};