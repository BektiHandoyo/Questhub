const {DataTypes} = require('sequelize');
const db = require("../config/Database.js")

const Users = db.define('users', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        autoIncrement : false,
        primaryKey : true
    }, 
    name : {
        type : DataTypes.STRING,
        allowNull : false
    }, 
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            isEmail : true
        }
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
}, {
    freezeTableName : true
    }
)

module.exports = Users;