const RoomMembers = require("../models/RoomMembers.js")
// const Rooms = require("../models/Rooms")

const checkMember = async (req, res, next) => {
    const {team_id} = req.params;
    const {userId} = req.session;
    const findMember = await RoomMembers.findOne({
        where : {
            member_id : userId,
            room_id : team_id
        }
    })     
    if(findMember == null){
        return res.redirect(`/my-team/`)
    }
    next()
}

module.exports = checkMember