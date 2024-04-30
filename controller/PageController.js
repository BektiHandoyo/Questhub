const Rooms = require('../models/Rooms.js');
const Users = require('../models/Users.js')
const RoomMembers = require('../models/RoomMembers.js');
const ProfilePicture = require('../models/ProfilePicture.js');
const TasksAssignment = require('../models/TasksAssignment.js');
const Tasks = require('../models/Tasks.js');
const dotenv = require('dotenv');
dotenv.config()

const loginPage = (req, res) => {
    const id = req.session.userId
    if(id){
        return res.redirect('/home');
    }
    res.render('pages/login', {message : req.flash('error')});
}

const registerPage = (req, res) => {
    const id = req.session.userId
    if(id){
        return res.redirect('/home');
    }
    res.render('pages/register', {message : req.flash('error')});
}

const landingPage = (req, res) => {
    res.render('pages/landing')
}

const homePage = async (req, res) => {
    const id = req.session.userId;
    const user = await Users.findOne({
        where : {
            id : id
        },
        attributes : ['name']
    })
    res.render('pages/home', {
        title : "Homepage",
        styleFile : '<link rel="stylesheet" href="/css/homepage.css">',
        userData : user.dataValues
    });
}

const settingPage = async(req, res) => {
    const id = req.session.userId;
    const user = await Users.findOne({
        where : {
            id : id
        },
        attributes : ['name', 'email']
    })
    const userPicture = await ProfilePicture.findOne({
        where : {
            user_id : id,
        }
    })
    user.dataValues.profile_picture = userPicture.dataValues.image;
    res.render('pages/settings/settings', {
        title : "Settings",
        styleFile : '<link rel="stylesheet" href="/css/settings.css">',
        userData : user.dataValues,
        profilePictureURL : process.env.SUPABASE_STORAGE_URL,
        message : req.flash('error')
    })
}

const myTeamPage = async(req, res) => {
    const id = req.session.userId
    try {
        const listofRoomId = await RoomMembers.findAll({
            where : {
                member_id : id
            },
            attributes : ['room_id']
        }) 
        const roomsData = []
        for(let roomId of listofRoomId){
            const roomData = await Rooms.findOne({
                where : {
                    id : roomId.dataValues.room_id
                }
            })
            const leaderName = await Users.findOne({
                where : {
                    id : roomData.dataValues.leader_id
                },
                attributes : ['name'] 
            })
            const memberTotal = await RoomMembers.findAll({
                where : {
                    room_id : roomData.dataValues.id
                }
            })
            roomData.dataValues.leader_name = leaderName.dataValues.name
            roomData.dataValues.total_member = memberTotal.length - 1;
            let index = 0;
            const profilePictureList = [];
            for(let member of memberTotal){
                if(index == 3){
                    break;
                }
                // console.log(member.dataValues);
                const memberPicture = await ProfilePicture.findOne({
                        where : {
                            user_id : member.dataValues.member_id
                        }
                    }
                )
                // console.log(memberPicture);
                profilePictureList.push(memberPicture.dataValues.image);
                index++
            }
            roomData.dataValues.profile_pictures = profilePictureList;
            roomsData.push(roomData.dataValues);
            
        }
        // console.log(roomsData);
        res.render('pages/my-team', {
            rooms : roomsData,
            title : "My Team",
            styleFile : '<link rel="stylesheet" href="/css/my-team.css">',
            profilePictureURL : process.env.SUPABASE_STORAGE_URL
        })        
    } catch (error) {
        console.log(error);
        return res.redirect('/home')
    }   
}

const createTeamPage = (req, res) => {
    res.render('pages/create-team')
}

const teamDetailPages = async(req, res) => {
    const {team_id} = req.params;
    const {userId} = req.session;
    // console.log(req.params);
    // res.send('ok');
    try {
        const leaderId = await Rooms.findOne({
            where : {
                id : team_id
            }
        })
        const teamMembersData = [];
        const teamMembers = await RoomMembers.findAll({
            where : {
                room_id : team_id
            },
            attributes : ['member_id']
        })  
        for(let member of teamMembers ){
            const userPicture = await ProfilePicture.findOne({
                where : {
                    user_id : member.dataValues.member_id
                },
                attributes : ['image']
            })
            const userName = await Users.findOne({
                where : {
                    id : member.dataValues.member_id
                },
                attributes : ['name']
            })
            const memberData = {
                image : userPicture.dataValues.image,
                name : userName.dataValues.name
            }
            teamMembersData.push(memberData)
        }
        const tasksData = await Tasks.findAll({
            where : {
                room_id : team_id
            }
        })
        for(let i in tasksData){
            tasksData[i] = tasksData[i].dataValues
        }
        for(let i in tasksData){
            const deadline = await TasksAssignment.findOne({where : {
                task_id : tasksData[i].id
            }})
            const deadlineDate = new Date(deadline.dataValues.deadline)
            const months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const formatedDateDeadline = `${deadlineDate.getDate()} ${months[deadlineDate.getMonth()]} ${deadlineDate.getFullYear()}`;

            tasksData[i].deadline = formatedDateDeadline
        }
        // console.log(tasksData);
        res.render('pages/team', {
            team_id,
            tasksData,
            teamMembersData,
            profilePictureURL : process.env.SUPABASE_STORAGE_URL,
            isAdmin : leaderId.dataValues.leader_id == userId
        })
    } catch (error) {
        console.log(error);
        res.redirect('/my-team');
    }
}

const addMemberPage = async(req, res) => {
    const {team_id} = req.params;
    res.render('pages/add-member', {
        team_id,
        message : req.flash('error')
    })
}

const addTasksPage = async(req, res) => {
    const {team_id} = req.params;
    const teamMember = await RoomMembers.findAll({
        where : {room_id : team_id},
        attributes : ['member_id']
    })

    const listOfMemberData = [];

    for(let member of teamMember){
        const memberData = await Users.findOne({
            where : { id : member.dataValues.member_id },
            attributes : ['name', 'email']
        })
        const profilePict = await ProfilePicture.findOne({
            where : {
                user_id : member.dataValues.member_id
            },
            attributes : ['image']
        })
        member.dataValues.name = memberData.dataValues.name
        member.dataValues.email = memberData.dataValues.email
        member.dataValues.profile_picture = profilePict.dataValues.image
        
        listOfMemberData.push(member.dataValues)
    }

    // console.log(listOfMemberData);

    res.render('pages/add-task', {
        team_id,
        teamMember : listOfMemberData,
        profilePictureURL : process.env.SUPABASE_STORAGE_URL,
        message : req.flash('error')
    })
}

module.exports = {
    landingPage,
    loginPage,
    registerPage,
    homePage,
    settingPage,
    myTeamPage,
    createTeamPage,
    teamDetailPages,
    addMemberPage,
    addTasksPage
}