const Tasks = require('../models/Tasks.js');
const TasksAssignment = require('../models/TasksAssignment.js');

const addTask = async(req, res) => {
    const {team_id} = req.params 
    const {name, description, deadline} = req.body
    const listOfMemberId = [];
    for(let key in req.body){
        if([name, description, deadline].findIndex(el => el == req.body[key]) == -1 ){
            listOfMemberId.push(key)
        }
    }

    if(!name || !description || !deadline){
        req.flash('error', 'Input Field must be filled in');
        return res.redirect(`/${team_id}/add/tasks`);
    }

    if(listOfMemberId.length == 0){
        req.flash('error', 'Please pick someone to do the tasks');
        return res.redirect(`/${team_id}/add/tasks`);        
    }

    try {
        const createdTask = await Tasks.create({
            name,
            description,
            room_id : team_id
        })
        listOfMemberId.forEach(async(member_id) => {
            await TasksAssignment.create({
                task_id : createdTask.dataValues.id,
                member_id,
                deadline : deadline,
            })
        })
        res.redirect(`/my-team/${team_id}`)
    } catch (error) {
        console.log(error);
        req.flash('error', 'Internal Server Error');
        res.redirect(`/${team_id}/add/tasks`);        
    }
    
}

module.exports = {
    addTask
}