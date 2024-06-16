const TaskSubmittions = require('../models/TaskSubmittions.js');
const Tasks = require('../models/Tasks.js');
const TasksAssignment = require('../models/TasksAssignment.js');
const multer  = require('multer');
const dotenv = require('dotenv')
const {decode} = require('base64-arraybuffer')
const {createClient} = require('@supabase/supabase-js');
const { where } = require('sequelize');
dotenv.config()
const storage = multer.memoryStorage({
    filename: function (req, file, cb) {
        cb(null, `${new Date()}-${file.originalname}`) //
    },
})
const upload = multer({ storage : storage })
const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_ANON_KEY);

const checkAssignment = async (userId, taskId) => {
    const taskAssignment = await TasksAssignment.findAll({ 
        where : {
            task_id :taskId,
            member_id : userId
        } 
    })
    return taskAssignment == null
}

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

const submitTasks = async(req, res) => {
    const file = decode(req.file.buffer.toString('base64'));
    // console.log(file);
    if(req.file.size > 104857600){
        return res.json({error : "file size can't be more than 100 MB"})
    }
    try {      
      const {data, error} = await supabase.storage.from('task_submition').upload(`${new Date().toISOString()}-${req.file.originalname}`, file, {
        contentType : req.file.mimetype
      })
    //   console.log(data);
      data['content-type'] = req.file.mimetype
      res.json({
        fileName : req.file.originalname,
        path : data.fullPath,
        'content-type' : req.file.mimetype,        
       }) 
    } catch (error) {
      console.log(error);
      res.json({error : 'Internal Server Error'});
    }
}

const submitTaskSubmition = async(req, res) => {
    const user_id = req.session.userId
    const {team_id, task_id} = req.params
    const {data, description} = req.body
    const newFormatData = [];
    const {SUPABASE_STORAGE_URL} = process.env
    data.forEach(file => {
        const {path} = file
        const fileUrl = `${SUPABASE_STORAGE_URL}/${path}`
        const storedData = {
            file : fileUrl,
            member_id : user_id,
            task_id,
            description,
        };
        newFormatData.push(storedData);
    })
    try {
        await TaskSubmittions.bulkCreate(newFormatData);
        const editAssignmentVar = await TasksAssignment.findOne({
            where : {
                task_id,
                member_id : user_id
            } 
        })
        await editAssignmentVar.set('isFinisehd', true)
        res.send(`/${team_id}/task/${task_id}`);
    } catch (error) {
        console.log(error);
        res.json({error : 'Internal Server Error'})
    }
}

const DeleteTaskSubmition = async(req, res) => {
    const {file_name} = req.query;
    const {task_id, team_id} = req.params
    const user_id = req.session.userId;
    console.log(file_name);
    const isNotAssign = await checkAssignment(user_id, task_id) 

    if(isNotAssign){
        return res.json({message : "You shouldn't be able to do that "})
    }

    const deleteResults = await supabase.storage.from('task_submition').remove([file_name.split('/')[1]])

    if(deleteResults.error != null){
        return res.status(400).json({message : 'Error', error : deleteResults.error});
    }

    const deletedFile = await TaskSubmittions.findOne({where : {file : `${process.env.SUPABASE_STORAGE_URL}/${file_name}`}})
    
    if(deletedFile != null){
        await deletedFile.destroy();
    }

    console.log(deleteResults.error);
    res.json({message : 'success'});
}

module.exports = {
    addTask,
    submitTasks,
    DeleteTaskSubmition,
    submitTaskSubmition,
    submitionUpload : upload
}