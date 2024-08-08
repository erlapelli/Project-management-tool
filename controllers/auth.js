const User = require('../models/User')
const{StatusCodes} = require('http-status-codes')
const{BadRequestError,UnauthenticatedError} = require("../errors")



// const register = async(req,res) => {

//     const user = await User.create({...req.body})
//     const token = user.createJWT() 

//     res.status(StatusCodes.CREATED).json({
//         user:{name:user.name,_id:user._id},token})
// }


const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    const token = user.createJWT();
    res.status(201).json({ user: { name: user.name, role: user.role }, token });
  };
  


const login = async(req,res)=>{

    const {email,password} = req.body 

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name,_id:user._id,role:user.role},token})
}

module.exports = {
    register,login
}