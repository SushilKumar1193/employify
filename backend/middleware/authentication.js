var jwt = require('jsonwebtoken');
const JWT_SECRET = '$u$h!lkum^r'

const fetchuser =(req,res,next)=>{

    // get the id from the jwt token and add id to req obj
    const token = req.header('token');
    if(!token){
        return res.status(401).send({error: "Please authenticate a valid token"})
        
    }
    try{
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user ;
    next();
    }
    catch(error){
        res.status(401).send({error: "Please authenticate a valid token"})

    }
}

module.exports = fetchuser;