const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/Database.js');
const Tasks = require('./Tasks.js');
const Users = require('./Users.js');

const TasksAssignment = db.define('task_assignment', {    
    task_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Tasks,
            key : 'id'
        }
    },
    member_id : {
        type : DataTypes.UUID,
        allowNull : false,
        references : {
            model : Users,
            key : 'id'
        }
    },
    deadline : {
        type : DataTypes.DATE,
        allowNull : false,
    },
    isFinished : {
        type : DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue : false
    }
}, {
    freezeTableName : true
}) 

TasksAssignment.removeAttribute('id');

module.exports = TasksAssignment
