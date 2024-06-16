const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/Database.js');
const Users = require('./Users.js');
const Rooms = require('./Rooms.js');

const RoomMembers = db.define('room_members', {
    member_id : {
        type : DataTypes.UUID,
        allowNull : false,
        references : {
            model : Users,
            key : 'id'
        }
    },
    room_id : {
        type : DataTypes.UUID,
        allowNull : false,
        references : {
            model : Rooms,
            key : 'id'
        }
    }
})

RoomMembers.removeAttribute('id');

module.exports = RoomMembers;