const User = require('../models/User')
const jwt = require ('jsonwebtoken') 
const {UnauthenticatedError} = require('../errors')
require('dotenv').config();


const auth = async (req,res,next) =>{
    const authHeader = req.headers.authorization 
    //console.log('Authorization Header:', authHeader);

    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication invalid')
    }

    const token = authHeader.split(' ')[1]
    //console.log('Token:', token);

    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET )
        //console.log('payload', payload);
        req.user = { userId: payload.userId, name: payload.name, role: payload.role };
         //console.log('Authenticated User:', req.user); 
        next()

    }catch(error){
        throw new UnauthenticatedError('Authentication invalid')

    }
}

module.exports = auth