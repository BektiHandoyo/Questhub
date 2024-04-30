const {DataTypes, Sequelize}  = require('sequelize');
const db = require('../config/Database.js');
const Users = require('./Users.js');

const Rooms = db.define('rooms', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        autoIncrement : false,
        primaryKey :  true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    description : {
        type : DataTypes.TEXT,
        allowNull : false,
    },
    leader_id : {
        type : DataTypes.UUID,
        allowNull : false,
        references : {
            model : Users,
            key : 'id'
        }
    },
    isFinished : {
        type : DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue : false
    },
    background_img : {
        type : DataTypes.STRING,
        allowNull : true
    }
}, {
    freezeTableName : true
})


module.exports = Rooms

