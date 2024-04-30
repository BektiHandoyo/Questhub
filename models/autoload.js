const Users = require("./Users.js");
const Rooms = require("./Rooms.js");
const RoomMembers = require("./RoomMembers.js");
const Tasks = require('./Tasks.js');
const TasksAssignment = require('./TasksAssignment.js');
const ProfilePicture = require("./ProfilePicture.js");

const listOfModels = [Users, Rooms, RoomMembers, Tasks, TasksAssignment, ProfilePicture];

module.exports = listOfModels