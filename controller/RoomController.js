const Rooms = require('../models/Rooms.js');
const RoomMembers = require('../models/RoomMembers.js');

const createRoom = async(req, res) => {
    const user_id = req.session.userId;
    const {name, description} = req.body;
    const teamBackground = ['1.png', '2.png', '3.png', '4.png'];
    try {
        const createdRoom = await Rooms.create({
            name : name,
            description : description,
            leader_id : user_id,
            background_img : teamBackground[Math.round(Math.random() * teamBackground.length - 1)],  
        })
        await RoomMembers.create({
            member_id : user_id,
            room_id : createdRoom.dataValues.id
        })
        res.redirect('/my-team');
    } catch (error) {
        console.log(error);
        res.redirect('/my-team');
    }
}

const addRoomMember = async(req, res) => {
    const room_id = req.params.team_id;
    const {user} = req.query;
    console.log(room_id, user);
    try {
        const checkMembers = await RoomMembers.findAll({
            where : {
                room_id : room_id,
                member_id : user
            }
        })
        console.log(checkMembers);
        if(checkMembers.length != 0){    
            req.flash('error', 'User Sudah Ditambahkan')
            return res.redirect(`/${room_id}/add/member`)
        }
        await RoomMembers.create({
            member_id : user,
            room_id : room_id
        })
        res.redirect(`/${room_id}/add/member`)
    } catch (error) {
        req.flash('error', 'Internal Server Error')
        res.redirect(`/${room_id}/add/member`)
        console.log(error);
    }
}

module.exports = {
    createRoom,
    addRoomMember
}