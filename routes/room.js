const express = require('express');
const { VerifySession, verifySessionForPartial } = require('../middleware/VerifySession');
const { createRoom, addRoomMember } = require('../controller/RoomController');
const { searchUser } = require('../controller/UserController');
const checkAdmin = require('../middleware/checkAdmin');
const { addTask } = require('../controller/TasksController');

const router = express.Router();

router.post('/api/team/create', VerifySession, createRoom);
router.get('/api/user/search', verifySessionForPartial, searchUser)
router.get('/api/:team_id/add/member', VerifySession, checkAdmin, addRoomMember)
router.post('/:team_id/api/create/task', VerifySession, checkAdmin, addTask)

module.exports = {
    roomRouter : router
}