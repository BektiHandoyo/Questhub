const { uploadProfilePicture, profileUploader } = require("../controller/ProfilePictureController");
const {VerifySession} = require('../middleware/VerifySession.js');
const express = require('express');

const router = express.Router();

router.post('/api/profile', profileUploader.single('avatar'), VerifySession ,uploadProfilePicture);

module.exports = {
    uploadRoute : router
}