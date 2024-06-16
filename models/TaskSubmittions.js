const db = require('../config/Database.js');
const Users = require('./Users.js');
const Tasks = require('./Tasks.js');
const {DataTypes} = require('sequelize');


const TaskSubmittions = db.define('task_submissions', {
    file : {
        type : DataTypes.STRING,
        allowNull : false
    }, 
    member_id : {
        type : DataTypes.UUID,
        allowNull : false,
        references : {
            model : Users,
            key : 'id'
        }
    },
    task_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Tasks,
            key : 'id'
        }
    },
    description : {
        type : DataTypes.TEXT,
        allowNull : true,
    }
});

module.exports = TaskSubmittions;