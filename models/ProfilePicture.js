const {DataTypes} = require('sequelize');
const Users = require('./Users.js');
const db = require('../config/Database.js');

const ProfilePicture = db.define('profile_picture', {
    user_id : {
        type : DataTypes.UUID,
        allowNull : false,
        references : {
            model : Users,
            key : 'id'
        }
    },
    image : {
        type : DataTypes.STRING,
        allowNull : false
    }
}, {
    freezeTableName : true,
}) 

module.exports = ProfilePicture