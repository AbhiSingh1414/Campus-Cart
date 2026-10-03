const jwt = require ('jsonwebtoken');
const userModel = require ('../models/user-model')

module.exports.admin = (req ,res ,next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        res.status(403).json({message : 'Access denied , admin only'});
    }
}
