const express = require('express');
const { VerifySession, verifySessionForPartial } = require('../middleware/VerifySession');
const { createRoom, addRoomMember } = require('../controller/RoomController');
const { searchUser } = require('../controller/UserController');
const checkAdmin = require('../middleware/checkAdmin');
const { addTask, DeleteTaskSubmition, submitTaskSubmition } = require('../controller/TasksController');

const checkMember = require('../middleware/checkMember.js') 

const router = express.Router();

router.post('/api/team/create', VerifySession, createRoom);
router.get('/api/user/search', verifySessionForPartial, searchUser)
router.get('/api/:team_id/add/member', VerifySession, checkAdmin, addRoomMember)
router.post('/:team_id/api/create/task', VerifySession, checkAdmin, addTask)
router.post('/api/:team_id/submit/:task_id', VerifySession, checkMember, submitTaskSubmition);
router.delete('/api/delete/:team_id/submit/:task_id', VerifySession, checkMember, DeleteTaskSubmition)

module.exports = {
    roomRouter : router
}