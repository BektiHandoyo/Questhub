const Rooms = require("../models/Rooms");

const checkAdmin = async(req, res, next) => {
    console.log(req.params);
    const {team_id} = req.params;
    console.log(team_id);
    const {userId} = req.session;
    const room = await Rooms.findOne({
        where : {
            id : team_id
        }
    })
    if(room.dataValues.leader_id != userId){
        res.redirect(`/my-team/${room_id}`)
    }
    next()
}

module.exports = checkAdmin