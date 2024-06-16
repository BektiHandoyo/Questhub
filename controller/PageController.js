const Rooms = require('../models/Rooms.js');
const Users = require('../models/Users.js')
const RoomMembers = require('../models/RoomMembers.js');
const ProfilePicture = require('../models/ProfilePicture.js');
const TasksAssignment = require('../models/TasksAssignment.js');
const Tasks = require('../models/Tasks.js');
const dotenv = require('dotenv');
const TaskSubmittions = require('../models/TaskSubmittions.js');
const sequelize = require('sequelize');
dotenv.config()

const months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
    const today = new Date();

    const user = await Users.findOne({
        where : {
            id : id
        },
        attributes : ['name']
    })

    const listOfIncomingDeadline = [];

    const incomingDeadline = await TasksAssignment.findAll({
        where : {
            member_id : id,            
            isFinished : false
        },
        limit : 5,
        order: [
            [sequelize.literal(`CASE WHEN "deadline" < '${today.toISOString()}' THEN 0 ELSE 1 END`), 'ASC'],
            ['deadline', 'ASC']
          ],
        attributes : ['task_id', 'deadline']
    }) 

    for(let task of incomingDeadline){
        const taskId = task.dataValues.task_id; 

        const listOfWorkerId = await TasksAssignment.findAll({
            where : {
                task_id : taskId,
            }
        })

        //Get Task Name
        const taskName = await Tasks.findOne({
            where : {
                id : taskId
            },
            attributes : ['name', 'room_id', 'description']
        })
        task.dataValues.description = taskName.dataValues.description
        task.dataValues.task_name = taskName.dataValues.name
        //Get Task Name
        
        //Get Room Name of the Task 
        const roomName = await Rooms.findOne({
            where : {
                id : taskName.dataValues.room_id
            },
            attributes : ['name', 'id', 'leader_id']
        })
        task.dataValues.room_id = roomName.dataValues.id
        task.dataValues.room_name = roomName.dataValues.name
        //Get Room Name of the Task

        // Get List Of Worker
        const workersName = []; 
        const workersImage = [];
        for(let workerId of listOfWorkerId){
            if(workerId.dataValues.member_id != id){
                const workerName = await Users.findOne({
                    where : {
                        id : workerId.dataValues.member_id
                    },
                    attributes : ['name']
                })  
                workersName.push(workerName.dataValues.name)
            }
            if(workersImage.length < 3){
                const photoProfileWorker = await ProfilePicture.findOne({
                    where : {
                        user_id : workerId.dataValues.member_id
                    },
                    attributes : ['image']
                })
                workersImage.push(photoProfileWorker.dataValues.image)
            }
        } 
        task.dataValues.worker = workersName;
        task.dataValues.workerImage = workersImage;
        // Get List Of Worker

        // Get Task Progression based on total of Finished task
        let finishedTask = 0;
        for(let thisTask of listOfWorkerId){
            if(thisTask.dataValues.isFinished == true){
                finishedTask += 1;
            }
        }
        task.dataValues.progression = (finishedTask / listOfWorkerId.length) * 100 
        // Get Task Progression based on total of Finished task

        // format date deadline
        const deadlineDate = new Date(task.dataValues.deadline)
        const formatedDateDeadline = `${deadlineDate.getDate()} ${months[deadlineDate.getMonth()]} ${deadlineDate.getFullYear()}`;
        task.dataValues.deadline = formatedDateDeadline
        // format date deadline

        listOfIncomingDeadline.push(task.dataValues)
    }

    // console.log(listOfIncomingDeadline);

    res.render('pages/home', {
        incomingDeadline : listOfIncomingDeadline, 
        title : "Homepage",
        styleFile : '<link rel="stylesheet" href="/css/homepage.css">',
        userData : user.dataValues,
        imageURL : `${process.env.SUPABASE_STORAGE_URL}/profile_picture/` 
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
        profilePictureURL : process.env.SUPABASE_STORAGE_URL + '/profile_picture',
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
            profilePictureURL : process.env.SUPABASE_STORAGE_URL + '/profile_picture'
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
            // const months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const formatedDateDeadline = `${deadlineDate.getDate()} ${months[deadlineDate.getMonth()]} ${deadlineDate.getFullYear()}`;

            tasksData[i].deadline = formatedDateDeadline
        }
        const teamName = await Rooms.findOne({
            where : {
                id : team_id
            },
            attributes : ['name']
        })        // console.log(tasksData);
        res.render('pages/team', {
            team_name : teamName.dataValues.name,
            team_id,
            tasksData,
            teamMembersData,
            profilePictureURL : process.env.SUPABASE_STORAGE_URL + '/profile_picture',
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
        profilePictureURL : process.env.SUPABASE_STORAGE_URL + '/profile_picture',
        message : req.flash('error')
    })
}

async function getTaskSubmitionList(task_id){
    const submittedTaskList = [];
    const taskSubmitions = await TaskSubmittions.findAll({
        where : {
            task_id : task_id
        },
        group : ['member_id', 'createdAt'],
        attributes : ['member_id', 'createdAt', 'description'],
        order : [['createdAt', 'ASC']]
    })
    for(let gropSubmition of taskSubmitions){
        let container = {data : []};
        const {member_id, createdAt} = gropSubmition.dataValues
        const submitionDatas = await TaskSubmittions.findAll({
            where : {
                member_id,
                createdAt,
            },
            attributes : ['file', 'file_type',]
        })
        const userName = await Users.findOne({
            where : {id : member_id},
            attributes : ['name']
        })
        const userPicture = await ProfilePicture.findOne({
            where : {user_id : member_id},
            attributes : ['image']
        })
        for(let submitionData of submitionDatas){
            container.data.push(submitionData.dataValues)
        }
        container.username = userName.dataValues.name
        container.member_id = member_id
        container.profilepicture = userPicture.dataValues.image
        const createdAtDate = new Date(createdAt)
        container.createdAt = `${createdAtDate.getDate()} ${months[createdAtDate.getMonth()]} ${createdAtDate.getFullYear()}`;
        container.description = gropSubmition.dataValues.description
        submittedTaskList.push(container)
    }
    return submittedTaskList;
}


const taskDetailPage = async(req, res) => {
    const {userId} = req.session;
    const {task_id, team_id} = req.params;
    const taskAssignment = await TasksAssignment.findAll({ 
        where : {
            task_id : task_id,
        } 
    })
    let isAssign = false;
    taskAssignment.forEach(assignment => {
        if(assignment.dataValues.member_id == userId){
            isAssign = true;
        }
    })
    const task = await Tasks.findOne({where : {id : task_id}});
    if(task == null){
        return res.redirect('/my-team')
    }
    
    const room = await Rooms.findOne({
        where : {
            id : team_id
        }
    }) 

    const leaderName = await Users.findOne({
        where : {
            id : room.dataValues.leader_id      
        },
        attributes : ['name']
    })

    const deadlineDate = new Date(taskAssignment[0].dataValues.deadline)
    const createdAtDate = new Date(task.dataValues.createdAt)
    task.dataValues.deadline = `${deadlineDate.getDate()} ${months[deadlineDate.getMonth()]} ${deadlineDate.getFullYear()}`;
    task.dataValues.createdAt = `${createdAtDate.getDate()} ${months[createdAtDate.getMonth()]} ${createdAtDate.getFullYear()}`;
    task.dataValues.leader_name = leaderName.dataValues.name

    const taskSubmitionList = await getTaskSubmitionList(task_id)

    res.render('pages/task', {
        isAssign,
        currentUserId : userId,
        leaderName : leaderName.dataValues.name,
        team_id : req.params.team_id,
        task : task.dataValues,
        taskSubmitionList,
        profilePictureURL : process.env.SUPABASE_STORAGE_URL + '/profile_picture',
    });
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
    addTasksPage,
    taskDetailPage
}