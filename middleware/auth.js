

module.exports ={
    userSession: (req, res, next) => {
        if (req.session.userLogin && req.session.userstatus === "Unblocked") {
            next()
        } else {
            res.redirect('/loginpage')
        }
    },
}