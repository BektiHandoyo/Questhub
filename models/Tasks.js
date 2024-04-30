const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/Database.js');
const Rooms = require('./Rooms');

const Tasks = db.define('tasks', {
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    description : {
        type : DataTypes.TEXT,
        allowNull : true
    },
    room_id : {
        type : DataTypes.UUID,
        allowNull : false,
        references : {
            model : Rooms,
            key : 'id'
        }
    },
}, {
    freezeTableName : true
})

module.exports  = Tasks
