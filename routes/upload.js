const { uploadProfilePicture, profileUploader } = require("../controller/ProfilePictureController");
const { submitTasks, submitionUpload, DeleteTaskSubmition, submitTaskSubmition } = require("../controller/TasksController.js");
const {VerifySession} = require('../middleware/VerifySession.js');
const checkMember = require('../middleware/checkMember.js')
const express = require('express');

const router = express.Router();

router.post('/api/profile', profileUploader.single('avatar'), VerifySession ,uploadProfilePicture);
router.post('/api/:team_id/upload/:task_id', submitionUpload.single('task-file') ,submitTasks); 
router.delete('/api/:team_id/delete/file/:task_id', VerifySession, checkMember, DeleteTaskSubmition);

module.exports = {
    uploadRoute : router
}