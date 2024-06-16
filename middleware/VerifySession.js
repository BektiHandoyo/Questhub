const VerifySession = async(req, res, next) => {   
    const id = req.session.userId;
    if(!id){
        req.flash('error', 'Must Login For Access this page');
        return res.redirect('/login');
    }
    next()
}

const verifySessionForPartial = async(req, res, next) => {
    const id = req.session.userId;
    if(!id){
        res.send("<h1 style='color:red;'>Error, Can't be loaded<h1>")
    }
    next()
}

module.exports = {
    VerifySession,
    verifySessionForPartial
}