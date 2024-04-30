const express = require('express');
const {loginPage, landingPage, homePage, registerPage, settingPage, myTeamPage, createTeamPage, teamDetailPages, addMemberPage, addTasksPage} = require('../controller/PageController.js');
const { VerifySession } = require('../middleware/VerifySession.js');
const checkAdmin = require('../middleware/checkAdmin.js');
const router = express.Router();

router.get('/', landingPage);
router.get(`/login`, loginPage);
router.get('/register', registerPage);
router.get('/home', VerifySession, homePage);
router.get('/settings', VerifySession, settingPage);
router.get('/my-team', VerifySession, myTeamPage);
router.get('/my-team/create', VerifySession, createTeamPage);
router.get('/my-team/:team_id', VerifySession, teamDetailPages)
router.get('/:team_id/add/member', VerifySession, checkAdmin, addMemberPage)
router.get('/:team_id/add/tasks', VerifySession, checkAdmin, addTasksPage )

module.exports = {
    pageRouter : router
}